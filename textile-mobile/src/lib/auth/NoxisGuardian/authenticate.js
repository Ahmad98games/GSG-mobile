/**
 * NOXIS INDUSTRIAL OS - GUARDIAN BIOMETRIC AUTH
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import { Platform } from 'react-native';

export default () => {
  return new Promise((_, reject) => {
    reject(new Error(`react-native-fingerprint-scanner is not available for ${Platform.OS}`))
  });
}

