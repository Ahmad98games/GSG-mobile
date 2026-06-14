import * as SecureStore from 'expo-secure-store';
import { openMeshDb } from '../lib/db/meshDb';
import { NspService } from './NspService';
import { omnora } from '../proto/messages';

export type StockLookupResponse = omnora.IStockLookupResponse;

/**
 * SCANNER SERVICE
 * Handles industrial barcode lookups and scan events over NSP.
 * Implements strict zero-data-loss SQLite-first logic.
 */
export class ScannerService {
  /**
   * Performs a barcode lookup, checking local cache first.
   */
  public static async lookupBarcode(barcode: string): Promise<any | null> {
    const db = await openMeshDb();
    
    // 1. Check local SKU cache (5 minute TTL)
    const cached = await db.getFirstAsync<any>(
      'SELECT * FROM sku_cache WHERE barcode = ? LIMIT 1',
      [barcode]
    );

    const now = Date.now();
    if (cached && (now - cached.last_synced_at) < 300000) {
      console.log('[Scanner] sku_cache_hit', { barcode });
      return {
        sku_id: cached.sku_id,
        sku_code: cached.sku_code,
        name: cached.name,
        qty_on_hand: cached.qty_on_hand,
        unit: cached.unit,
        cost_price: cached.cost_price,
        sale_price: cached.sale_price,
        location: cached.location
      };
    }

    // 2. Cache miss or stale: Send NSP request
    const nodeId = await SecureStore.getItemAsync('gs_node_id');
    const requestPayload = { barcode, node_id: nodeId };
    
    // Persistence Layer: Write to sync_queue before network attempt
    const res = await db.runAsync(
      "INSERT INTO sync_queue (table_name, operation, payload, status) VALUES ('stock_lookup', 'request', ?, 'pending')",
      [JSON.stringify(requestPayload)]
    );
    const queueId = res.lastInsertRowId;

    try {
      const response = await NspService.send({
        stock_lookup_req: {
          barcode,
          node_id: nodeId
        }
      }, 3000);

      const data = response?.nsp?.stock_lookup_res;
      if (data) {
        // 3. Update cache with fresh data
        await db.runAsync(
          `INSERT OR REPLACE INTO sku_cache 
          (sku_id, sku_code, name, qty_on_hand, unit, cost_price, sale_price, location, barcode, last_synced_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.sku_id, data.sku_code, data.name, data.qty_on_hand, data.unit,
            data.cost_price, data.sale_price, data.location, barcode, now
          ]
        );
        
        await db.runAsync("UPDATE sync_queue SET status = 'synced' WHERE id = ?", [queueId]);
        return data;
      }
    } catch (err) {
      console.warn('[Scanner] Network lookup failed, falling back to cache:', err);
    }

    if (cached) {
      console.log('[Scanner] Stale/Offline cache hit', { barcode });
      return {
        sku_id: cached.sku_id,
        sku_code: cached.sku_code,
        name: cached.name,
        qty_on_hand: cached.qty_on_hand,
        unit: cached.unit,
        cost_price: cached.cost_price,
        sale_price: cached.sale_price,
        location: cached.location,
        isOffline: true
      };
    }

    return null;
  }

  /**
   * Emits a scan event to the Hub for inventory tracking.
   */
  public static async emitScanEvent(params: {
    barcode: string;
    batchId: string;
    workerId?: string;
  }): Promise<void> {
    const nodeId = await SecureStore.getItemAsync('gs_node_id');
    const scanEvent: omnora.IScanEvent = {
      nodeId: nodeId,
      workerId: params.workerId ?? '',
      barcode: params.barcode,
      timestamp: Date.now(),
      batchId: params.batchId
    };

    const db = await openMeshDb();
    
    // SQLite-First: Zero data loss
    const res = await db.runAsync(
      "INSERT INTO sync_queue (table_name, operation, payload, status) VALUES ('scan_event', 'emit', ?, 'pending')",
      [JSON.stringify(scanEvent)]
    );
    const queueId = res.lastInsertRowId;

    try {
      // Send via NSP (Wait for HubAck via NspService.send's internal request/ACK mechanism)
      await NspService.send({ scan_event: scanEvent });
      
      // Update status on success
      await db.runAsync("UPDATE sync_queue SET status = 'synced' WHERE id = ?", [queueId]);
    } catch (err) {
      console.warn('[Scanner] Hub offline. Event remains in queue for later sync.', err);
      // Row stays 'pending', OfflineQueueManager will drain it.
    }
  }
}
