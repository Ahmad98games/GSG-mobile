import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { supabase } from '@/src/lib/supabase'

const QUEUE_KEY = 'noxis_offline_queue'
const MAX_ATTEMPTS = 8
const MAX_QUEUE_SIZE = 500

// Exponential backoff delays (seconds):
// Attempt 1: 5s
// Attempt 2: 10s
// Attempt 3: 30s
// Attempt 4: 60s  (1 min)
// Attempt 5: 300s (5 min)
// Attempt 6: 600s (10 min)
// Attempt 7: 1800s(30 min)
// Attempt 8+: 3600s(1 hour)
const BACKOFF_DELAYS = [5, 10, 30, 60, 300, 600, 1800, 3600]

export interface QueueItem {
  id: string
  table: string
  operation: 'INSERT' | 'UPDATE' | 'DELETE'
  payload: Record<string, any>
  createdAt: number
  attempts: number
  lastAttemptAt: number | null
  nextRetryAt: number | null
  error: string | null
  /** Source identifier for deduplication */
  idempotencyKey: string
}

// ── READ / WRITE QUEUE ──────────────────────────────────────────────────────

async function readQueue(): Promise<QueueItem[]> {
  try {
    const raw = await AsyncStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

async function writeQueue(items: QueueItem[]): Promise<void> {
  try {
    // Keep only the most recent MAX_QUEUE_SIZE items
    const trimmed = items.slice(-MAX_QUEUE_SIZE)
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(trimmed))
  } catch (err) {
    console.error('[Queue] Write failed:', err)
  }
}

// ── ENQUEUE ─────────────────────────────────────────────────────────────────

async function enqueue(
  table: string,
  operation: 'INSERT' | 'UPDATE' | 'DELETE',
  payload: any,
  idempotencyKey: string
): Promise<void> {
  const queue = await readQueue()

  // Deduplication — don't queue the same item twice
  const alreadyQueued = queue.some(
    (item) => item.idempotencyKey === idempotencyKey
  )
  if (alreadyQueued) {
    console.log('[Queue] Duplicate item skipped:', table)
    return
  }

  const item: QueueItem = {
    id: `${table}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    table,
    operation,
    payload,
    createdAt: Date.now(),
    attempts: 0,
    lastAttemptAt: null,
    nextRetryAt: Date.now() + 5000, // first retry after 5 s
    error: null,
    idempotencyKey,
  }

  queue.push(item)
  await writeQueue(queue)

  console.log(`[Queue] Added: ${table} (queue size: ${queue.length})`)
}

/** Legacy options object — accepted for backwards compatibility. */
interface WriteOptions {
  operation?: 'insert' | 'upsert' | 'INSERT' | 'UPDATE'
  conflictColumns?: string[]
  notifyHub?: string
}

/**
 * Write to Supabase; if offline or a network error occurs, queue for later.
 *
 * Accepts two call styles:
 *
 * New (preferred):
 *   writeWithSync('table', payload, 'INSERT')
 *   writeWithSync('table', payload, 'UPDATE', idempotencyKey)
 *
 * Legacy (still supported — zero callers need changing):
 *   writeWithSync('table', data, { operation: 'upsert', conflictColumns: [...] })
 */
export async function writeWithSync<T extends Record<string, any>>(
  table: string,
  payload: T,
  operationOrOptions?: 'INSERT' | 'UPDATE' | WriteOptions,
  idempotencyKey?: string
): Promise<{ success: boolean; queued: boolean; data?: any }> {
  // ── Normalise arguments ──────────────────────────────────────────────────
  let operation: 'INSERT' | 'UPDATE' = 'INSERT'
  let conflictColumns: string[] | undefined

  if (typeof operationOrOptions === 'string') {
    operation = operationOrOptions
  } else if (operationOrOptions && typeof operationOrOptions === 'object') {
    const op = (operationOrOptions.operation || 'insert').toUpperCase()
    // Map legacy 'upsert' → 'INSERT' (drainQueue uses upsert with onConflict:'id')
    operation = op === 'UPDATE' ? 'UPDATE' : 'INSERT'
    conflictColumns = operationOrOptions.conflictColumns
    // notifyHub is intentionally ignored — Hub is notified by TCPClientService
  }

  // Generate idempotency key to prevent duplicate writes on retry
  const iKey =
    idempotencyKey ||
    `${table}-${JSON.stringify(payload).slice(0, 100)}-${Date.now()}`

  try {
    const netState = await NetInfo.fetch()
    const isOnline =
      netState.isConnected && netState.isInternetReachable

    if (isOnline) {
      let result: { data: any; error: any }

      if (operation === 'INSERT') {
        if (conflictColumns && conflictColumns.length > 0) {
          // Legacy upsert with explicit conflict columns
          result = await (supabase
            .from(table)
            .upsert(payload as any, {
              onConflict: conflictColumns.join(','),
              ignoreDuplicates: false,
            })
            .select()
            .single() as any)
        } else {
          result = await (supabase
            .from(table)
            .insert(payload as any)
            .select()
            .single() as any)
        }
      } else {
        const { id, ...rest } = payload as any
        result = await (supabase
          .from(table)
          .update(rest)
          .eq('id', id)
          .select()
          .single() as any)
      }

      if (!result.error) {
        return { success: true, queued: false, data: result.data }
      }

      const err = result.error as any
      // Network-class error → queue it
      if (
        err.code === 'PGRST301' ||
        err.message?.includes('network') ||
        err.message?.includes('fetch')
      ) {
        await enqueue(table, operation, payload, iKey)
        return { success: false, queued: true }
      }

      // Supabase logic error — don't queue (would fail again)
      console.error(`[writeWithSync] ${table} error:`, err.message)
      return { success: false, queued: false }
    }
  } catch {
    // Network unavailable — fall through to queue
  }

  // Offline — add to queue
  await enqueue(table, operation, payload, iKey)
  return { success: false, queued: true }
}

// ── DRAIN QUEUE ──────────────────────────────────────────────────────────────

/**
 * Process all queue items whose nextRetryAt is in the past.
 * Uses exponential backoff on failures; stops immediately on network errors.
 * Call this when the network connection is restored.
 */
let isDraining = false

export async function drainQueue(): Promise<{
  processed: number
  failed: number
  remaining: number
}> {
  if (isDraining) {
    return { processed: 0, failed: 0, remaining: 0 }
  }

  isDraining = true
  let processed = 0
  let failed = 0

  try {
    const queue = await readQueue()
    const now = Date.now()

    // Only process items whose nextRetryAt is in the past
    const ready = queue.filter(
      (item) => !item.nextRetryAt || item.nextRetryAt <= now
    )

    console.log(
      `[Queue] Draining ${ready.length} of ${queue.length} items`
    )

    const updatedQueue = [...queue]

    for (const item of ready) {
      try {
        let error: any = null

        if (item.operation === 'INSERT') {
          const result = await supabase
            .from(item.table)
            .upsert(item.payload, {
              onConflict: 'id',
              ignoreDuplicates: true,
            })
          error = result.error
        } else if (item.operation === 'UPDATE') {
          const { id, ...rest } = item.payload
          const result = await supabase
            .from(item.table)
            .update(rest)
            .eq('id', id)
          error = result.error
        } else if (item.operation === 'DELETE') {
          const result = await supabase
            .from(item.table)
            .delete()
            .eq('id', item.payload.id)
          error = result.error
        }

        if (!error) {
          // ✓ Success — remove from queue
          const idx = updatedQueue.findIndex((i) => i.id === item.id)
          if (idx > -1) updatedQueue.splice(idx, 1)
          processed++
          console.log(`[Queue] ✓ ${item.table} processed`)
        } else {
          // Supabase error — apply exponential backoff
          const idx = updatedQueue.findIndex((i) => i.id === item.id)
          if (idx > -1) {
            const newAttempts = (updatedQueue[idx].attempts || 0) + 1
            const delaySeconds =
              BACKOFF_DELAYS[
                Math.min(newAttempts - 1, BACKOFF_DELAYS.length - 1)
              ]

            updatedQueue[idx] = {
              ...updatedQueue[idx],
              attempts: newAttempts,
              lastAttemptAt: Date.now(),
              nextRetryAt: Date.now() + delaySeconds * 1000,
              error: error.message,
            }

            // Give up after MAX_ATTEMPTS
            if (newAttempts >= MAX_ATTEMPTS) {
              console.error(
                `[Queue] ABANDONED after ${MAX_ATTEMPTS} attempts:`,
                item.table,
                error.message
              )
              updatedQueue.splice(idx, 1)
            }

            failed++
          }
        }
      } catch (networkErr: any) {
        // Network failure — update backoff and stop draining
        // (no point continuing if the network is down)
        const idx = updatedQueue.findIndex((i) => i.id === item.id)
        if (idx > -1) {
          const newAttempts = (updatedQueue[idx].attempts || 0) + 1
          const delaySeconds =
            BACKOFF_DELAYS[
              Math.min(newAttempts - 1, BACKOFF_DELAYS.length - 1)
            ]

          updatedQueue[idx] = {
            ...updatedQueue[idx],
            attempts: newAttempts,
            lastAttemptAt: Date.now(),
            nextRetryAt: Date.now() + delaySeconds * 1000,
            error: networkErr.message,
          }
        }

        console.log('[Queue] Network failure — stopping drain')
        break // Stop processing — wait for next reconnect
      }
    }

    await writeQueue(updatedQueue)

    const remaining = updatedQueue.length
    console.log(
      `[Queue] Drain complete: ${processed} processed, ` +
        `${failed} failed, ${remaining} remaining`
    )

    return { processed, failed, remaining }
  } finally {
    isDraining = false
  }
}

// ── STATS & UTILITIES ────────────────────────────────────────────────────────

/** Returns total number of items waiting to sync. */
export async function getPendingCount(): Promise<number> {
  const queue = await readQueue()
  return queue.length
}

/** Returns a breakdown of queue state for the UI. */
export async function getQueueStats(): Promise<{
  total: number
  ready: number
  waiting: number
  failed: number
}> {
  const queue = await readQueue()
  const now = Date.now()

  return {
    total: queue.length,
    ready: queue.filter((i) => !i.nextRetryAt || i.nextRetryAt <= now)
      .length,
    waiting: queue.filter((i) => i.nextRetryAt && i.nextRetryAt > now)
      .length,
    failed: queue.filter((i) => i.attempts >= MAX_ATTEMPTS).length,
  }
}

/** Manual queue reset — clears all pending items. */
export async function clearQueue(): Promise<void> {
  await AsyncStorage.removeItem(QUEUE_KEY)
}

/**
 * Legacy compatibility shim — called by TCPClientService on Hub reconnect.
 * @deprecated Use drainQueue() directly.
 */
export function onHubReconnect(): void {
  drainQueue()
}
