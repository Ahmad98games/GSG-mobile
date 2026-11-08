import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { supabase } from '@/src/lib/supabase'
import { HapticFeedback } from '@/src/utils/haptics'
import { tcpService, notifyHub } from '@/src/services/TCPClientService'

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
  operation: 'INSERT' | 'UPDATE' | 'DELETE' | 'RPC'
  rpcName?: string
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

  // Compute Monotonic Vector Clock timestamp metadata
  const vectorClock = {
    node_id: 'MOBILE_TERMINAL',
    logical_clock: Date.now(),
    wall_time: new Date().toISOString(),
  }

  const validBizId =
    payload.business_id && payload.business_id !== 'local-biz-main'
      ? payload.business_id
      : 'ffa84a41-941e-4e4e-87c3-9580271db2bd'

  const enrichedPayload = {
    ...payload,
    business_id: validBizId,
    vector_clock: vectorClock,
    synced_at: new Date().toISOString(),
  }

  // Generate idempotency key to prevent duplicate writes on retry
  const iKey =
    idempotencyKey ||
    `${table}-${JSON.stringify(payload).slice(0, 100)}-${Date.now()}`

  // Broadcast CRDT Mesh Sync Event and table-specific events to Master PC Hub via WebSocket
  let sentToHub = false
  if (tcpService.getStatus()) {
    try {
      tcpService.sendEvent('crdt_sync_event', {
        table,
        operation,
        payload: enrichedPayload,
        idempotency_key: iKey,
        vector_clock: vectorClock,
      })

      if (table === 'invoices') {
        notifyHub('INVOICE_CREATED', enrichedPayload)
      } else if (table === 'parties') {
        notifyHub(operation === 'UPDATE' ? 'PARTY_UPDATED' : 'PARTY_CREATED', { party: enrichedPayload })
      } else if (table === 'karigars' || table === 'workers') {
        notifyHub('WORKER_CREATED', enrichedPayload)
      } else if (table === 'attendance' || table === 'attendance_logs') {
        notifyHub('ATTENDANCE_LOGGED', enrichedPayload)
      } else if (table === 'peshgi_transactions' || table === 'advances') {
        notifyHub('ADVANCE_GIVEN', enrichedPayload)
      } else if (table === 'production_logs') {
        notifyHub('PRODUCTION_LOGGED', enrichedPayload)
      } else if (table === 'skus') {
        notifyHub('STOCK_UPDATED', enrichedPayload)
      }
      sentToHub = true
    } catch (err) {
      console.warn('[OfflineSyncService] Socket broadcast failed:', err)
    }
  }

  // Fast-path HTTP REST sync to PC Hub port 7447
  if (!sentToHub) {
    try {
      const { useBridgeStatusStore } = require('@/src/stores/BridgeStatusStore')
      const hubIp = (useBridgeStatusStore.getState().hubIp || '192.168.0.102').replace(/^wss?:\/\//, '').split(/[:/]/)[0]
      const controller = new AbortController()
      const tId = setTimeout(() => controller.abort(), 1200)
      fetch(`http://${hubIp}:7447/api/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          table,
          operation,
          payload: enrichedPayload,
          idempotencyKey: iKey,
        }),
        signal: controller.signal,
      }).then(r => {
        clearTimeout(tId)
        if (r.ok) sentToHub = true
      }).catch(() => {})
    } catch {}
  }

  // Non-blocking broadcast to Supabase Realtime Mesh
  try {
    const { RealtimeMeshSyncEngine } = require('./RealtimeMeshSyncEngine')
    RealtimeMeshSyncEngine.broadcastSyncEvent(table, operation, enrichedPayload)
  } catch (err) {}

  // Background cloud write attempt with 2s timeout race (never blocks UI)
  (async () => {
    try {
      const netState = await NetInfo.fetch()
      if (netState.isConnected) {
        const { vector_clock: _vc, synced_at: _sa, ...cleanDbPayload } = enrichedPayload as any;
        let targetPayload = cleanDbPayload as any;
        if (table === 'ledger_entries') {
          const { created_by, created_by_role, idempotency_key, attachmentUri, reference, ...validLedger } = cleanDbPayload as any;
          targetPayload = {
            ...validLedger,
            tx_ref: reference || cleanDbPayload.tx_ref || ('MOB-' + Date.now()),
            status: cleanDbPayload.status || 'posted',
            posted_at: cleanDbPayload.posted_at || cleanDbPayload.entry_date || new Date().toISOString(),
          };
        }
        const cloudFn = async () => {
          if (operation === 'INSERT') {
            return conflictColumns && conflictColumns.length > 0
              ? supabase.from(table).upsert(targetPayload as any, { onConflict: conflictColumns.join(','), ignoreDuplicates: false })
              : supabase.from(table).insert(targetPayload as any)
          } else {
            const { id, ...rest } = targetPayload as any
            return supabase.from(table).update(rest).eq('id', id)
          }
        }
        await Promise.race([
          cloudFn(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
        ])
      }
    } catch {}
  })()

  if (sentToHub) {
    HapticFeedback.success()
    return { success: true, queued: false, data: enrichedPayload }
  }

  // Offline or PC Hub not connected — queue securely in AsyncStorage
  await enqueue(table, operation, enrichedPayload, iKey)
  HapticFeedback.success()
  return { success: false, queued: true }
}

// ── DRAIN QUEUE ──────────────────────────────────────────────────────────────

/**
 * Process all queue items whose nextRetryAt is in the past.
 * Dispatches to PC Hub instantly if connected and attempts Cloud Supabase with timeouts.
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

    const ready = queue.filter(
      (item) => !item.nextRetryAt || item.nextRetryAt <= now
    )

    if (ready.length === 0) {
      return { processed: 0, failed: 0, remaining: queue.length }
    }

    console.log(`[Queue] Draining ${ready.length} of ${queue.length} items`)

    const isHubConnected = tcpService.getStatus()
    const updatedQueue = [...queue]

    for (const item of ready) {
      let syncedToDestination = false

      // 1. If connected to PC Hub LAN bridge, dispatch immediately
      if (isHubConnected) {
        try {
          tcpService.sendEvent('crdt_sync_event', {
            table: item.table,
            operation: item.operation,
            payload: item.payload,
            idempotency_key: item.idempotencyKey,
          })

          if (item.table === 'invoices') {
            notifyHub('INVOICE_CREATED', item.payload)
          } else if (item.table === 'parties') {
            notifyHub(item.operation === 'UPDATE' ? 'PARTY_UPDATED' : 'PARTY_CREATED', { party: item.payload })
          } else if (item.table === 'karigars' || item.table === 'workers') {
            notifyHub('WORKER_CREATED', item.payload)
          } else if (item.table === 'attendance' || item.table === 'attendance_logs') {
            notifyHub('ATTENDANCE_LOGGED', item.payload)
          } else if (item.table === 'peshgi_transactions' || item.table === 'advances') {
            notifyHub('ADVANCE_GIVEN', item.payload)
          } else if (item.table === 'production_logs') {
            notifyHub('PRODUCTION_LOGGED', item.payload)
          } else if (item.table === 'skus') {
            notifyHub('STOCK_UPDATED', item.payload)
          }
          syncedToDestination = true
        } catch (e) {
          console.warn('[Queue] Failed to send item to PC Hub:', e)
        }
      }

      // 2. Also attempt Cloud Supabase with 2s timeout race
      try {
        const netState = await NetInfo.fetch()
        if (netState.isConnected) {
          const cloudFn = async () => {
            if (item.operation === 'RPC') {
              return supabase.rpc(item.rpcName || 'complete_sale', item.payload)
            } else if (item.operation === 'INSERT') {
              const { vector_clock: _vc, synced_at: _sa, ...clean } = item.payload || {}
              let cleanData = clean as any;
              if (item.table === 'ledger_entries') {
                const { created_by, created_by_role, idempotency_key, attachmentUri, reference, ...validLedger } = clean as any;
                cleanData = {
                  ...validLedger,
                  tx_ref: reference || clean.tx_ref || ('MOB-' + Date.now()),
                  status: clean.status || 'posted',
                  posted_at: clean.posted_at || clean.entry_date || new Date().toISOString(),
                };
              }
              return supabase.from(item.table).upsert(cleanData, { onConflict: 'id', ignoreDuplicates: true })
            } else if (item.operation === 'UPDATE') {
              const { id, vector_clock: _vc, synced_at: _sa, ...rest } = item.payload || {}
              return supabase.from(item.table).update(rest).eq('id', id)
            } else if (item.operation === 'DELETE') {
              return supabase.from(item.table).delete().eq('id', item.payload?.id)
            }
            return null
          }

          const result: any = await Promise.race([
            cloudFn(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000))
          ])
          if (!result?.error) {
            syncedToDestination = true
          }
        }
      } catch (cloudErr) {
        // If already delivered to PC Hub, ignore cloud error
      }

      // 3. Direct HTTP REST fallback to PC Hub bridge daemon (port 7447)
      if (!syncedToDestination) {
        try {
          const { useBridgeStatusStore } = require('@/src/stores/BridgeStatusStore')
          const hubIp = (useBridgeStatusStore.getState().hubIp || '192.168.0.102').replace(/^wss?:\/\//, '').split(/[:/]/)[0]
          const ctrl = new AbortController()
          const timer = setTimeout(() => ctrl.abort(), 1500)
          const res = await fetch(`http://${hubIp}:7447/api/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              table: item.table,
              operation: item.operation,
              payload: item.payload,
              idempotencyKey: item.idempotencyKey,
            }),
            signal: ctrl.signal,
          })
          clearTimeout(timer)
          if (res.ok) {
            syncedToDestination = true
          }
        } catch {}
      }

      if (syncedToDestination) {
        const idx = updatedQueue.findIndex((i) => i.id === item.id)
        if (idx > -1) updatedQueue.splice(idx, 1)
        processed++
        console.log(`[Queue] ✓ ${item.table} successfully synced`)
      } else {
        const idx = updatedQueue.findIndex((i) => i.id === item.id)
        if (idx > -1) {
          const newAttempts = (updatedQueue[idx].attempts || 0) + 1
          const delaySeconds = BACKOFF_DELAYS[Math.min(newAttempts - 1, BACKOFF_DELAYS.length - 1)]
          updatedQueue[idx] = {
            ...updatedQueue[idx],
            attempts: newAttempts,
            lastAttemptAt: Date.now(),
            nextRetryAt: Date.now() + delaySeconds * 1000,
          }
          if (newAttempts >= MAX_ATTEMPTS) {
            console.error(`[Queue] ABANDONED after ${MAX_ATTEMPTS} attempts:`, item.table)
            updatedQueue.splice(idx, 1)
          }
          failed++
        }
      }
    }

    await writeQueue(updatedQueue)

    // Pull fresh merged data from PC Hub if items were processed
    if (processed > 0 && isHubConnected) {
      try {
        const { LocalDataManager } = require('./LocalDataManager')
        LocalDataManager.forcePullFromHub().catch(() => {})
      } catch {}
    }

    return { processed, failed, remaining: updatedQueue.length }
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

/** Enqueue complete atomic sale RPC for offline playback. */
export async function enqueueAtomicSale(
  clientTxId: string,
  rpcPayload: Record<string, any>
): Promise<void> {
  const queue = await readQueue()

  const alreadyQueued = queue.some((item) => item.idempotencyKey === clientTxId)
  if (alreadyQueued) {
    return
  }

  const item: QueueItem = {
    id: `sale-rpc-${clientTxId}`,
    table: 'invoices',
    operation: 'RPC',
    rpcName: 'complete_sale',
    payload: rpcPayload,
    createdAt: Date.now(),
    attempts: 0,
    lastAttemptAt: null,
    nextRetryAt: Date.now() + 5000,
    error: null,
    idempotencyKey: clientTxId,
  }

  queue.push(item)
  await writeQueue(queue)
}

/**
 * Legacy compatibility shim — called by TCPClientService on Hub reconnect.
 * @deprecated Use drainQueue() directly.
 */
export function onHubReconnect(): void {
  drainQueue()
}
