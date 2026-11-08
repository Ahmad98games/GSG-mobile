import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { supabase } from '../lib/supabase'
import { useBridgeStatusStore } from '../stores/BridgeStatusStore'
import { tcpService } from './TCPClientService'
import { writeWithSync } from './OfflineSyncService'

export const QUEUE_KEY = 'noxis_khata_queue'
export const KHATA_ENTRIES_KEY = 'noxis_khata_local_entries'

export interface KhataEntry {
  id: string
  businessId: string
  partyId: string
  entryType: 'debit' | 'credit' | 'adjustment'
  amount: number
  description: string
  reference: string
  attachmentUri?: string
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

  private initAutoSyncListener() {
    if (this.netInfoUnsubscribe) return

    this.netInfoUnsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected && state.isInternetReachable) {
        console.log('[KhataLedgerEngine] Network connected. Auto draining...')
        this.drain()
      }
    })

    tcpService.on('connectionChange', (isConnected: boolean) => {
      if (isConnected) {
        console.log('[KhataLedgerEngine] Hub connected. Auto draining...')
        this.drain()
      }
    })
  }

  public async getLocalEntries(): Promise<KhataEntry[]> {
    try {
      const raw = await AsyncStorage.getItem(KHATA_ENTRIES_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  public async getEntriesForParty(partyId: string): Promise<KhataEntry[]> {
    const all = await this.getLocalEntries()
    return all.filter((e) => e.partyId === partyId)
  }

  public async getQueue(): Promise<KhataEntry[]> {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  public async getPendingQueue(): Promise<KhataEntry[]> {
    return this.getQueue()
  }

  public async getPendingCount(): Promise<number> {
    const queue = await this.getQueue()
    return queue.filter((e) => !e.synced).length
  }

  private async saveLocalEntries(entries: KhataEntry[]): Promise<void> {
    await AsyncStorage.setItem(KHATA_ENTRIES_KEY, JSON.stringify(entries))
  }

  private async saveQueue(queue: KhataEntry[]): Promise<void> {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
    const pending = queue.filter((e) => !e.synced).length
    useBridgeStatusStore.getState().setPendingCount(pending)
  }

  public async addEntry(entryInput: {
    partyId: string
    entryType: 'debit' | 'credit' | 'adjustment'
    amount: number
    description: string
    reference?: string
    attachmentUri?: string
    createdBy?: string
    createdByRole?: string
    businessId?: string
  }): Promise<KhataEntry> {
    const store = useBridgeStatusStore.getState()
    const now = Date.now()
    const idempotencyKey = `khata_${entryInput.partyId}_${now}`

    const existingQueue = await this.getQueue()
    const duplicate = existingQueue.find((e) => e.idempotencyKey === idempotencyKey)
    if (duplicate) {
      return duplicate
    }

    // Generate valid UUID for PostgreSQL/SQLite ledger_entries compatibility
    const entryId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });

    const targetBizId = entryInput.businessId || store.businessId || 'ffa84a41-941e-4e4e-87c3-9580271db2bd';

    const newEntry: KhataEntry = {
      id: entryId,
      businessId: targetBizId,
      partyId: entryInput.partyId,
      entryType: entryInput.entryType,
      amount: entryInput.amount,
      description: entryInput.description || '',
      reference: entryInput.reference || '',
      attachmentUri: entryInput.attachmentUri,
      entryDate: new Date(now).toISOString(),
      createdBy: entryInput.createdBy || store.userName || 'Operator',
      createdByRole: entryInput.createdByRole || store.role || 'owner',
      offlineAt: now,
      synced: false,
      idempotencyKey,
    }

    const local = await this.getLocalEntries()
    local.unshift(newEntry)
    await this.saveLocalEntries(local)

    existingQueue.push(newEntry)
    await this.saveQueue(existingQueue)

    this.drain().catch((err) =>
      console.error('[KhataLedgerEngine] Immediate drain error:', err)
    )

    return newEntry
  }

  public async drainToHub(ws?: any): Promise<number> {
    const queue = await this.getQueue()
    const unsynced = queue.filter((e) => !e.synced)
    if (unsynced.length === 0) return 0

    let syncedCount = 0
    for (const item of unsynced) {
      let success = false
      if (tcpService.getStatus() || ws) {
        try {
          await tcpService.sendEvent('KHATA_ENTRY', {
            idempotencyKey: item.idempotencyKey,
            payload: item,
          })
          success = true
        } catch (err) {}
      }

      // HTTP REST fallback directly to PC Hub port 7447
      if (!success) {
        try {
          const { useBridgeStatusStore } = require('../stores/BridgeStatusStore')
          const hubIp = (useBridgeStatusStore.getState().hubIp || '192.168.0.102').replace(/^wss?:\/\//, '').split(/[:/]/)[0]
          const res = await fetch(`http://${hubIp}:7447/api/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              table: 'ledger_entries',
              operation: 'INSERT',
              payload: item,
              idempotencyKey: item.idempotencyKey,
            }),
          })
          if (res.ok) success = true
        } catch (httpErr) {}
      }

      if (success) {
        item.synced = true
        syncedCount++
      }
    }

    if (syncedCount > 0) {
      await this.saveQueue(queue)
    }
    return syncedCount
  }

  public async drainToSupabase(): Promise<number> {
    const queue = await this.getQueue()
    const unsynced = queue.filter((e) => !e.synced)
    if (unsynced.length === 0) return 0

    let syncedCount = 0
    for (const item of unsynced) {
      try {
        await writeWithSync('ledger_entries', {
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
        })
        item.synced = true
        syncedCount++
      } catch (err) {
        console.error(`[KhataLedgerEngine] drainToSupabase failed for ${item.idempotencyKey}:`, err)
      }
    }

    if (syncedCount > 0) {
      await this.saveQueue(queue)
    }
    return syncedCount
  }

  public async drain(): Promise<{ syncedCount: number; remainingCount: number }> {
    if (this.isDraining) {
      const remaining = await this.getPendingCount()
      return { syncedCount: 0, remainingCount: remaining }
    }

    this.isDraining = true
    try {
      let synced = await this.drainToHub()
      if (synced === 0) {
        synced = await this.drainToSupabase()
      }
      const remaining = await this.getPendingCount()
      return { syncedCount: synced, remainingCount: remaining }
    } finally {
      this.isDraining = false
    }
  }

  public async clearAll(): Promise<void> {
    await AsyncStorage.removeItem(KHATA_ENTRIES_KEY)
    await AsyncStorage.removeItem(QUEUE_KEY)
    useBridgeStatusStore.getState().setPendingCount(0)
  }
}

export const KhataLedgerEngine = new KhataLedgerEngineService()
