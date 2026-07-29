import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { supabase } from '../lib/supabase'
import { useBridgeStatusStore } from '../stores/BridgeStatusStore'
import { tcpService } from './TCPClientService'

const KHATA_ENTRIES_KEY = 'noxis_khata_local_entries'
const KHATA_QUEUE_KEY = 'noxis_khata_pending_queue'

export interface KhataEntry {
  id: string
  businessId: string
  partyId: string
  entryType: 'debit' | 'credit' | 'adjustment'
  amount: number
  description: string
  reference: string
  entryDate: string
  createdBy: string
  createdByRole: string
  offlineAt: number
  synced: boolean
  idempotencyKey: string
}

class KhataLedgerEngineService {
  private isDraining = false
  private netInfoUnsubscribe: (() => void) | null = null

  constructor() {
    this.initAutoSyncListener()
  }

  /**
   * Initializes network listener to automatically trigger drainQueue when internet or socket comes back online.
   */
  private initAutoSyncListener() {
    if (this.netInfoUnsubscribe) return

    this.netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        console.log('[KhataLedgerEngine] Network connectivity detected. Initiating auto-sync drainQueue()...')
        this.drainQueue()
      }
    })

    // Listen to WebSocket connection changes
    tcpService.on('connectionChange', (isConnected: boolean) => {
      if (isConnected) {
        console.log('[KhataLedgerEngine] PC Hub WebSocket connected. Draining queue...')
        this.drainQueue()
      }
    })
  }

  /**
   * Reads all locally stored Khata entries.
   */
  public async getLocalEntries(): Promise<KhataEntry[]> {
    try {
      const raw = await AsyncStorage.getItem(KHATA_ENTRIES_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  /**
   * Returns entries for a specific partyId.
   */
  public async getEntriesForParty(partyId: string): Promise<KhataEntry[]> {
    const all = await this.getLocalEntries()
    return all.filter((e) => e.partyId === partyId)
  }

  /**
   * Reads pending queue items.
   */
  public async getPendingQueue(): Promise<KhataEntry[]> {
    try {
      const raw = await AsyncStorage.getItem(KHATA_QUEUE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  private async saveLocalEntries(entries: KhataEntry[]): Promise<void> {
    await AsyncStorage.setItem(KHATA_ENTRIES_KEY, JSON.stringify(entries))
  }

  private async savePendingQueue(queue: KhataEntry[]): Promise<void> {
    await AsyncStorage.setItem(KHATA_QUEUE_KEY, JSON.stringify(queue))
    // Update store pending count reactively to reflect in Sidebar Drawer Status Card
    useBridgeStatusStore.getState().setPendingCount(queue.length)
  }

  /**
   * OFFLINE DEDUCTION / TRANSACTION ENTRY FLOW (0ms Latency)
   * e.g., Supervisor deducting PKR 100,000 while Hub is offline.
   */
  public async addEntry(params: {
    partyId: string
    entryType: 'debit' | 'credit' | 'adjustment'
    amount: number
    description: string
    reference: string
    createdBy: string
    createdByRole: string
    businessId?: string
  }): Promise<KhataEntry> {
    const store = useBridgeStatusStore.getState()
    const timestamp = Date.now()
    const idempotencyKey = `khata_${params.partyId}_${timestamp}`

    const newEntry: KhataEntry = {
      id: `khata_entry_${timestamp}_${Math.random().toString(36).slice(2, 6)}`,
      businessId: params.businessId || store.businessId || 'biz_default',
      partyId: params.partyId,
      entryType: params.entryType,
      amount: params.amount,
      description: params.description,
      reference: params.reference,
      entryDate: new Date(timestamp).toISOString(),
      createdBy: params.createdBy,
      createdByRole: params.createdByRole,
      offlineAt: timestamp,
      synced: false,
      idempotencyKey,
    }

    // 1. Optimistic Local Save (0ms Latency)
    const localEntries = await this.getLocalEntries()
    localEntries.unshift(newEntry)
    await this.saveLocalEntries(localEntries)

    // 2. Enqueue in persistent KhataQueue with synced: false
    const queue = await this.getPendingQueue()
    queue.push(newEntry)
    await this.savePendingQueue(queue)

    console.log(`[KhataLedgerEngine] Enqueued entry: ${idempotencyKey} (Queue size: ${queue.length})`)

    // 3. Attempt background sync immediately if connection is alive
    this.drainQueue().catch((err) =>
      console.error('[KhataLedgerEngine] Background sync attempt deferred:', err)
    )

    return newEntry
  }

  /**
   * DRAIN QUEUE AUTO-SYNC PROCESS
   * Flushes enqueued items to PC Hub WebSocket or Supabase ledger_entries.
   */
  public async drainQueue(): Promise<{ syncedCount: number; remainingCount: number }> {
    if (this.isDraining) {
      const queue = await this.getPendingQueue()
      return { syncedCount: 0, remainingCount: queue.length }
    }

    this.isDraining = true
    let syncedCount = 0

    try {
      const queue = await this.getPendingQueue()
      if (queue.length === 0) {
        return { syncedCount: 0, remainingCount: 0 }
      }

      console.log(`[KhataLedgerEngine] Draining ${queue.length} enqueued items...`)
      const remainingQueue: KhataEntry[] = []
      const localEntries = await this.getLocalEntries()

      const isHubConnected = tcpService.getStatus()
      const netState = await NetInfo.fetch()
      const isInternetActive = netState.isConnected && netState.isInternetReachable

      for (const item of queue) {
        let success = false

        // Strategy A: If PC Hub is connected via WebSocket, send over WebSocket bridge
        if (isHubConnected) {
          try {
            await tcpService.sendEvent('KHATA_ENTRY', {
              idempotencyKey: item.idempotencyKey,
              payload: item,
            })
            success = true
            console.log(`[KhataLedgerEngine] Synced over WebSocket bridge: ${item.idempotencyKey}`)
          } catch (wsErr) {
            console.warn('[KhataLedgerEngine] WebSocket sync failed, checking internet fallback...', wsErr)
          }
        }

        // Strategy B: If PC Hub is offline but internet active, write directly to Supabase ledger_entries table
        // Realtime CDC will push changes to PC Hub when PC boots.
        if (!success && isInternetActive) {
          try {
            const { error } = await supabase.from('ledger_entries').upsert(
              {
                id: item.id,
                business_id: item.businessId,
                party_id: item.partyId,
                entry_type: item.entryType.toUpperCase(),
                amount: item.amount,
                description: item.description,
                reference: item.reference,
                entry_date: item.entryDate,
                created_by: item.createdBy,
                created_by_role: item.createdByRole,
                idempotency_key: item.idempotencyKey,
              },
              { onConflict: 'idempotency_key' }
            )

            if (!error) {
              success = true
              console.log(`[KhataLedgerEngine] Synced via Supabase CDC: ${item.idempotencyKey}`)
            } else {
              console.error('[KhataLedgerEngine] Supabase CDC sync error:', error.message)
            }
          } catch (spErr) {
            console.error('[KhataLedgerEngine] Supabase write failed:', spErr)
          }
        }

        if (success) {
          syncedCount++
          // Update local entry state to synced: true
          const idx = localEntries.findIndex((e) => e.idempotencyKey === item.idempotencyKey)
          if (idx !== -1) {
            localEntries[idx].synced = true
          }
        } else {
          // Retain in queue for next drain cycle
          remainingQueue.push(item)
        }
      }

      await this.saveLocalEntries(localEntries)
      await this.savePendingQueue(remainingQueue)

      console.log(`[KhataLedgerEngine] Drain complete: ${syncedCount} synced, ${remainingQueue.length} remaining in queue.`)
      return { syncedCount, remainingCount: remainingQueue.length }
    } finally {
      this.isDraining = false
    }
  }

  /**
   * Resets local entries & queue (for testing/debug).
   */
  public async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(KHATA_ENTRIES_KEY)
    await AsyncStorage.removeItem(KHATA_QUEUE_KEY)
    useBridgeStatusStore.getState().setPendingCount(0)
  }
}

export const KhataLedgerEngine = new KhataLedgerEngineService()
