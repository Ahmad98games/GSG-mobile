/**
 * NOXIS INDUSTRIAL OS - SENTINEL INTELLIGENCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 *
 * Web-compatible mock for Notifee.
 */

import { version as SDK_VERSION } from './version';

const notifeeMock = {
  SDK_VERSION,
  getTriggerNotificationIds: () => Promise.resolve([]),
  getTriggerNotifications: () => Promise.resolve([]),
  getDisplayedNotifications: () => Promise.resolve([]),
  isChannelBlocked: () => Promise.resolve(false),
  isChannelCreated: () => Promise.resolve(true),
  cancelAllNotifications: () => Promise.resolve(),
  cancelDisplayedNotifications: () => Promise.resolve(),
  cancelTriggerNotifications: () => Promise.resolve(),
  cancelNotification: () => Promise.resolve(),
  cancelDisplayedNotification: () => Promise.resolve(),
  cancelTriggerNotification: () => Promise.resolve(),
  createChannel: (channel: any) => Promise.resolve(channel.id),
  createChannels: () => Promise.resolve(),
  createChannelGroup: (group: any) => Promise.resolve(group.id),
  createChannelGroups: () => Promise.resolve(),
  deleteChannel: () => Promise.resolve(),
  deleteChannelGroup: () => Promise.resolve(),
  displayNotification: (notification: any) => Promise.resolve(notification.id || 'mock-id'),
  createTriggerNotification: (notification: any) => Promise.resolve(notification.id || 'mock-id'),
  getChannel: () => Promise.resolve(null),
  getChannels: () => Promise.resolve([]),
  getChannelGroup: () => Promise.resolve(null),
  getChannelGroups: () => Promise.resolve([]),
  getInitialNotification: () => Promise.resolve(null),
  onBackgroundEvent: () => {},
  onForegroundEvent: () => () => {},
  openNotificationSettings: () => Promise.resolve(),
  requestPermission: () => Promise.resolve({
    alert: 1,
    badge: 1,
    criticalAlert: 1,
    showPreviews: 1,
    sound: 1,
    carPlay: 1,
    lockScreen: 1,
    announcement: 1,
    notificationCenter: 1,
    inAppNotificationSettings: 1,
    authorizationStatus: 1,
  }),
  registerForegroundService: () => {},
  setNotificationCategories: () => Promise.resolve(),
  getNotificationCategories: () => Promise.resolve([]),
  getNotificationSettings: () => Promise.resolve({
    alert: 1,
    badge: 1,
    criticalAlert: 1,
    showPreviews: 1,
    sound: 1,
    carPlay: 1,
    lockScreen: 1,
    announcement: 1,
    notificationCenter: 1,
    inAppNotificationSettings: 1,
    authorizationStatus: 1,
  }),
  getBadgeCount: () => Promise.resolve(0),
  setBadgeCount: () => Promise.resolve(),
  incrementBadgeCount: () => Promise.resolve(),
  decrementBadgeCount: () => Promise.resolve(),
  isBatteryOptimizationEnabled: () => Promise.resolve(false),
  openBatteryOptimizationSettings: () => Promise.resolve(),
  getPowerManagerInfo: () => Promise.resolve({
    manufacturer: 'apple',
    activity: null,
  }),
  openPowerManagerSettings: () => Promise.resolve(),
  stopForegroundService: () => Promise.resolve(),
  hideNotificationDrawer: () => {},
};

export default notifeeMock;

export * from './types/Library';
export * from './types/Notification';
export * from './types/Trigger';
export * from './types/NotificationIOS';
export * from './types/NotificationAndroid';
