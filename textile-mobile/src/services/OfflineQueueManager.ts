import * as SQLite from 'expo-sqlite';
import EventEmitter from 'eventemitter3';
import { tcpService } from './TCPClientService';
import { useBridgeStatus } from '../store/BridgeStatusStore';

const MAX_QUEUE_DEPTH = 10000; // Increased for FIFO limit
const T3_PAUSE_THRESHOLD = 500;
const WARNING_THRESHOLD = 800;
const T2_BATCH_SIZE = 10;
const T2_MAX_AGE = 5000;
const T3_IDLE_DELAY = 10000;

export interface QueueItem {
  uuid: string;
  type: string;
  payload: any;
  ts: number;
  tier: number;
  status: 'queued' | 'delivered' | 'failed' | 'DONE';
}

/**
 * NOXIS OFFLINE QUEUE MANAGER
 * Atomic SQLite-First lifecycle for mission-critical industrial data.
 */
class OfflineQueueManager extends EventEmitter {
  private db: any = null;
  private memoryQueue: any[] = [];
  private lastActivityAt: number = Date.now();
  
  private tier2Batch: any[] = [];
  private tier2Timer: NodeJS.Timeout | null = null;
  private tier3Timer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.init();
    this.startTierTimers();
  }

  private async init() {
    try {
      this.db = await SQLite.openDatabaseAsync('omnora_sync.db');
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS sync_queue (
          uuid TEXT PRIMARY KEY,
          type INTEGER NOT NULL,
          payload BLOB NOT NULL,
          ts INTEGER NOT NULL,
          tier INTEGER NOT NULL,
          sync_status TEXT DEFAULT 'queued'
        );
        CREATE INDEX IF NOT EXISTS idx_sync_queue ON sync_queue(sync_status, ts ASC) WHERE sync_status='queued';
      `);
      
      // 1. Queue Integrity Check
      const stats = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM sync_queue WHERE sync_status = ?', ['queued']);
      if (stats.count > 500) {
        console.warn(`[Queue] INTEGRITY_WARNING: ${stats.count} pending items. Device offline for extended period.`);
      }

      // 2. Cold Boot Drain: Sync status 'queued' restoration
      await this.drainPersistedQueue();
    } catch (e) {
      console.error('[Queue] Init Error:', e);
    }
  }

  private startTierTimers() {
    this.tier3Timer = setInterval(() => this.processTier3(), 5000);
  }

  /**
   * ATOMIC ENQUEUE
   * Ensures data is persistent in SQLite BEFORE hitting memory.
   */
  private async atomicSave(item: any) {
    // 3. FIFO FIFO Limit: 10,000 rows
    const stats = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM sync_queue');
    if (stats.count >= MAX_QUEUE_DEPTH) {
       console.log('[Queue] FIFO_LIMIT: Removing oldest 1,000 rows');
       await this.db.runAsync('DELETE FROM sync_queue WHERE uuid IN (SELECT uuid FROM sync_queue ORDER BY ts ASC LIMIT 1000)');
    }

    await this.db.runAsync(
      'INSERT OR REPLACE INTO sync_queue (uuid, type, payload, ts, tier, sync_status) VALUES (?, ?, ?, ?, ?, ?)',
      [item.uuid, item.type, JSON.stringify(item.payload), item.ts, item.tier, 'queued']
    );

    this.memoryQueue.push(item);
    this.updateBridgeMetrics();
  }

  public async enqueueTier1(type: number, payload: any) {
    const item = this.createItem(type, payload, 1);
    await this.atomicSave(item);
    this.transmit(item);
  }

  /**
   * NSP Outbound Events: Tier 1 Priority
   */
  public async enqueueNspEvent(payload: any) {
    const item = this.createItem(16, payload, 1); // Type 16 = NSP
    await this.atomicSave(item);
    this.transmit(item);
  }

  public async enqueueTier2(type: number, payload: any) {
    const item = this.createItem(type, payload, 2);
    await this.atomicSave(item);
    this.tier2Batch.push(item);

    if (this.tier2Batch.length >= T2_BATCH_SIZE) {
      this.processTier2Batch();
    } else if (!this.tier2Timer) {
      this.tier2Timer = setTimeout(() => this.processTier2Batch(), T2_MAX_AGE);
    }
  }

  public async enqueueTier3(type: number, payload: any) {
    if (this.memoryQueue.length >= T3_PAUSE_THRESHOLD) return; 
    
    const item = this.createItem(type, payload, 3);
    await this.atomicSave(item);
  }

  private createItem(type: number, payload: any, tier: number) {
    return {
      uuid: `ev_${Math.random().toString(36).substring(7)}_${Date.now()}`,
      type,
      payload,
      ts: Date.now(),
      tier
    };
  }

  private async processTier2Batch() {
    if (this.tier2Timer) { clearTimeout(this.tier2Timer); this.tier2Timer = null; }
    const batch = [...this.tier2Batch];
    this.tier2Batch = [];
    this.transmitBatch(batch);
  }

  private async processTier3() {
    if (Date.now() - this.lastActivityAt < T3_IDLE_DELAY) return;
    const items = this.memoryQueue.filter(i => i.tier === 3);
    if (items.length === 0) return;
    this.transmitBatch(items);
  }

  private async transmit(item: any) {
    if (!tcpService.getStatus()) return;

    this.lastActivityAt = Date.now();
    try {
      if (item.type === 16) {
        // Special Handling for NSP
        const { NspService } = require('./NspService');
        await NspService.sendResponse(item.payload);
      } else {
        const typeMap: Record<number, string> = { 0: 'heartbeat', 1: 'scan', 2: 'sos', 4: 'error', 5: 'StockDelta', 8: 'telemetry', 11: 'message' };
        await tcpService.sendEvent(typeMap[item.type] || 'scan', {
          ...item.payload,
          idempotency_key: item.uuid
        });
      }
      
      await this.markDelivered(item.uuid);
    } catch (e) {
      console.error('[Queue] Transmission Failure:', e);
    }
  }

  private async transmitBatch(items: any[]) {
    for (const item of items) {
      await this.transmit(item);
    }
  }

  public async addToQueue(type: any, payload: any) {
    // Legacy support for Generic Type names
    const typeIdMap: Record<string, number> = { 'LOG_KHATA_TRANSACTION': 11, 'PICK_BATCH': 1 };
    const typeId = typeof type === 'string' ? (typeIdMap[type] || 1) : type;
    return await this.enqueueTier1(typeId, payload);
  }

  private async markDelivered(uuid: string) {
    await this.db.runAsync('UPDATE sync_queue SET sync_status = ? WHERE uuid = ?', ['delivered', uuid]);
    this.memoryQueue = this.memoryQueue.filter(i => i.uuid !== uuid);
    this.updateBridgeMetrics();
  }

  public async drainPersistedQueue(): Promise<void> {
    if (!this.db) return;
    const pending = await this.db.getAllAsync('SELECT * FROM sync_queue WHERE sync_status = ? ORDER BY ts ASC', ['queued']);
    
    this.memoryQueue = [];
    for (const row of pending) {
      const item = {
        uuid: row.uuid,
        type: row.type,
        payload: JSON.parse(row.payload),
        ts: row.ts,
        tier: row.tier
      };
      this.memoryQueue.push(item);
      
      // Tier 1 and NSP packets get immediate retry on cold boot if connected
      if (item.tier === 1) this.transmit(item);
    }
    this.updateBridgeMetrics();
  }

  public getQueueCount(): number {
    return this.memoryQueue.length;
  }

  private updateBridgeMetrics() {
    const depth = this.memoryQueue.length;
    if (depth >= WARNING_THRESHOLD) {
      console.warn(`[Queue] CRITICAL_DEPTH: ${depth} items queued.`);
    }
    this.emit('countChange', depth);
  }

  public getHistory() {
    return this.memoryQueue;
  }
}

export const queueManager = new OfflineQueueManager();

export async function getPendingCount(): Promise<number> {
  return queueManager.getQueueCount();
}
