/**
 * NOXIS INDUSTRIAL OS - SENTINEL INTELLIGENCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
/*
 * Copyright (c) 2016-present Invertase Limited
 */

import NotifeeApiModule from './NotifeeApiModule';
import type { ModuleStatics, ModuleWithStatics } from './types/Module';
import { version as SDK_VERSION } from './version';
import {
  isIOS,
  kReactNativeNotifeeNotificationBackgroundEvent,
  kReactNativeNotifeeNotificationEvent,
} from './utils';

const apiModule = new NotifeeApiModule({
  version: SDK_VERSION,
  nativeModuleName: 'NotifeeApiModule',
  nativeEvents: isIOS
    ? [kReactNativeNotifeeNotificationEvent, kReactNativeNotifeeNotificationBackgroundEvent]
    : [kReactNativeNotifeeNotificationEvent],
});

const statics: ModuleStatics = {
  SDK_VERSION,
};

const defaultExports: ModuleWithStatics = Object.assign(apiModule, statics);
export default defaultExports;

export * from './types/Library';
export * from './types/Notification';
export * from './types/Trigger';
export * from './types/NotificationIOS';
export * from './types/NotificationAndroid';

