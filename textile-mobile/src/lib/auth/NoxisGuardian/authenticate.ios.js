/**
 * NOXIS INDUSTRIAL OS - GUARDIAN BIOMETRIC AUTH
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import { NativeModules } from 'react-native';
import createError from './createError';

const { ReactNativeFingerprintScanner } = NativeModules;

export default ({ description = ' ', fallbackEnabled = true }) => {
  return new Promise((resolve, reject) => {
    ReactNativeFingerprintScanner.authenticate(description, fallbackEnabled, error => {
      if (error) {
        return reject(createError(error.code, error.message))
      }

      return resolve(true);
    });
  });
}

