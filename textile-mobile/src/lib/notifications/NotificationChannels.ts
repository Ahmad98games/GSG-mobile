import notifee, { AndroidImportance, AndroidColor } from './notifee';
import { Platform } from 'react-native';

/**
 * NOTIFICATION CHANNEL IDs
 * Fixed constants for high-integrity alert routing.
 */
export const CHANNELS = {
  SENTINEL_BREACH: 'sentinel_breach',
  LOW_STOCK: 'low_stock',
  PAYMENT_RECEIVED: 'payment_received',
  TACTICAL_MESSAGE: 'tactical_message',
  SYSTEM_LOCK: 'system_lock',
  HEARTBEAT_ALERT: 'heartbeat_alert',
} as const;

/**
 * REGISTER NOTIFICATION CHANNELS
 * Configures Android channels for industrial alerts.
 * Custom sounds must exist in android/app/src/main/res/raw/
 */
export async function registerChannels() {
  if (Platform.OS !== 'android') return;

  const existingChannels = await notifee.getChannels();
  const existingIds = existingChannels.map(c => c.id);

  const channelsToCreate = [
    {
      id: CHANNELS.SENTINEL_BREACH,
      name: 'Security Alerts',
      importance: AndroidImportance.HIGH,
      sound: 'breach_alert',
      vibration: true,
      vibrationPattern: [0, 500, 200, 500],
      lights: true,
      lightColor: AndroidColor.RED,
      badge: true,
    },
    {
      id: CHANNELS.LOW_STOCK,
      name: 'Stock Alerts',
      importance: AndroidImportance.DEFAULT,
      vibration: true,
      badge: true,
    },
    {
      id: CHANNELS.PAYMENT_RECEIVED,
      name: 'Payment Alerts',
      importance: AndroidImportance.DEFAULT,
      badge: true,
    },
    {
      id: CHANNELS.TACTICAL_MESSAGE,
      name: 'Mesh Messages',
      importance: AndroidImportance.HIGH,
      badge: true,
    },
    {
      id: CHANNELS.SYSTEM_LOCK,
      name: 'System Commands',
      importance: AndroidImportance.HIGH,
      sound: 'system_alert',
      vibration: true,
      vibrationPattern: [0, 1000, 500, 1000],
      lights: true,
      lightColor: AndroidColor.RED,
      badge: false,
    },
    {
      id: CHANNELS.HEARTBEAT_ALERT,
      name: 'Connection Alerts',
      importance: AndroidImportance.DEFAULT,
      badge: false,
    },
  ];

  // Only create if missing to avoid unnecessary overhead
  for (const channel of channelsToCreate) {
    if (!existingIds.includes(channel.id)) {
      await notifee.createChannel(channel);
    }
  }
}
