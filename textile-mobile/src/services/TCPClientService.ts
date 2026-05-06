import TcpSocket from 'react-native-tcp-socket';
import EventEmitter from 'eventemitter3';
import { AppState, type AppStateStatus } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MobileCrypto } from '../lib/MobileCrypto';
import { ProtobufService } from './ProtobufService';
import { useBridgeStatus } from '../store/BridgeStatusStore';
import { queueManager } from './OfflineQueueManager';

const HUB_PORT = 7447;
const BACKOFF_SEQUENCE = [1000, 2000, 4000, 8000, 15000, 30000];
const HEARTBEAT_INTERVAL = 15000;
const ACK_TIMEOUT = 5000;

/**
 * PRODUCTION-GRADE TCP CLIENT SERVICE v2
 * Implements resilient range handling, session resumption, and watchdog monitoring.
 */
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
    // Session Resumption: Send token BEFORE ECDH to skip re-pairing
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

      // Send HeartbeatEvent (Tier 3)
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

    const bridgeStore = useBridgeStatus.getState();
    bridgeStore.setConnectionState('offline');
    this.emit('connectionChange', false);
    
    const { meshBus, MeshEvent } = require('./MeshEventBus');
    meshBus.broadcast(MeshEvent.HUB_STATUS_CHANGE, { status: 'OFFLINE' });

    if (this.socket) {
      try { 
        this.socket.removeAllListeners();
        this.socket.destroy(); 
      } catch (e) {}
      this.socket = null;
    }

    this.scheduleReconnect();
  }

  public destroy() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.destroy();
      this.socket = null;
    }
  }

  private scheduleReconnect() {
    const bridgeStore = useBridgeStatus.getState();
    bridgeStore.incrementReconnectAttempts();

    if (bridgeStore.reconnectAttempts > 5) {
      this.emit('hub_unreachable');
    }

    // Exponential Backoff Delay
    const delay = Math.min(BACKOFF_SEQUENCE[this.backoffIndex] || 30000, 30000);
    console.log(`[TCP] Reconnecting in ${delay}ms... (Attempt ${bridgeStore.reconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isConnected && this.host) {
        this.connect(this.host);
      } else if (!this.host) {
        // If host is lost, restart auto-discovery
        const { NoxisDiscoveryService } = require('./NoxisDiscoveryService');
        NoxisDiscoveryService.startScan();
      }
    }, delay);

    // Advance backoff sequence
    if (this.backoffIndex < BACKOFF_SEQUENCE.length - 1) {
      this.backoffIndex++;
    }
  }

  private handleData(chunk: Uint8Array) {
    this.dataBuffer = Buffer.concat([this.dataBuffer, Buffer.from(chunk)]);
    
    while (this.dataBuffer.length >= 4) {
      try {
        const length = this.dataBuffer.readUInt32LE(0);
        if (this.dataBuffer.length >= 4 + length) {
          const payload = this.dataBuffer.subarray(4, 4 + length);
          this.dataBuffer = this.dataBuffer.subarray(4 + length);
          this.processRawPayload(payload);
        } else {
          break; // Wait for more data
        }
      } catch (e) {
        console.error('[TCP] Framing Error:', e);
        this.dataBuffer = Buffer.alloc(0); // Reset on corruption
        break;
      }
    }
  }

  private async processRawPayload(payload: Buffer) {
    try {
      let decrypted: any;
      const raw = payload.toString('utf8');

      if (raw.startsWith('{')) {
        decrypted = JSON.parse(raw);
      } else {
        // Assume encrypted if not raw JSON
        if (this.meshKey) {
          const decryptedBytes = await MobileCrypto.decrypt(payload, this.meshKey);
          const decryptedStr = Buffer.from(decryptedBytes).toString('utf8');
          decrypted = JSON.parse(decryptedStr);
        } else {
          decrypted = JSON.parse(raw);
        }
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
        this.missedHeartbeats = 0; // Reset on any valid hub response
        if (msg.offset !== undefined) {
          bridgeStore.setSyncOffset(msg.offset);
          await queueManager.drainPersistedQueue();
        }
        if (msg.token) {
          await SecureStore.setItemAsync('omnora_session_token', msg.token);
        }
        
        const { NspService: HiNsp } = require('./NspService');
        HiNsp.onHubAck(msg);

        if (msg.profile) {
          // Will be handled by ProfileStore
          this.emit('profileChange', msg.profile);
        }
        break;

      case 'ACK':
        this.missedHeartbeats = 0;
        const now = Date.now();
        if (msg.ts) {
          bridgeStore.recordRtt(now - msg.ts);
        }
        bridgeStore.setLastAckAt(now);
        
        // Resolve pending request if packetId matches
        if (msg.packetId && this.pendingRequests.has(msg.packetId)) {
          const req = this.pendingRequests.get(msg.packetId)!;
          clearTimeout(req.timeout);
          this.pendingRequests.delete(msg.packetId);
          req.resolve(msg);
        }
        
        const { NspService: AckNsp } = require('./NspService');
        AckNsp.onHubAck(msg);
        break;

      case 'HB_ACK':
        this.missedHeartbeats = 0;
        break;
        
      case 'MSG':
        const { MessageService } = require('./MessageService');
        MessageService.receiveMessage(msg.payload);
        break;

      case 'TELEMETRY':
        const { useDiagnosticStore } = require('../store/DiagnosticsStore');
        useDiagnosticStore.getState().addTelemetry({
          timestamp: msg.ts || Date.now(),
          cpu_temp: msg.cpu_temp || 0,
          cpu_load: msg.cpu_load || 0,
          ram_usage: msg.ram_usage || 0,
          yarn_tension: msg.yarn_tension || 0,
          loom_speed: msg.loom_speed || 0,
          vibration_index: msg.vibration_index || 0,
        });
        break;

      case 'CRITICAL_SECURITY':
        const { SentinelService } = require('../lib/notifications/SentinelService');
        SentinelService.triggerSecurityAlert(
          msg.title || 'SECURITY BREACH',
          msg.body || 'Intruder detected in Zone 4. Review YOLO footage.',
          msg.image_url // BigPicture frame from PC Hub
        );
        break;
        
      case 'PRODUCTION_MILESTONE':
        const { SentinelService: ProductionSentinel } = require('../lib/notifications/SentinelService');
        ProductionSentinel.triggerProductionMilestone(
          msg.title || 'BATCH COMPLETED',
          msg.body || 'Loom #12 finished Lot 404.'
        );
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

  /**
   * Sends an NSP request and waits for a response with the same requestId.
   */
  public async request(payload: any, timeout: number = 10000): Promise<any> {
    if (!this.isConnected) throw new Error('OFFLINE');
    
    const requestId = Math.random().toString(36).substring(2, 10);
    
    // Inject requestId into the nsp envelope if it's an NSP packet
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

  public getStatus() { return this.isConnected; }
  
  public async drainQueue() {
    const { queueManager } = require('./OfflineQueueManager');
    await queueManager.drainPersistedQueue();
  }
}

export const tcpService = new TCPClientService();
