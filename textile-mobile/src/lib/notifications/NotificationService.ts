import notifee, { AndroidImportance, AndroidGroupAlertBehavior } from './notifee';
import { CHANNELS } from './NotificationChannels';
import { useQuietHoursStore } from '../../stores/QuietHoursStore';
import { PersonaEngine } from '../persona/PersonaEngine';
import { openMeshDb } from '../db/meshDb';
import { Buffer } from 'buffer';

export interface SentinelBreachEvent {
  node_id: string;
  zone_id: string;
  detected_class: string;
  confidence: number;
  timestamp: number;
  jpeg_frame?: Uint8Array | string;
}

/**
 * NOTIFICATION SERVICE
 * Centralized authority for all industrial alert dispatching.
 */
class NotificationService {
  private async shouldSuppress(isCritical: boolean): Promise<boolean> {
    if (isCritical) return false;
    return useQuietHoursStore.getState().isQuietHoursActive();
  }

  private async logNotification(params: {
    type: string;
    title: string;
    body: string;
    suppressed?: boolean;
    notifeeId?: string;
    payload?: any;
  }) {
    try {
      const db = await openMeshDb();
      const id = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 13); // 21 chars approx
      await db.runAsync(
        'INSERT INTO notification_log (id, event_type, title, body, suppressed, notifee_id, payload) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, params.type, params.title, params.body, params.suppressed ? 1 : 0, params.notifeeId || null, JSON.stringify(params.payload || {})]
      );
    } catch (e) {
      console.error('[NotificationService] Logging failed:', e);
    }
  }

  /**
   * HEARTBEAT ALERT
   * Suppressible. Warns of connectivity or battery issues.
   */
  public async displayHeartbeatAlert(type: 'OFFLINE' | 'LOW_BATTERY'): Promise<void> {
    if (await this.shouldSuppress(false)) return;

    const title = PersonaEngine.t(`alert.heartbeat_${type.toLowerCase()}`);
    const body = PersonaEngine.t(`alert.heartbeat_${type.toLowerCase()}_body`);

    const id = await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNELS.HEARTBEAT_ALERT,
      },
    });

    await this.logNotification({ type: 'heartbeat_alert', title, body, notifeeId: id, payload: { type } });
  }

  /**
   * CRITICAL SECURITY ALERT
   * Never suppressed. Launches CCTV feed on press.
   */
  public async displaySentinelBreach(event: SentinelBreachEvent): Promise<void> {
    const title = PersonaEngine.t('alert.sentinel_breach');
    const body = `${event.detected_class} detected in ${event.zone_id}`;
    
    let largeIcon: string | undefined;
    if (event.jpeg_frame && event.jpeg_frame.length > 0) {
      try {
        const base64Data = typeof event.jpeg_frame === 'string' 
          ? event.jpeg_frame 
          : Buffer.from(event.jpeg_frame).toString('base64');
        
        // Ensure prefix is present as Android requires it for base64 source
        largeIcon = base64Data.startsWith('data:') 
          ? base64Data 
          : `data:image/jpeg;base64,${base64Data}`;
      } catch (e) {
        console.error('[NotificationService] JPEG_CONVERSION_FAULT:', e);
        // largeIcon remains undefined, but execution continues to displayNotification
      }
    }

    const id = await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNELS.SENTINEL_BREACH,
        importance: AndroidImportance.HIGH,
        fullScreenAction: { id: 'breach_action' },
        ongoing: true,
        color: '#EF4444',
        smallIcon: 'ic_breach_alert',
        largeIcon,
        actions: [
          { title: 'Acknowledge', pressAction: { id: 'ack_breach' } }
        ],
      },
      ios: {
        critical: true,
        sound: 'breach_alert.wav',
        categoryId: 'SENTINEL_BREACH',
      }
    });

    await this.logNotification({ 
      type: 'sentinel_breach', 
      title, 
      body, 
      notifeeId: id, 
      payload: event 
    });
  }

  /**
   * LOW STOCK ALERT
   * Suppressible during quiet hours.
   */
  public async displayLowStock(skuCode: string, qtyOnHand: string, unit: string): Promise<void> {
    if (await this.shouldSuppress(false)) return;

    const title = PersonaEngine.t('alert.low_stock');
    const body = `${skuCode}: ${qtyOnHand} ${unit} remaining`;

    const id = await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNELS.LOW_STOCK,
        groupSummary: false,
        groupId: 'low_stock_group',
        groupAlertBehavior: AndroidGroupAlertBehavior.CHILDREN,
      },
    });

    await notifee.incrementBadgeCount();
    await this.logNotification({ 
      type: 'low_stock', 
      title, 
      body, 
      notifeeId: id, 
      payload: { skuCode } 
    });
  }

  /**
   * PAYMENT RECEIVED
   * Suppressible during quiet hours.
   */
  public async displayPaymentReceived(params: {
    partyName: string;
    amount: string;
    currency: string;
  }): Promise<void> {
    if (await this.shouldSuppress(false)) return;

    const title = PersonaEngine.t('alert.payment_received');
    const body = `${params.partyName} · ${params.amount}`;

    const id = await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNELS.PAYMENT_RECEIVED,
        groupId: 'payments_group',
      },
    });

    await notifee.incrementBadgeCount();
    await this.logNotification({ 
      type: 'payment_received', 
      title, 
      body, 
      notifeeId: id, 
      payload: params 
    });
  }

  /**
   * TACTICAL MESSAGE
   * Suppressible during quiet hours.
   */
  public async displayTacticalMessage(params: {
    fromNodeId: string;
    preview: string;
    messageId: string;
  }): Promise<void> {
    if (await this.shouldSuppress(false)) return;

    const title = PersonaEngine.t('alert.new_message');
    let preview = params.preview;
    if (preview.length > 80) {
      preview = preview.substring(0, 77) + '...';
    }

    const id = await notifee.displayNotification({
      title,
      body: preview,
      android: {
        channelId: CHANNELS.TACTICAL_MESSAGE,
        pressAction: { id: 'open_messenger', launchActivity: 'default' },
      },
    });

    await this.logNotification({ 
      type: 'tactical_message', 
      title, 
      body: preview, 
      notifeeId: id, 
      payload: params 
    });
  }

  /**
   * DEAD STOCK ALERT
   * Suppressible. Warns of non-moving inventory.
   */
  public async displayDeadStock(skuCode: string, daysIdle: number): Promise<void> {
    if (await this.shouldSuppress(false)) return;

    const title = PersonaEngine.t('alert.dead_stock');
    const body = `${skuCode}: Non-moving for ${daysIdle} days`;

    const id = await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNELS.DEAD_STOCK,
      },
    });

    await this.logNotification({ 
      type: 'dead_stock', 
      title, 
      body, 
      notifeeId: id, 
      payload: { skuCode, daysIdle } 
    });
  }

  /**
   * AUDIT REMINDER
   * High importance. Compliance check requested.
   */
  public async displayAuditReminder(auditId: string, deadline: string): Promise<void> {
    const title = PersonaEngine.t('alert.audit_reminder');
    const body = `Audit ${auditId} due by ${deadline}`;

    const id = await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNELS.AUDIT_REMINDER,
        importance: AndroidImportance.HIGH,
      },
    });

    await this.logNotification({ 
      type: 'audit_reminder', 
      title, 
      body, 
      notifeeId: id, 
      payload: { auditId } 
    });
  }

  /**
   * STAFF ACTION
   * Operational notification regarding workforce tasks.
   */
  public async displayStaffAction(action: string, staffName: string): Promise<void> {
    if (await this.shouldSuppress(false)) return;

    const title = PersonaEngine.t('alert.staff_action');
    const body = `${staffName}: ${action}`;

    const id = await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNELS.STAFF_ACTION,
      },
    });

    await this.logNotification({ 
      type: 'staff_action', 
      title, 
      body, 
      notifeeId: id, 
      payload: { staffName } 
    });
  }

  /**
   * INVOICE CREATED
   * Suppressible. Warns of new invoices.
   */
  public async displayInvoiceCreated(invoiceId: string, partyName: string, amount: string): Promise<void> {
    if (await this.shouldSuppress(false)) return;

    const title = `Invoice Created: #${invoiceId}`;
    const body = `${partyName} · Amount: ${amount}`;

    const id = await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNELS.NOXIS_ALERTS,
      },
    });

    await notifee.incrementBadgeCount();
    await this.logNotification({ 
      type: 'invoice_created', 
      title, 
      body, 
      notifeeId: id, 
      payload: { invoiceId, partyName, amount } 
    });
  }

  /**
   * PRODUCTION LOGGED
   * Suppressible. Logs piece rate entries.
   */
  public async displayProductionLogged(workerName: string, qty: number, item: string): Promise<void> {
    if (await this.shouldSuppress(false)) return;

    const title = `Production Logged`;
    const body = `${workerName} produced ${qty} ${item}`;

    const id = await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNELS.PRODUCTION_ALERT,
      },
    });

    await notifee.incrementBadgeCount();
    await this.logNotification({ 
      type: 'production_logged', 
      title, 
      body, 
      notifeeId: id, 
      payload: { workerName, qty, item } 
    });
  }

  /**
   * SYSTEM LOCK COMMAND
   * Never suppressed. Launches lock overlay.
   */
  public async displaySystemLock(reason: string): Promise<void> {
    const title = PersonaEngine.t('alert.system_lock');
    const body = reason.length > 200 ? reason.substring(0, 197) + '...' : reason;

    const id = await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: CHANNELS.SYSTEM_LOCK,
        ongoing: true,
        importance: AndroidImportance.HIGH,
        fullScreenAction: { id: 'lock_action' },
        color: '#EF4444',
      },
    });

    await this.logNotification({ 
      type: 'system_lock', 
      title, 
      body, 
      notifeeId: id, 
      payload: { reason } 
    });
  }

  /**
   * CLEAR BADGES
   * Invoked when app enters foreground.
   */
  public async clearBadges(): Promise<void> {
    await notifee.setBadgeCount(0);
  }

  /**
   * CANCEL SPECIFIC NOTIFICATION
   */
  public async cancelNotification(id: string): Promise<void> {
    await notifee.cancelNotification(id);
  }
}

export const notificationService = new NotificationService();
