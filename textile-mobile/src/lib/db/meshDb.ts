import * as SQLite from 'expo-sqlite';

/**
 * OPEN MESH DB
 * Initializes the SQLite engine with industrial-grade performance tuning.
 */
export async function openMeshDb(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('omnora_mesh.db');
  
  // WAL mode: Allows concurrent reads and writes, critical for sync stability.
  await db.execAsync('PRAGMA journal_mode = WAL');
  
  // NORMAL sync: Significantly faster than FULL while remaining safe with WAL.
  await db.execAsync('PRAGMA synchronous = NORMAL');
  
  // 8MB cache for faster lookups on active conversations.
  await db.execAsync('PRAGMA cache_size = -8000');
  
  // Use memory for temporary sort operations.
  await db.execAsync('PRAGMA temp_store = MEMORY');
  
  await db.execAsync('PRAGMA foreign_keys = ON');

  // PERFORMANCE INDEXES
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, sent_at DESC);
    CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status) WHERE status='queued';
    CREATE INDEX IF NOT EXISTS idx_conv_last ON conversations(last_message_at DESC);
    
    CREATE TABLE IF NOT EXISTS notification_log (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL CHECK (event_type IN ('sentinel_breach','low_stock','payment_received','tactical_message','system_lock','heartbeat_alert')),
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      displayed_at TEXT NOT NULL DEFAULT (datetime('now')),
      suppressed INTEGER NOT NULL DEFAULT 0,
      acknowledged_at TEXT,
      notifee_id TEXT,
      payload TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_notifications_type ON notification_log(event_type, displayed_at DESC);
    CREATE INDEX IF NOT EXISTS idx_notifications_suppressed ON notification_log(suppressed, displayed_at DESC);

    -- M11: SKU Cache for sub-5ms lookup on every scan
    CREATE TABLE IF NOT EXISTS sku_cache (
      sku_id TEXT PRIMARY KEY,
      sku_code TEXT NOT NULL,
      name TEXT NOT NULL,
      qty_on_hand TEXT,
      unit TEXT,
      cost_price TEXT,
      sale_price TEXT,
      location TEXT,
      barcode TEXT UNIQUE NOT NULL,
      last_synced_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sku_barcode ON sku_cache(barcode);

    -- M12: POS Engine Tables
    CREATE TABLE IF NOT EXISTS pos_sessions (
      id TEXT PRIMARY KEY,
      hub_session_id TEXT,
      branch_id TEXT,
      opened_at TEXT NOT NULL DEFAULT (datetime('now')),
      closed_at TEXT,
      total_sales TEXT NOT NULL DEFAULT '0',
      total_items INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closing','closed','synced')),
      sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending','synced','failed'))
    );
    CREATE INDEX IF NOT EXISTS idx_pos_status ON pos_sessions(status, opened_at DESC);

    CREATE TABLE IF NOT EXISTS pos_sale_items (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES pos_sessions(id) ON DELETE CASCADE,
      sku_id TEXT NOT NULL,
      sku_code TEXT NOT NULL,
      name TEXT NOT NULL,
      qty TEXT NOT NULL,
      unit_price TEXT NOT NULL,
      line_total TEXT NOT NULL,
      scanned_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_pos_items_session ON pos_sale_items(session_id);

    -- M12: POS-specific Sync Queue (Zero Data Loss)
    CREATE TABLE IF NOT EXISTS sync_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_name TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','synced','failed')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_pos_sync_pending ON sync_queue(status, created_at ASC);

    -- M11: TCP Session tracking for heartbeat optimization
    CREATE TABLE IF NOT EXISTS tcp_sessions (
      node_id TEXT PRIMARY KEY,
      last_heartbeat_at INTEGER NOT NULL,
      session_token TEXT,
      latency_ms INTEGER
    );
    CREATE INDEX IF NOT EXISTS idx_tcp_node ON tcp_sessions(node_id);
  `);

  return db;
}
