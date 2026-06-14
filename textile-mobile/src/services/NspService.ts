import { tcpService } from './TCPClientService';
import { meshBus, MeshEvent } from './MeshEventBus';
import { SentinelService } from '../lib/notifications/SentinelService';
import { NoxisGuardianService } from './NoxisGuardianService';
import { useBridgeStatus, useBridgeStatusStore } from '../store/BridgeStatusStore';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { notificationService } from '../lib/notifications/NotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../utils/storage';
import { PersonaEngine } from '@/lib/persona/PersonaEngine';
import { useTierStore } from '../stores/TierStore';
import { Alert } from 'react-native';
import { NoxisEvents } from '../utils/events';

const sendMessage = (payload: any) => {
  tcpService.sendMessage({
    t: 'NSP_PACKET',
    nsp: payload,
    ts: Date.now()
  });
};

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
    const rawPending = await getSafeStorage('pending_breach_ack');
    const pending = rawPending ? JSON.parse(rawPending) : null;
    if (pending) {
      try {
        const { notificationId, timestamp } = pending;
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
    if (envelope && envelope.type) {
      const message = envelope;
      switch (message.type) {
        case 'HUB_ACK': {
          const {
            businessName, industry, industryKey,
            city, countryCode, currency,
            tier, maxDevices, isTrialActive,
            trialDaysRemaining, workerTerm,
            workerTermPlural, advanceTerm, itemTerm,
            ownerPhone, canAccessApi,
          } = message;

          // Update BridgeStatusStore with all hub data
          useBridgeStatusStore.getState().setStatus({
            hubOnline: true,
            syncStatus: 'synced',
            lastSeen: new Date().toISOString(),
            businessName: businessName || 'My Factory',
            industry: industry || 'General',
            industryKey: industryKey || 'general',
            city: city || '',
            countryCode: countryCode || 'PK',
            currency: currency || 'PKR',
            tier: (tier || 'lite') as any,
            maxDevices: maxDevices || 5,
            isTrialActive: isTrialActive || false,
            trialDaysRemaining: trialDaysRemaining || null,
            workerTerm: workerTerm || 'Karigar',
            workerTermPlural: workerTermPlural || 'Karigars',
            advanceTerm: advanceTerm || 'Peshgi',
            itemTerm: itemTerm || 'Item',
            ownerPhone: ownerPhone || '',
            ownerWhatsApp: ownerPhone || '',
            canViewFinance:
              ['pro','elite'].includes(tier || ''),
            canViewIntelligence:
              ['pro','elite'].includes(tier || ''),
            canAccessApi: canAccessApi !== undefined ? canAccessApi : ['pro', 'elite'].includes(tier || ''),
          });

          // Persist to AsyncStorage for offline use
          try {
            await AsyncStorage.setItem(
              'noxis_bridge_status',
              JSON.stringify(
                useBridgeStatusStore.getState()
              )
            );
          } catch {}
          break;
        }

        case 'HEARTBEAT': {
          // Respond immediately
          sendMessage({ type: 'HEARTBEAT_RESPONSE',
            timestamp: Date.now() });
          useBridgeStatusStore.getState().setStatus({
            hubOnline: true,
            lastSeen: new Date().toISOString(),
          });
          break;
        }

        case 'HUB_SYNC': {
          useBridgeStatusStore.getState().setStatus({
            syncStatus: 'synced',
            lastSeen: new Date().toISOString(),
          });
          NoxisEvents.emit('HUB_SYNC', message);
          break;
        }

        case 'STOCK_UPDATED': {
          NoxisEvents.emit('STOCK_UPDATED', message);
          const skuCode = message.sku_code || message.sku;
          const qtyOnHand = String(message.qty_on_hand || message.quantity || 0);
          const unit = message.unit || 'pcs';
          if (message.is_low_stock) {
            await notificationService.displayLowStock(skuCode, qtyOnHand, unit);
          }
          break;
        }

        case 'INVOICE_CREATED': {
          NoxisEvents.emit('INVOICE_CREATED', message);
          const invoiceId = message.invoice_id || message.id || '';
          const partyName = message.party_name || message.customer || 'Customer';
          const amount = message.amount || '0.00';
          await notificationService.displayInvoiceCreated(invoiceId, partyName, amount);
          break;
        }

        case 'PRODUCTION_LOGGED': {
          NoxisEvents.emit('PRODUCTION_LOGGED', message);
          const workerName = message.worker_name || message.worker || 'Worker';
          const qty = message.qty || message.quantity || 0;
          const item = message.item_name || message.item || 'pcs';
          await notificationService.displayProductionLogged(workerName, qty, item);
          break;
        }

        case 'PAIRING_REJECTED': {
          Alert.alert(
            'Cannot Connect',
            message.reason ||
              'Device limit reached. Upgrade your Noxis plan.',
            [{ text: 'OK' }]
          );
          break;
        }

        default: {
          console.warn(
            '[NSP] Unhandled message type:',
            message.type
          );
          break;
        }
      }
      return;
    }

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
    } else if (envelope.cashflow_res) {
      this.onCashflowResponse(envelope.cashflow_res);
    } else if (envelope.analytics_res) {
      this.onAnalyticsResponse(envelope.analytics_res);
    } else if (envelope.efficiency_res) {
      this.onEfficiencyRankingResponse(envelope.efficiency_res);
    } else if (envelope.shift_handover_ack) {
      this.onShiftHandoverAck(envelope.shift_handover_ack);
    } else if (envelope.dead_stock_alert) {
      this.onDeadStockAlert(envelope.dead_stock_alert);
    } else if (envelope.audit_reminder) {
      this.onAuditReminder(envelope.audit_reminder);
    } else if (envelope.staff_action) {
      this.onStaffAction(envelope.staff_action);
    } else if (envelope.pairing_rejected) {
      this.onPairingRejected(envelope.pairing_rejected);
    }
  }

  private static onCashflowResponse(res: any) {
    const { useCashflowStore } = require('../store/CashflowStore');
    useCashflowStore.getState().setCashflowData({
      currentCash: res.current_cash,
      inflows30d: res.inflows_30d,
      outflows30d: res.outflows_30d,
      netPosition: res.net_position,
      riskLevel: res.risk_level as any,
      shortfallDate: res.shortfall_date
    });
    meshBus.broadcast(MeshEvent.CASHFLOW_UPDATE, res);
  }

  private static onAnalyticsResponse(res: any) {
    const { useAnalyticsStore } = require('../store/AnalyticsStore');
    useAnalyticsStore.getState().setAnalyticsData({
      todayRevenue: res.today_revenue,
      outstandingTotal: res.outstanding_total,
      activeKarigars: res.active_karigars,
      lowStockCount: res.low_stock_count,
      anomalyCount: res.anomaly_count,
      lastUpdated: res.last_updated
    });
    meshBus.broadcast(MeshEvent.ANALYTICS_UPDATE, res);
  }

  private static onEfficiencyRankingResponse(res: any) {
    const { useLeaderboardStore } = require('../store/LeaderboardStore');
    useLeaderboardStore.getState().setRankings(res.rankings.map((r: any) => ({
      rank: r.rank,
      karigarId: r.karigar_id,
      name: r.name,
      code: r.code,
      unitsProduced: r.units_produced,
      qualityScore: r.quality_score,
      efficiencyRate: r.efficiency_rate
    })));
    meshBus.broadcast(MeshEvent.LEADERBOARD_UPDATE, res);
  }

  private static onShiftHandoverAck(ack: any) {
    console.log(`[NSP / HANDOVER] ACK: ${ack.handover_id} SUCCESS: ${ack.success}`);
    meshBus.broadcast(MeshEvent.SHIFT_HANDOVER_ACK, ack);
  }
  
  private static onDeadStockAlert(event: any) {
    console.log(`[NSP / STOCK] DEAD_STOCK detected for ${event.sku_code}`);
    notificationService.displayDeadStock(event.sku_code, event.days_idle);
    meshBus.broadcast(MeshEvent.DEAD_STOCK_ALERT, event);
  }

  private static onAuditReminder(event: any) {
    console.log(`[NSP / AUDIT] REMINDER for Audit ${event.audit_id}`);
    notificationService.displayAuditReminder(event.audit_id, event.deadline);
    meshBus.broadcast(MeshEvent.AUDIT_REMINDER, event);
  }

  private static onStaffAction(event: any) {
    console.log(`[NSP / STAFF] ACTION: ${event.action} by ${event.staff_name}`);
    notificationService.displayStaffAction(event.action, event.staff_name);
    meshBus.broadcast(MeshEvent.STAFF_ACTION, event);
  }

  /**
   * Handles Hub acknowledgments to synchronize system-wide status and tier.
   */
  public static onHubAck(ack: any) {
    console.log(`[NSP / ACK] Status: ${ack.status} Profile: ${ack.activeProfile || 'N/A'}`);
    
    const bridgeStore = useBridgeStatus.getState();
    bridgeStore.setTierFromHubAck(ack);

    // Sync Mobile TierStore
    if (ack.tier) {
      useTierStore.getState().setTierFromHub({
        tier: ack.tier,
        expiresAt: ack.expires_at || '',
        limits: ack.limits || {},
      });
    }

    // Sync PersonaEngine with latest Hub defaults
    PersonaEngine.updateManifest({
      currency: ack.currency || bridgeStore.currency,
      region: ack.region || bridgeStore.currencyRegion
    });

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

  private static onPairingRejected(event: any) {
    console.warn(`[NSP / PAIRING] REJECTED: ${event.reason}`);
    
    Alert.alert(
      'Connection Rejected',
      `Cannot connect — Hub device limit reached.\n\nYour Hub is on ${event.tier.toUpperCase()} plan which allows ${event.limit} mobile devices.\n\nPlease contact support to upgrade.`,
      [{ text: 'OK' }]
    );
    
    const status = useBridgeStatus.getState();
    status.setConnectionState('offline');
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
