import notifee, { AndroidImportance, AndroidColor } from './notifee';
import { Platform } from 'react-native';

/**
 * NOTIFICATION CHANNEL IDs
 * Fixed constants for high-integrity alert routing.
 */
export const CHANNELS = {
  SENTINEL_BREACH: 'sentinel_breach',
  LOW_STOCK: 'low_stock',
  DEAD_STOCK: 'dead_stock',
  AUDIT_REMINDER: 'audit_reminder',
  STAFF_ACTION: 'staff_action',
  PAYMENT_RECEIVED: 'payment_received',
  TACTICAL_MESSAGE: 'tactical_message',
  SYSTEM_LOCK: 'system_lock',
  HEARTBEAT_ALERT: 'heartbeat_alert',
  NOXIS_ALERTS: 'noxis_alerts',
  PAYMENT_DUE: 'payment_due',
  PRODUCTION_ALERT: 'production_alert',
  NOXIS_GENERAL: 'noxis_general',
  NOXIS_LOW_STOCK: 'noxis_low_stock',
  NOXIS_PAYMENT_DUE: 'noxis_payment_due',
  NOXIS_PRODUCTION: 'noxis_production',
  NOXIS_AUDIT: 'noxis_audit',
  NOXIS_STAFF: 'noxis_staff',
} as const;

/**
 * CREATE ALL CHANNELS
 * Creates the required channels on Android for Noxis.
 */
export async function createAllChannels() {
  if (Platform.OS !== 'android') return;

  const channelsToCreate = [
    {
      id: 'noxis_general',
      name: 'Noxis General',
      importance: AndroidImportance.HIGH,
      vibration: true,
      badge: true,
    },
    {
      id: 'noxis_low_stock',
      name: 'Noxis Stock Alerts',
      importance: AndroidImportance.DEFAULT,
      vibration: true,
      badge: true,
    },
    {
      id: 'noxis_payment_due',
      name: 'Noxis Payment Reminders',
      importance: AndroidImportance.DEFAULT,
      vibration: true,
      badge: true,
    },
    {
      id: 'noxis_production',
      name: 'Noxis Production Alerts',
      importance: AndroidImportance.HIGH,
      vibration: true,
      badge: true,
    },
    {
      id: 'noxis_audit',
      name: 'Noxis Compliance Reminders',
      importance: AndroidImportance.HIGH,
      vibration: true,
      badge: true,
    },
    {
      id: 'noxis_staff',
      name: 'Noxis Staff Operations',
      importance: AndroidImportance.DEFAULT,
      vibration: true,
      badge: true,
    },
    {
      id: CHANNELS.NOXIS_ALERTS,
      name: 'Noxis Alerts',
      importance: AndroidImportance.HIGH,
      vibration: true,
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
      id: CHANNELS.PAYMENT_DUE,
      name: 'Payment Reminders',
      importance: AndroidImportance.DEFAULT,
      vibration: true,
      badge: true,
    },
    {
      id: CHANNELS.PRODUCTION_ALERT,
      name: 'Production Alerts',
      importance: AndroidImportance.HIGH,
      vibration: true,
      badge: true,
    },
    {
      id: CHANNELS.AUDIT_REMINDER,
      name: 'Compliance Reminders',
      importance: AndroidImportance.HIGH,
      vibration: true,
      badge: true,
    },
    {
      id: CHANNELS.STAFF_ACTION,
      name: 'Staff Operations',
      importance: AndroidImportance.DEFAULT,
      vibration: true,
      badge: true,
    },
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
      id: CHANNELS.DEAD_STOCK,
      name: 'Inventory Hygiene',
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

  for (const channel of channelsToCreate) {
    await notifee.createChannel(channel);
  }
}

/**
 * REGISTER NOTIFICATION CHANNELS
 * Compatibility wrapper calling createAllChannels.
 */
export async function registerChannels() {
  await createAllChannels();
}

