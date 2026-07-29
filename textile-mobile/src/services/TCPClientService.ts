import TcpSocket from 'react-native-tcp-socket';
import EventEmitter from 'eventemitter3';
import { AppState, Platform, Alert, type AppStateStatus } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MobileCrypto } from '../lib/MobileCrypto';
import { ProtobufService } from './ProtobufService';
import { useBridgeStatus } from '../store/BridgeStatusStore';
import { queueManager } from './OfflineQueueManager';

import { useBridgeStatusStore } from '@/src/stores/BridgeStatusStore';
import { getOrCreateDeviceId, getDeviceLabel } from '@/src/utils/deviceId';
import { getSafeStorage } from '@/src/utils/storage';
import {
  notifyLowStock,
  notifyPaymentOverdue,
  notifyForesight,
} from '@/services/NotificationService';

const HUB_PORT = 7447;
const BACKOFF_SEQUENCE = [1000, 2000, 4000, 8000, 15000, 30000];
const HEARTBEAT_INTERVAL = 15000;
const ACK_TIMEOUT = 5000;

// ── WebSocket Bridge Module-Level Variables ─────────────────────────────────
let wsSocket: WebSocket | null = null;
let reconnectTimer: any = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_BASE_DELAY = 2000;

// ── TCP Client Service Class (Integrated) ────────────────────────────────────
class TCPClientService extends EventEmitter {
  private socket: any = null;
  private dataBuffer: Buffer = Buffer.alloc(0);
  private backoffIndex: number = 0;
  private isConnected: boolean = false;
  private appStateSubscription: { remove: () => void } | null = null;
  private nodeId: string | null = null;
  private meshKey: string | null = null;
  private host: string | null = null;
  
  // Watchdog
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private missedHeartbeats: number = 0;
  private pendingRequests: Map<string, { resolve: (val: any) => void, reject: (err: any) => void, timeout: NodeJS.Timeout }> = new Map();

  constructor() {
    super();
    this.setupAppStateListener();
  }

  private setupAppStateListener() {
    this.appStateSubscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && !this.isConnected && this.host) {
        this.connect(this.host);
      }
    });
  }

  public async connect(host: string, port: number = HUB_PORT) {
    this.host = host;
    this.nodeId = await SecureStore.getItemAsync('gs_node_id');
    this.meshKey = await SecureStore.getItemAsync('gs_mesh_key');

    const bridgeStore = useBridgeStatus.getState();
    bridgeStore.setConnectionState('reconnecting');

    // ── WEB/BRIDGE PATH: Use WebSocket bridge if Web or URL matches ws:// ────
    if (Platform.OS === 'web' || host.startsWith('ws://') || host.startsWith('wss://')) {
      connectViaWebSocket(host);
      return;
    }
    // ── NATIVE PATH: Raw TCP ──────────────────────────────────────────────

    if (this.socket) {
      try { this.socket.destroy(); } catch (e) {}
    }

    console.log(`[TCP] Connecting to ${host}:${port} (Attempt ${this.backoffIndex + 1})`);

    this.socket = TcpSocket.createConnection({ port, host }, async () => {
      this.isConnected = true;
      this.backoffIndex = 0;
      this.missedHeartbeats = 0;
      
      bridgeStore.setConnectionState('connected');
      bridgeStore.resetReconnectAttempts();
      this.emit('connectionChange', true);
      
      await this.handleHandshake();
      this.startHeartbeatWatchdog();
      
      const { NoxisSynapseService } = require('./NoxisSynapseService');
      await NoxisSynapseService.reconcileState();
    });

    this.socket.on('data', (data: Uint8Array) => this.handleData(data));
    
    this.socket.on('error', (err: any) => {
      console.error('[TCP] Socket Error:', err);
    });

    this.socket.on('close', () => {
      this.handleDisconnect();
    });
  }

  private async handleHandshake() {
    const sessionToken = await SecureStore.getItemAsync('omnora_session_token');
    
    this.sendMessage({
      t: 'HI',
      id: this.nodeId,
      token: sessionToken,
      ts: Date.now()
    });
  }

  private startHeartbeatWatchdog() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    
    this.heartbeatTimer = setInterval(() => {
      if (!this.isConnected) return;

      this.missedHeartbeats++;
      if (this.missedHeartbeats >= 3) {
        console.warn('[TCP] Watchdog: 3 heartbeats missed. Forcing disconnect.');
        this.handleDisconnect();
        return;
      }

      const { MessageService } = require('./MessageService');
      MessageService.sendHeartbeat();
    }, HEARTBEAT_INTERVAL);
  }

  private handleDisconnect() {
    if (!this.isConnected) return;
    
    this.isConnected = false;
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.socket) {
      try { this.socket.destroy(); } catch (e) {}
      this.socket = null;
    }

    const bridgeStore = useBridgeStatus.getState();
    bridgeStore.setConnectionState('offline');
    this.emit('connectionChange', false);

    // Reconnection Loop
    const delay = BACKOFF_SEQUENCE[this.backoffIndex] || 30000;
    this.backoffIndex = Math.min(this.backoffIndex + 1, BACKOFF_SEQUENCE.length - 1);
    
    console.log(`[TCP] Reconnecting in ${delay}ms`);
    setTimeout(() => {
      if (this.host && !this.isConnected) {
        this.connect(this.host);
      }
    }, delay);
  }

  private handleData(data: Uint8Array) {
    this.dataBuffer = Buffer.concat([this.dataBuffer, Buffer.from(data)]);
    
    while (this.dataBuffer.length >= 4) {
      const length = this.dataBuffer.readUInt32LE(0);
      if (this.dataBuffer.length < length + 4) break; // Frame incomplete
      
      const payload = this.dataBuffer.subarray(4, length + 4);
      this.dataBuffer = this.dataBuffer.subarray(length + 4);
      
      this.decryptAndProcess(payload);
    }
  }

  private async decryptAndProcess(payload: Buffer) {
    try {
      let raw: string;
      if (this.meshKey) {
        const decrypted = await MobileCrypto.decrypt(payload, this.meshKey);
        const decoded = ProtobufService.decode(decrypted);
        raw = decoded.content || JSON.stringify(decoded);
      } else {
        const decoded = ProtobufService.decode(payload);
        raw = decoded.content || JSON.stringify(decoded);
      }

      let decrypted: any;
      try {
        decrypted = JSON.parse(raw);
      } catch {
        // Fallback if content was encrypted/decrypted but is already JSON or raw string
        const decryptedStr = raw.startsWith('{') || raw.startsWith('[') ? raw : raw;
        decrypted = JSON.parse(decryptedStr);
      }
      this.processMessage(decrypted);
    } catch (e) {
      console.error('[TCP] Message Parse Error:', e);
    }
  }

  private async processMessage(msg: any) {
    const bridgeStore = useBridgeStatus.getState();

    switch (msg.t) {
      case 'REQUEST_AUTH':
        const { NoxisGuardianService } = require('./NoxisGuardianService');
        NoxisGuardianService.handleRemoteAuth(msg.id);
        break;

      case 'HI_ACK':
        this.missedHeartbeats = 0;
        if (msg.offset !== undefined) {
          bridgeStore.setSyncOffset(msg.offset);
          await queueManager.drainPersistedQueue();
        }
        if (msg.token) {
          await SecureStore.setItemAsync('omnora_session_token', msg.token);
        }
        
        const { NspService: HiNsp } = require('./NspService');
        HiNsp.onHubAck(msg);
        break;

      case 'ACK':
        this.missedHeartbeats = 0;
        const now = Date.now();
        if (msg.ts) {
          bridgeStore.recordRtt(now - msg.ts);
        }
        bridgeStore.setLastAckAt(now);
        
        if (msg.packetId && this.pendingRequests.has(msg.packetId)) {
          const req = this.pendingRequests.get(msg.packetId)!;
          clearTimeout(req.timeout);
          this.pendingRequests.delete(msg.packetId);
          req.resolve(msg);
        }
        break;

      case 'NSP_PACKET':
        if (msg.nsp) {
          if (msg.nsp.requestId && this.pendingRequests.has(msg.nsp.requestId)) {
            const req = this.pendingRequests.get(msg.nsp.requestId)!;
            clearTimeout(req.timeout);
            this.pendingRequests.delete(msg.nsp.requestId);
            req.resolve(msg);
          } else {
            const { NspService } = require('./NspService');
            NspService.handleEnvelope(msg.nsp);
          }
        }
        break;
        
      case 'SYNC_ACK':
        if (msg.missedEvents) {
          const { meshBus } = require('./MeshEventBus');
          msg.missedEvents.forEach((event: any) => {
             meshBus.broadcast(event.type, event.payload);
          });
        }
        break;
    }
  }

  public async sendEvent(eventType: string, eventData: any) {
    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
      try {
        wsSocket.send(JSON.stringify({
          type: eventType,
          ...eventData,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error('[WS] Event Send Failure:', e);
      }
      return;
    }

    if (!this.socket || !this.isConnected || !this.nodeId || !this.meshKey) return;

    try {
      const proto = ProtobufService.encode(this.nodeId, eventType, eventData);
      const encrypted = await MobileCrypto.encrypt(proto, this.meshKey);
      
      const header = Buffer.alloc(4);
      header.writeUInt32LE(encrypted.length, 0);
      this.socket.write(Buffer.concat([header, Buffer.from(encrypted)]));
    } catch (e) {
      console.error('[TCP] Event Send Failure:', e);
    }
  }

  public async request(payload: any, timeout: number = 10000): Promise<any> {
    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
      return requestHubData(payload.resource || 'data', payload.params || {});
    }

    if (!this.isConnected) throw new Error('OFFLINE');
    
    const requestId = Math.random().toString(36).substring(2, 10);
    
    if (payload.nsp) {
      payload.nsp.requestId = requestId;
    } else {
      payload.requestId = requestId;
    }
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          this.pendingRequests.delete(requestId);
          reject(new Error('NSP_REQUEST_TIMEOUT'));
        }
      }, timeout);

      this.pendingRequests.set(requestId, { resolve, reject, timeout: timer });
      
      const packet = payload.t ? payload : {
        t: 'NSP_PACKET',
        nsp: payload.nsp || payload,
        ts: Date.now()
      };

      this.sendMessage(packet);
    });
  }

  public async sendMessage(payload: any) {
    if (wsSocket && wsSocket.readyState === WebSocket.OPEN) {
      try {
        const nodeId = this.nodeId || await AsyncStorage.getItem('gs_node_id') || 'unknown_node';
        wsSocket.send(JSON.stringify({ ...payload, fromNodeId: nodeId, ts: payload.ts || Date.now() }));
      } catch (e) {
        console.error('[WS] Send Message Error:', e);
      }
      return;
    }

    if (!this.socket || !this.isConnected || !this.nodeId) return;
    try {
      let proto: Uint8Array;
      
      if (payload.t === 'HI') {
        proto = ProtobufService.encode(this.nodeId, 'handshake', {
          nodeId: payload.id,
          token: payload.token,
          timestamp: payload.ts,
          type: 'HI'
        });
      } else if (payload.t === 'NSP_PACKET') {
        proto = ProtobufService.encode(this.nodeId, 'message', {
          messageId: payload.nsp?.requestId || 'gen_' + Date.now(),
          fromNodeId: this.nodeId,
          content: JSON.stringify(payload.nsp || payload),
          timestamp: payload.ts || Date.now()
        });
      } else {
        proto = ProtobufService.encode(this.nodeId, 'message', {
          messageId: 'gen_' + Date.now(),
          fromNodeId: this.nodeId,
          content: JSON.stringify(payload),
          timestamp: Date.now()
        });
      }

      let finalBuffer: Buffer;
      if (this.meshKey) {
        const encrypted = await MobileCrypto.encrypt(proto, this.meshKey);
        finalBuffer = Buffer.from(encrypted);
      } else {
        finalBuffer = Buffer.from(proto);
      }

      const header = Buffer.alloc(4);
      header.writeUInt32LE(finalBuffer.length, 0);
      this.socket.write(Buffer.concat([header, finalBuffer]));
    } catch (e) {
      console.error('[TCP] Send Message Error:', e);
    }
  }

  public getStatus() { 
    return this.isConnected || (wsSocket !== null && wsSocket.readyState === WebSocket.OPEN); 
  }
  
  public async drainQueue() {
    const { queueManager } = require('./OfflineQueueManager');
    await queueManager.drainPersistedQueue();
  }

  public destroy() {
    disconnect();
    if (this.socket) {
      try { this.socket.destroy(); } catch (e) {}
      this.socket = null;
    }
    this.isConnected = false;
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }
}

export const tcpService = new TCPClientService();

// ── WebSocket Bridge Implementation (Hardened) ──────────────────────────────
export async function connectViaWebSocket(
  bridgeUrl: string
): Promise<void> {
  // Clear any existing connection
  if (wsSocket) {
    try { wsSocket.close(); } catch (e) {}
    wsSocket = null;
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  const deviceId = await getOrCreateDeviceId();
  const deviceLabel = await getDeviceLabel();

  // Store the bridge URL so we can reconnect
  await AsyncStorage.setItem('noxis_bridge_url', bridgeUrl);

  useBridgeStatusStore.getState().setStatus({
    syncStatus: 'syncing',
    hubOnline: false,
  });

  try {
    wsSocket = new WebSocket(bridgeUrl);
  } catch (err: any) {
    console.error('[WS] Failed to create socket:', err);
    scheduleReconnect(bridgeUrl);
    return;
  }

  wsSocket.onopen = async () => {
    console.log('[WS] Connected to Hub bridge');
    reconnectAttempts = 0;
    tcpService.emit('connectionChange', true);

    // Send pairing request immediately
    wsSocket?.send(JSON.stringify({
      type: 'PAIR_REQUEST',
      deviceId,
      deviceLabel,
      appVersion: '13.0.0',
      platform: Platform.OS,
    }));
  };

  wsSocket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      handleBridgeMessage(msg);
    } catch (err) {
      console.error('[WS] Parse error:', err);
    }
  };

  wsSocket.onclose = (event) => {
    console.log(`[WS] Disconnected: ${event.code} ${event.reason}`);
    wsSocket = null;
    tcpService.emit('connectionChange', false);
    
    useBridgeStatusStore.getState().setStatus({
      hubOnline: false,
      syncStatus: 'offline',
    });

    // Don't reconnect if deliberately closed
    if (event.code === 1000) return;

    scheduleReconnect(bridgeUrl);
  };

  wsSocket.onerror = (err) => {
    console.error('[WS] Socket error:', err);
    useBridgeStatusStore.getState().setStatus({
      hubOnline: false,
      syncStatus: 'offline',
    });
  };
}

function scheduleReconnect(
  bridgeUrl: string
): void {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.log('[WS] Max reconnect attempts reached');
    return;
  }

  // Exponential backoff: 2s, 4s, 8s... max 60s
  const delay = Math.min(
    RECONNECT_BASE_DELAY * Math.pow(2, reconnectAttempts),
    60000
  );
  reconnectAttempts++;

  console.log(`[WS] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`);

  reconnectTimer = setTimeout(() => {
    connectViaWebSocket(bridgeUrl);
  }, delay);
}

function handleBridgeMessage(msg: any): void {
  const store = useBridgeStatusStore.getState();

  switch (msg.type) {
    case 'HUB_ACK': {
      const ackPayload = {
        businessName: msg.businessName || 'Noxis Factory',
        businessId: msg.businessId || 'biz_01',
        role: (msg.role || 'owner').toLowerCase(),
        allowedTables: Array.isArray(msg.allowedTables)
          ? msg.allowedTables
          : [
              'ledger_entries',
              'peshgi_transactions',
              'parties',
              'karigar_logs',
              'piece_wages',
              'pos_orders',
              'customers',
              'suppliers',
            ],
        blockedTables: Array.isArray(msg.blockedTables) ? msg.blockedTables : [],
        hubHwid: msg.hubHwid || msg.hwid || 'hub_hwid_default',
      };

      store.setHubAckPayload(ackPayload as any);

      SecureStore.setItemAsync(
        'noxis_hub_ack_payload',
        JSON.stringify(ackPayload)
      ).catch((err) => {
        console.error('[WS] Failed to persist HUB_ACK in SecureStore:', err);
      });

      store.setStatus({
        hubOnline: true,
        syncStatus: 'synced',
        lastSeen: new Date().toISOString(),

        businessId: msg.businessId,
        businessName: msg.businessName,
        industry: msg.industry,
        city: msg.city,
        countryCode: msg.countryCode,
        currency: msg.currency,
        ownerPhone: msg.ownerPhone,

        tier: msg.tier,
        maxDevices: msg.maxDevices,
        isTrialActive: msg.isTrialActive,
        trialDaysRemaining: msg.trialDaysRemaining,

        canViewFinance: msg.canViewFinance,
        canViewIntelligence: msg.canViewIntelligence,
        canAccessApi: msg.canAccessApi,
        canUseAdvancedReports: msg.canUseAdvancedReports,

        workerTerm: msg.workerTerm,
        workerTermPlural: msg.workerTermPlural,
        advanceTerm: msg.advanceTerm,
        itemTerm: msg.itemTerm,

        connectedDevices: msg.connectedDevices,
      });
      console.log(
        `[WS] Paired with Hub: ${msg.businessName} (${msg.tier}) Role: ${ackPayload.role}`
      );

      // When Hub connection is established, drain any queued offline actions
      setTimeout(() => {
        const { onHubReconnect } = require('@/src/services/OfflineSyncService');
        onHubReconnect();
      }, 1000); // Short delay to let connection settle
      break;
    }

    case 'HEARTBEAT': {
      // Respond immediately
      wsSocket?.send(JSON.stringify({
        type: 'HEARTBEAT_RESPONSE',
        timestamp: Date.now(),
      }));
      store.setStatus({
        hubOnline: true,
        lastSeen: new Date().toISOString(),
        connectedDevices: msg.connectedDevices,
      });
      break;
    }

    case 'PAIRING_REJECTED': {
      console.error('[WS] Pairing rejected:', msg.reason);
      store.setStatus({
        hubOnline: false,
        syncStatus: 'offline',
        pairingError: msg.reason,
      });
      // Show alert to user
      if (typeof alert !== 'undefined') {
        alert(`Cannot connect to Hub:\n\n${msg.reason}`);
      } else {
        Alert.alert('Connection Rejected', `Cannot connect to Hub:\n\n${msg.reason}`);
      }
      break;
    }

    case 'DATA_RESPONSE': {
      // Handled by requestHubData() via one-time message listener
      break;
    }

    case 'ERROR': {
      console.error('[WS] Hub error:', msg.message);
      break;
    }

    case 'LOW_STOCK_ALERT': {
      notifyLowStock({
        itemName: msg.skuName,
        currentQty: msg.currentQty,
        unit: msg.unit,
        daysUntilStockout: msg.daysUntilStockout || 0,
      });
      break;
    }

    case 'PAYMENT_OVERDUE': {
      notifyPaymentOverdue({
        partyName: msg.partyName,
        amount: msg.amount,
        currency: store.currency || 'PKR',
        daysOverdue: msg.daysOverdue || 1,
      });
      break;
    }

    case 'FORESIGHT_ALERT': {
      if (msg.impact === 'critical' || msg.impact === 'high') {
        notifyForesight({
          title: msg.title,
          detail: msg.detail,
          impact: msg.impact,
        });
      }
      break;
    }

    default:
      console.warn('[WS] Unhandled message:', msg.type);
  }
}

// Request data from Hub's SQLite
export function requestHubData(
  resource: string,
  params: Record<string, any> = {}
): Promise<any[]> {
  return new Promise((resolve) => {
    if (!wsSocket || wsSocket.readyState !== WebSocket.OPEN) {
      resolve([]);
      return;
    }

    const requestId = `req_${Date.now().toString(36)}`;

    // 8 second timeout — fall back to empty
    const timeout = setTimeout(() => {
      wsSocket?.removeEventListener('message', handler);
      resolve([]);
    }, 8000);

    const handler = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'DATA_RESPONSE' && msg.requestId === requestId) {
          clearTimeout(timeout);
          wsSocket?.removeEventListener('message', handler);
          resolve(msg.data || []);
        }
      } catch { /* ignore */ }
    };

    wsSocket.addEventListener('message', handler);
    wsSocket.send(JSON.stringify({
      type: 'DATA_REQUEST',
      requestId,
      resource,
      params,
    }));
  });
}

// Notify Hub that something changed
export function notifyHub(
  type: string,
  data: any = {}
): void {
  if (!wsSocket || wsSocket.readyState !== WebSocket.OPEN) {
    return;
  }
  wsSocket.send(JSON.stringify({
    type,
    ...data,
    timestamp: Date.now(),
  }));
}

export function getConnectionState():
  'connected' | 'connecting' | 'disconnected' {
  if (!wsSocket) return 'disconnected';
  if (wsSocket.readyState === WebSocket.OPEN)
    return 'connected';
  if (wsSocket.readyState === WebSocket.CONNECTING)
    return 'connecting';
  return 'disconnected';
}

export function disconnect(): void {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  if (wsSocket) {
    try { wsSocket.close(1000, 'User disconnected'); } catch (e) {}
    wsSocket = null;
  }
  reconnectAttempts = 0;
}
