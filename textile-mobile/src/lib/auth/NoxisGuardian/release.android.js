/**
 * NOXIS INDUSTRIAL OS - GUARDIAN BIOMETRIC AUTH
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import { DeviceEventEmitter, NativeModules, Platform } from 'react-native';

const { ReactNativeFingerprintScanner } = NativeModules;

export default () => {
  if (Platform.Version < 23) {
    DeviceEventEmitter.removeAllListeners('FINGERPRINT_SCANNER_AUTHENTICATION');
  }

  ReactNativeFingerprintScanner.release();
}

