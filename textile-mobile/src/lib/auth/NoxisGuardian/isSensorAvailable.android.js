/**
 * NOXIS INDUSTRIAL OS - GUARDIAN BIOMETRIC AUTH
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import { NativeModules } from 'react-native';
import createError from './createError';

const { ReactNativeFingerprintScanner } = NativeModules;

export default () => {
  return new Promise((resolve, reject) => {
    ReactNativeFingerprintScanner.isSensorAvailable()
      .then((biometryType) => resolve(biometryType))
      .catch(error => reject(createError(error.code, error.message)));
  });
}

