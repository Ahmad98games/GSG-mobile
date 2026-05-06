import { tcpService } from './TCPClientService';
import { meshBus, MeshEvent } from './MeshEventBus';
import { SentinelService } from '../lib/notifications/SentinelService';
import { NoxisGuardianService } from './NoxisGuardianService';
import { useBridgeStatus } from '../store/BridgeStatusStore';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { notificationService } from '../lib/notifications/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * NOXIS SYNAPSE PROTOCOL (NSP) SERVICE
 * Hardened bi-directional event routing over established TCP pipeline.
 */
export class NspService {
  private static appState: AppStateStatus = AppState.currentState;
  private static currentPath: string = '';
  private static appStateSubscription: { remove: () => void } | null = null;

  /**
   * INITIALIZE NSP SERVICE
   * Sets up AppState listeners and checks for pending background ACKs.
   */
  public static initialize() {
    if (this.appStateSubscription) return; // Prevent double initialization

    this.appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (this.appState.match(/inactive|background/) && nextAppState === 'active') {
        this.checkPendingAcks();
        notificationService.clearBadges();
      }
      this.appState = nextAppState;
    });
  }

  public static destroy() {
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
  }

  public static setPath(path: string) {
    this.currentPath = path;
  }

  private static async checkPendingAcks() {
    const pending = await AsyncStorage.getItem('pending_breach_ack');
    if (pending) {
      try {
        const { notificationId, timestamp } = JSON.parse(pending);
        console.log(`[NSP] Resuming with pending ACK for ${notificationId}`);
        
        const payload = {
          t: 'GUARDIAN_AUTH_RESPONSE',
          request_id: notificationId, // Using notifee_id as correlation
          approved: true,
          ts: timestamp
        };

        // If TCP connected, send immediately. Otherwise, persistence layer (M8) handles it.
        const { queueManager } = require('./OfflineQueueManager');
        await queueManager.enqueueNspEvent(payload);

        await AsyncStorage.removeItem('pending_breach_ack');
      } catch (e) {
        console.error('[NSP] PENDING_ACK_FAULT:', e);
      }
    }
  }

  /**
   * Routes an incoming NSP envelope to the appropriate handler.
   */
  public static async handleEnvelope(envelope: any) {
    if (envelope.sentinel_breach) {
      this.onSentinelBreach(envelope.sentinel_breach);
    } else if (envelope.system_lock) {
      this.onSystemLock(envelope.system_lock);
    } else if (envelope.guardian_request) {
      this.onGuardianRequest(envelope.guardian_request);
    } else if (envelope.heartbeat_alert) {
      this.onHeartbeatAlert(envelope.heartbeat_alert);
    } else if (envelope.voice_command_result) {
      this.onVoiceCommandResult(envelope.voice_command_result);
    } else if (envelope.presence_update) {
      this.onPresenceUpdate(envelope.presence_update);
    } else if (envelope.tactical_message) {
      this.onTacticalMessage(envelope.tactical_message);
    }
  }

  /**
   * Handles Hub acknowledgments to synchronize system-wide status and tier.
   */
  public static onHubAck(ack: any) {
    console.log(`[NSP / ACK] Status: ${ack.status} Profile: ${ack.activeProfile || 'N/A'}`);
    
    const bridgeStore = useBridgeStatus.getState();
    bridgeStore.setTierFromHubAck(ack);

    // Flow 4: Handle branch switch confirmation
    if (ack.active_branch_id) {
      const { useBranchStore } = require('../stores/branchStore');
      useBranchStore.getState().onBranchSwitchConfirmed(ack.active_branch_id);
    }

    // Hub recently added 'connected_node_count' to its internal telemetry broadcast.
    if (ack.connected_node_count !== undefined) {
      bridgeStore.setConnectedNodeCount(ack.connected_node_count);
    }
  }

  private static onPresenceUpdate(event: any) {
    console.log(`[NSP / PRESENCE] NODE: ${event.node_id} STATUS: ${event.status}`);
    meshBus.broadcast(MeshEvent.PRESENCE_UPDATE, event);
  }

  private static onSentinelBreach(event: any) {
    console.log(`[NSP / SENTINEL] BREACH_DETECTED in Zone: ${event.zone_id}`);
    
    // Add to active alerts for overlay
    const { useAlertStore } = require('../store/AlertStore');
    useAlertStore.getState().addBreach(event);
    
    // Trigger rich notification if backgrounded OR not on CCTV screen
    const isBackground = this.appState !== 'active';
    const isCctvPage = this.currentPath.includes('/cctv');
    
    if (isBackground || !isCctvPage) {
      notificationService.displaySentinelBreach(event);
    } else {
      console.log('[NSP / SENTINEL] Suppression: CCTV screen active and foregrounded.');
    }

    meshBus.broadcast(MeshEvent.SENTINEL_BREACH, event);
  }

  private static onSystemLock(cmd: any) {
    console.log(`[NSP / SYSTEM] LOCK_COMMAND: ${cmd.lock ? 'LOCK' : 'UNLOCK'} - Reason: ${cmd.reason}`);
    
    // Always display system lock notification
    notificationService.displaySystemLock(cmd.reason);
    
    meshBus.broadcast(MeshEvent.SYSTEM_LOCK, { lock: cmd.lock, reason: cmd.reason });
  }

  private static onGuardianRequest(req: any) {
    console.log(`[NSP / GUARDIAN] AUTH_REQUEST: ${req.request_id} for ${req.hub_action}`);
    
    NoxisGuardianService.requestBiometric(req).catch(err => {
      console.error('[NSP / GUARDIAN] AUTH_FAULT', err);
    });
  }

  private static onHeartbeatAlert(event: any) {
    console.log(`[NSP / HEARTBEAT] ALERT: ${event.alert_type}`);
    
    const status = useBridgeStatus.getState();
    switch (event.alert_type) {
      case 'hub_offline':
        status.setConnectionState('offline');
        notificationService.displayHeartbeatAlert('OFFLINE');
        break;
      case 'hub_degraded':
        status.setConnectionState('reconnecting');
        break;
      case 'hub_recovered':
        status.setConnectionState('connected');
        break;
    }
    
    meshBus.broadcast(MeshEvent.HUB_STATUS_CHANGE, { status: event.alert_type });
    meshBus.broadcast(MeshEvent.HEARTBEAT_ALERT, event);
  }

  private static onVoiceCommandResult(result: any) {
    console.log(`[NSP / VOICE] COMMAND_RESULT: ${result.command_text}`);
    // VoiceCommandProcessor handles the result locally
  }

  private static onTacticalMessage(event: any) {
    console.log(`[NSP / MSG] NEW_MESSAGE from ${event.fromNodeId}`);
    
    // Only notify if backgrounded
    if (this.appState !== 'active') {
      notificationService.displayTacticalMessage({
        fromNodeId: event.fromNodeId,
        preview: event.content || 'New message',
        messageId: event.messageId
      });
    }

    meshBus.broadcast(MeshEvent.TACTICAL_MESSAGE, event);
  }

  /**
   * Sends an NSP response back to the Hub.
   */
  public static async sendResponse(payload: any) {
    tcpService.sendMessage({
      t: 'NSP_PACKET',
      nsp: payload,
      ts: Date.now()
    });
  }

  /**
   * Sends an NSP request and waits for a response.
   */
  public static async send(payload: any, timeout: number = 5000): Promise<any> {
    return tcpService.request({
      nsp: payload
    }, timeout);
  }
}
