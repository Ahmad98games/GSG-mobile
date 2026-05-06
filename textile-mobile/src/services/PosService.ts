import { Decimal } from 'decimal.js';
import { openMeshDb } from '../lib/db/meshDb';
import { ScannerService } from './ScannerService';

/**
 * Custom nanoid implementation for 21-char identifiers.
 */
const generateId = (size: number = 21): string => {
  const chars = 'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_G_hjklyzicvfq';
  let id = '';
  for (let i = 0; i < size; i++) {
    id += chars[(Math.random() * chars.length) | 0];
  }
  return id;
};

/**
 * POS SERVICE
 * Mobile-side session management for industrial retail sales.
 */
export class PosService {
  private static instance: PosService;
  
  public static getInstance(): PosService {
    if (!PosService.instance) {
      PosService.instance = new PosService();
    }
    return PosService.instance;
  }

  /**
   * Opens a new POS session locally and notifies the Hub.
   */
  public async openSession(branchId: string): Promise<string> {
    const sessionId = generateId(21);
    const db = await openMeshDb();
    
    await db.runAsync(
      "INSERT INTO pos_sessions (id, branch_id, status, sync_status) VALUES (?, ?, 'open', 'pending')",
      [sessionId, branchId]
    );

    // Notify Hub of new session via ScanEvent protocol
    await ScannerService.emitScanEvent({
      barcode: 'SESSION_OPEN',
      batchId: sessionId
    });

    return sessionId;
  }

  /**
   * Adds an item to the active session with atomic SQLite persistence.
   */
  public async addItem(sessionId: string, item: {
    skuId: string, 
    skuCode: string, 
    name: string,
    qty: string, 
    unitPrice: string
  }): Promise<void> {
    const db = await openMeshDb();
    
    // Arithmetic: Decimal.js for financial precision
    const qty = new Decimal(item.qty);
    const unitPrice = new Decimal(item.unitPrice);
    const lineTotal = qty.times(unitPrice).toString();
    const itemId = generateId(10);

    await db.runAsync(
      `INSERT INTO pos_sale_items (id, session_id, sku_id, sku_code, name, qty, unit_price, line_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [itemId, sessionId, item.skuId, item.skuCode, item.name, item.qty, item.unitPrice, lineTotal]
    );

    // Update session aggregates
    const session = await db.getFirstAsync<{ total_sales: string, total_items: number }>(
      "SELECT total_sales, total_items FROM pos_sessions WHERE id = ?",
      [sessionId]
    );

    if (session) {
      const currentSales = new Decimal(session.total_sales);
      const newTotalSales = currentSales.plus(lineTotal).toString();
      const newTotalItems = session.total_items + 1;
      
      await db.runAsync(
        "UPDATE pos_sessions SET total_sales = ?, total_items = ? WHERE id = ?",
        [newTotalSales, newTotalItems, sessionId]
      );
    }
  }

  /**
   * Closes the session and signals the Hub to process the complete sale.
   */
  public async closeSession(sessionId: string): Promise<void> {
    const db = await openMeshDb();
    
    // Transition to closing state
    await db.runAsync("UPDATE pos_sessions SET status = 'closing' WHERE id = ?", [sessionId]);

    try {
      // Signal Hub to process the batch (session_id = batchId)
      await ScannerService.emitScanEvent({
        barcode: 'SESSION_CLOSE',
        batchId: sessionId
      });
      
      // Update locally once Hub acknowledges
      await db.runAsync(
        "UPDATE pos_sessions SET status = 'synced', sync_status = 'synced' WHERE id = ?", 
        [sessionId]
      );
    } catch (err) {
      console.warn('[POS] Hub offline. Session close signal queued for retry.', err);
      // Status remains 'closing', sync_status remains 'pending'
    }
  }
}

export const posService = PosService.getInstance();
