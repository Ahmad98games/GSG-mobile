import notifee, { AndroidImportance, AndroidVisibility, EventType } from './notifee';
import { tcpService } from '../../services/TCPClientService';

/**
 * NOXIS SENTINEL INTELLIGENCE SERVICE
 * Industrial security monitoring and real-time alert system.
 */

export class SentinelService {
  private static channelId: string | null = null;

  /**
   * Initializes the Sentinel notification channel with industrial-grade priority.
   */
  public static async initialize() {
    this.channelId = await notifee.createChannel({
      id: 'noxis-sentinel-security',
      name: 'Noxis Sentinel Intelligence',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      lights: true,
      lightColor: '#FF0000', // Neon Red for security
      vibration: true,
    });

    // Background Event Listener
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;

      if (type === EventType.ACTION_PRESS && pressAction?.id === 'sound-alarm') {
        console.log('[SENTINEL] REMOTE_ALARM_TRIGGERED');
        // Send command back to Hub to trigger physical siren
        tcpService.sendMessage({
          t: 'CMD',
          cmd: 'TRIGGER_SIREN',
          ts: Date.now()
        });
        
        await notifee.cancelNotification(notification!.id!);
      }
    });
  }

  /**
   * Triggers a critical security alert with rich media (YOLO frame).
   */
  public static async triggerSecurityAlert(title: string, body: string, imageUrl?: string) {
    if (!this.channelId) await this.initialize();

    await notifee.displayNotification({
      title: `🚨 ${title}`,
      body: body,
      android: {
        channelId: this.channelId!,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        color: '#FF0000',
        smallIcon: 'ic_launcher', // Assumed Noxis 'N' logo icon
        style: imageUrl ? {
          type: 0, // BigPicture
          picture: imageUrl,
        } : undefined,
        actions: [
          {
            title: 'SOUND ALARM',
            pressAction: { id: 'sound-alarm' },
          },
          {
            title: 'IGNORE',
            pressAction: { id: 'ignore' },
          },
        ],
      },
    });
  }

  /**
   * Triggers a production milestone notification.
   */
  public static async triggerProductionMilestone(title: string, body: string) {
    const milestoneChannelId = await notifee.createChannel({
      id: 'noxis-sentinel-production',
      name: 'Noxis Production Intelligence',
      importance: AndroidImportance.DEFAULT,
      lightColor: '#10B981', // Emerald Green
    });

    await notifee.displayNotification({
      title: `✅ ${title}`,
      body: body,
      android: {
        channelId: milestoneChannelId,
        color: '#10B981',
        smallIcon: 'ic_launcher',
      },
    });
  }
}
