/**
 * NOXIS INDUSTRIAL OS - GUARDIAN BIOMETRIC AUTH
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import authenticate from './authenticate';
import isSensorAvailable from './isSensorAvailable';
import release from './release';

const FingerprintScanner = {
  authenticate,
  isSensorAvailable,
  release,
};

export default FingerprintScanner;
