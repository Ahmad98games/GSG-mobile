import * as LocalAuthentication from 'expo-local-authentication';
import * as Crypto from 'expo-crypto';
import * as Device from 'expo-device';
import * as Application from 'expo-application';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/AuthStore';

/**
 * SOVEREIGN SECURITY ENGINE (v2.0)
 * Hardware-backed biometric and fingerprinting protocols.
 */

export const Security = {
  /**
   * Biometric Authentication Wrapper
   */
  async authenticateBiometric(): Promise<boolean> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      console.warn('Biometrics not available or not enrolled');
      return false;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Sovereign Node Auth Required',
      fallbackLabel: 'Enter Passcode',
      disableDeviceFallback: false,
    });

    if (result.success) {
      useAuthStore.getState().setBiometricStatus(true);
      return true;
    }

    return false;
  },

  /**
   * SHA-256 Device Fingerprinting
   * Formula: SHA-256(deviceName + osVersion + installationId)
   */
  async getDeviceFingerprint(): Promise<string> {
    const deviceName = Device.deviceName || 'unknown';
    const osVersion = Device.osVersion || 'unknown';
    const installId = (await Application.getAndroidId()) || 'unknown'; // Android ID as installation source

    const rawId = `${deviceName}:${osVersion}:${installId}`;
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      rawId
    );

    return digest;
  },

  /**
   * Critical Lockout: Clear all secure data
   */
  async criticalLockout(): Promise<void> {
    await useAuthStore.getState().clearAuth();
    await SecureStore.deleteItemAsync('device_fingerprint'); // Total wipe
    console.error('CRITICAL_LOCKOUT_TRIGGERED: All node data purged.');
  }
};
