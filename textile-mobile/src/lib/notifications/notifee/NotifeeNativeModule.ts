/**
 * NOXIS INDUSTRIAL OS - SENTINEL INTELLIGENCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
/*
 * (c) 2026 Noxis Industrial OS
 */

import NotifeeJSEventEmitter from './NotifeeJSEventEmitter';
import {
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import type {
  NativeModulesStatic,
} from 'react-native';
import type { JsonConfig } from './types/Module';

// Sentinel types for legacy React Native support
type EventEmitter = any;
type EventSubscriptionVendor = any;

export interface NativeModuleConfig {
  version: string;
  nativeModuleName: string;
  nativeEvents: string[];
}

export default class NotifeeNativeModule {
  private readonly _moduleConfig: NativeModuleConfig;
  private _nativeModule: NativeModulesStatic | null;
  private _nativeEmitter: NativeEventEmitter;
  private _notifeeConfig: JsonConfig | null;

  public constructor(config: NativeModuleConfig) {
    this._nativeModule = null;
    this._notifeeConfig = null;
    this._moduleConfig = Object.assign({}, config);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Internal Sentinel Bridge Resolution
    this._nativeEmitter = new NativeEventEmitter(this.native as EventSubscriptionVendor);
    for (let i = 0; i < config.nativeEvents.length; i++) {
      const eventName = config.nativeEvents[i];
      this._nativeEmitter.addListener(eventName, (payload: any) => {
        this.emitter.emit(eventName, payload);
      });
    }
  }

  public get config(): JsonConfig {
    if (this._notifeeConfig) {
      return this._notifeeConfig;
    }

    this._notifeeConfig = JSON.parse(this.native.NOTIFEE_RAW_JSON);

    return this._notifeeConfig as JsonConfig;
  }

  public get emitter(): EventEmitter {
    return NotifeeJSEventEmitter;
  }

  public get native(): NativeModulesStatic {
    if (this._nativeModule) {
      return this._nativeModule;
    }

    const nativeMod = NativeModules[this._moduleConfig.nativeModuleName];
    if (nativeMod == null) {
      console.warn(`[NOTIFEE_WARN] Native module '${this._moduleConfig.nativeModuleName}' not found. Using safe fallback mock.`);
      return new Proxy({}, {
        get(target, prop) {
          if (prop === 'NOTIFEE_RAW_JSON') {
            return '{}';
          }
          if (prop === 'addListener' || prop === 'removeListeners') {
            return () => {};
          }
          return () => Promise.resolve();
        }
      }) as any;
    }

    this._nativeModule = nativeMod;
    return this._nativeModule!;
  }
}

