import notifee, { EventType } from './notifee';
import { openMeshDb } from '../db/meshDb';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * NOTIFEE HEADLESS TASK
 * Industrial-grade background event handling for mission-critical alerts.
 */
notifee.onBackgroundEvent(async ({ type, detail }) => {
  const { notification, pressAction } = detail;

  if (type === EventType.ACTION_PRESS) {
    if (pressAction?.id === 'ack_breach') {
      // User acknowledged breach from notification shade
      // 1. Cancel the ongoing notification
      if (notification?.id) {
        await notifee.cancelNotification(notification.id);
        
        // 2. Write acknowledgement to notification_log
        try {
          const db = await openMeshDb();
          // EXCEPTION: ack update on notification_log only (append-only bypass for status)
          await db.runAsync(
            "UPDATE notification_log SET acknowledged_at = datetime('now') WHERE notifee_id = ?",
            [notification.id]
          );
        } catch (e) {
          console.error('[HeadlessTask] SQL_ACK_FAULT:', e);
        }

        // 3. Emit event to NspService via AsyncStorage flag
        // Headless tasks cannot access Zustand, so we use a persistent flag.
        await AsyncStorage.setItem('pending_breach_ack', JSON.stringify({
          notificationId: notification.id,
          timestamp: Date.now(),
        }));
      }
    }

    if (pressAction?.id === 'open_messenger') {
      // Just cancel badge — navigation handled by press action launchActivity
      await notifee.setBadgeCount(0);
    }
  }

  if (type === EventType.DISMISSED) {
    // Log dismissal to notification_log acknowledged_at for non-ongoing
    if (notification?.id) {
      try {
        const db = await openMeshDb();
        await db.runAsync(
          "UPDATE notification_log SET acknowledged_at = datetime('now') WHERE notifee_id = ?",
          [notification.id]
        );
      } catch (e) {
        console.error('[HeadlessTask] DISMISS_LOG_FAULT:', e);
      }
    }
  }
});
