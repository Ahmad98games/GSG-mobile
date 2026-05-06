import * as SQLite from 'expo-sqlite';
import { MobileCrypto } from '../lib/MobileCrypto';
import { tcpService } from './TCPClientService';
import { useBridgeStatus } from '../store/BridgeStatusStore';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { useMessageStore } from '../store/MessageStore';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';

const db = SQLite.openDatabaseSync('omnora_mesh.db');

export class MessageService {
  public static async init() {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        peer_node_id TEXT NOT NULL,
        peer_display_name TEXT,
        last_message_preview TEXT,
        last_message_at INTEGER,
        unread_count INTEGER DEFAULT 0,
        is_muted BOOLEAN DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        from_node_id TEXT NOT NULL,
        to_node_id TEXT NOT NULL,
        message_type TEXT NOT NULL CHECK (message_type IN ('text','voice','image','system')),
        encrypted_payload BLOB NOT NULL,
        local_path TEXT,
        status TEXT DEFAULT 'queued',
        sent_at INTEGER NOT NULL,
        delivered_at INTEGER,
        read_at INTEGER,
        char_count INTEGER,
        duration_ms INTEGER,
        is_deleted BOOLEAN DEFAULT 0
      );

      CREATE INDEX IF NOT EXISTS idx_messages_to_status ON messages(to_node_id, status);
      CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, sent_at DESC);
    `);
    
    // Auto-cleanup on startup
    await this.cleanupVoiceFiles();
  }

  public static async sendTextMessage(toNodeId: string, content: string) {
    const { tierFeatures } = useBridgeStatus.getState();
    const charCount = content.length;

    if (tierFeatures && charCount > tierFeatures.msgMaxChars) {
      throw new Error('MESSAGE_TOO_LONG');
    }

    const meshKey = await SecureStore.getItemAsync('gs_mesh_key');
    if (!meshKey) throw new Error('NO_MESH_KEY');

    const nodeId = await SecureStore.getItemAsync('gs_node_id') || 'unknown';
    const encrypted = await MobileCrypto.encrypt(Buffer.from(content, 'utf8'), meshKey);
    const messageId = Math.random().toString(36).substring(7); // Simple UUID fallback
    const conversationId = [nodeId, toNodeId].sort().join('_');

    // 1. Save to SQLite
    await db.runAsync(
      `INSERT INTO messages (id, conversation_id, from_node_id, to_node_id, message_type, encrypted_payload, status, sent_at, char_count) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [messageId, conversationId, nodeId, toNodeId, 'text', encrypted, 'queued', Date.now(), charCount]
    );

    await this.updateConversation(conversationId, toNodeId, content.substring(0, 50));

    // 2. Transmit if connected
    if (tcpService.getStatus()) {
      this.transmitMessage(messageId, toNodeId, encrypted, 'text');
    }
  }

  public static async sendVoiceMessage(toNodeId: string, audioFilePath: string, durationMs: number) {
    const meshKey = await SecureStore.getItemAsync('gs_mesh_key');
    if (!meshKey) throw new Error('NO_MESH_KEY');

    const nodeId = await SecureStore.getItemAsync('gs_node_id') || 'unknown';
    const conversationId = [nodeId, toNodeId].sort().join('_');
    const messageId = Math.random().toString(36).substring(7);

    const audioBase64 = await FileSystem.readAsStringAsync(audioFilePath, { encoding: FileSystem.EncodingType.Base64 });
    const encrypted = await MobileCrypto.encrypt(Buffer.from(audioBase64, 'base64'), meshKey);

    await db.runAsync(
      `INSERT INTO messages (id, conversation_id, from_node_id, to_node_id, message_type, encrypted_payload, local_path, status, sent_at, duration_ms) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [messageId, conversationId, nodeId, toNodeId, 'voice', encrypted, audioFilePath, 'queued', Date.now(), durationMs]
    );

    await this.updateConversation(conversationId, toNodeId, '[Voice Message]');

    if (tcpService.getStatus()) {
      this.transmitMessage(messageId, toNodeId, encrypted, 'voice');
    }
  }

  private static async transmitMessage(messageId: string, toNodeId: string, encryptedPayload: Uint8Array, type: string) {
    try {
      await tcpService.sendEvent('TacticalMessage', {
        messageId,
        toNodeId,
        encryptedPayload,
        mediaType: type,
        timestamp: Date.now(),
        isEncrypted: true
      });
      
      await db.runAsync('UPDATE messages SET status = "sent" WHERE id = ?', [messageId]);
      useMessageStore.getState().updateMessageStatus(messageId, 'sent');
    } catch (e) {
      console.error('[MessageService] Transmit failed:', e);
    }
  }

  public static async receiveMessage(payload: any) {
    const meshKey = await SecureStore.getItemAsync('gs_mesh_key');
    if (!meshKey) return;

    try {
      const decryptedBytes = await MobileCrypto.decrypt(payload.encryptedPayload, meshKey);
      const decrypted = payload.mediaType === 'text' 
        ? Buffer.from(decryptedBytes).toString('utf8')
        : '[Media]';

      const nodeId = await SecureStore.getItemAsync('gs_node_id') || 'unknown';
      const conversationId = [nodeId, payload.fromNodeId].sort().join('_');

      await db.runAsync(
        `INSERT OR IGNORE INTO messages (id, conversation_id, from_node_id, to_node_id, message_type, encrypted_payload, status, sent_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [payload.messageId, conversationId, payload.fromNodeId, nodeId, payload.mediaType, payload.encryptedPayload, 'delivered', payload.timestamp]
      );

      await this.updateConversation(conversationId, payload.fromNodeId, decrypted, true);

      // UI Update
      useMessageStore.getState().addMessage({
        id: payload.messageId,
        conversation_id: conversationId,
        from_node_id: payload.fromNodeId,
        to_node_id: nodeId,
        message_type: payload.mediaType,
        content: decrypted,
        status: 'delivered',
        sent_at: payload.timestamp
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      if (payload.mediaType === 'voice') {
        // Handle voice file download/save logic if needed
      }
    } catch (e) {
      console.error('[MessageService] Receive failed:', e);
    }
  }

  private static async updateConversation(id: string, peerId: string, preview: string, isIncoming: boolean = false) {
    const unreadInc = isIncoming ? 1 : 0;
    await db.runAsync(
      `INSERT INTO conversations (id, peer_node_id, last_message_preview, last_message_at, unread_count)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET 
         last_message_preview = excluded.last_message_preview,
         last_message_at = excluded.last_message_at,
         unread_count = unread_count + ${unreadInc}`,
      [id, peerId, preview, Date.now(), unreadInc]
    );
  }

  public static async drainOutboundMessages() {
    const pending = await db.getAllAsync<any>('SELECT * FROM messages WHERE status = "queued" ORDER BY sent_at ASC');
    for (const msg of pending) {
      await this.transmitMessage(msg.id, msg.to_node_id, msg.encrypted_payload, msg.message_type);
    }
  }

  public static async sendHeartbeat() {
    const nodeId = await SecureStore.getItemAsync('gs_node_id');
    if (!nodeId) return;

    tcpService.sendEvent('HeartbeatEvent', {
      nodeId,
      timestamp: Date.now(),
      batteryPercent: 85, // Placeholder
      signalStrength: 4,  // Placeholder
      queueDepth: 0
    });
  }



  public static async sendTypingIndicator(toNodeId: string) {
    const nodeId = await SecureStore.getItemAsync('gs_node_id') || 'unknown';
    tcpService.sendEvent('TypingIndicator', {
      fromNodeId: nodeId,
      toNodeId,
      timestamp: Date.now()
    });
  }

  public static async cleanupVoiceFiles() {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const oldMessages = await db.getAllAsync<{ id: string; local_path: string }>(
      'SELECT id, local_path FROM messages WHERE message_type = "voice" AND status = "read" AND read_at < ? AND local_path IS NOT NULL',
      [thirtyDaysAgo]
    );

    for (const msg of oldMessages) {
      try {
        const fileInfo = await FileSystem.getInfoAsync(msg.local_path);
        if (fileInfo.exists) {
          await FileSystem.deleteAsync(msg.local_path);
        }
        await db.runAsync('UPDATE messages SET local_path = NULL WHERE id = ?', [msg.id]);
        console.log(`[MessageService] Cleaned up voice file for message: ${msg.id}`);
      } catch (e) {
        console.error(`[MessageService] Failed to cleanup voice file ${msg.id}:`, e);
      }
    }
  }
}
