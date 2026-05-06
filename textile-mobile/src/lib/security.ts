import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as Crypto from 'expo-crypto';
import Constants from 'expo-constants';

/**
 * Enterprise Security Protocol: Hardware-Backed Identity
 * This module handles device identity and sensitive token storage.
 */

const KEYS = {
  SUPABASE_ACCESS_TOKEN: 'supabase_access_token',
  SUPABASE_REFRESH_TOKEN: 'supabase_refresh_token',
  NODE_ID: 'node_id',
  NODE_ROLE: 'node_role',
  USER_ID: 'user_id',
  DEVICE_FINGERPRINT: 'device_fingerprint',
  AUTH_PIN: 'auth_pin',
} as const;

export type NodeRole = 'INWARD_DOCK' | 'DISPATCH_BAY' | 'PRODUCTION_FLOOR' | 'MANAGER_ROVING';

export class Security {
  /**
   * Generate a unique device fingerprint for node validation
   * Fingerprint = SHA-256(deviceName + osVersion + installationId)
   */
  static async generateFingerprint(): Promise<string> {
    const cached = await SecureStore.getItemAsync(KEYS.DEVICE_FINGERPRINT);
    if (cached) return cached;

    const deviceName = Device.deviceName || 'unknown_device';
    const osVersion = Device.osVersion || 'unknown_os';
    const installId = Constants.installationId || 'unknown_install';
    
    const raw = `${deviceName}|${osVersion}|${installId}`;
    const fingerprint = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      raw
    );

    await SecureStore.setItemAsync(KEYS.DEVICE_FINGERPRINT, fingerprint);
    return fingerprint;
  }

  static async saveAuth(data: { 
    access_token: string; 
    refresh_token: string; 
    node_id: string; 
    role: NodeRole 
  }) {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.SUPABASE_ACCESS_TOKEN, data.access_token),
      SecureStore.setItemAsync(KEYS.SUPABASE_REFRESH_TOKEN, data.refresh_token),
      SecureStore.setItemAsync(KEYS.NODE_ID, data.node_id),
      SecureStore.setItemAsync(KEYS.NODE_ROLE, data.role),
    ]);
  }

  static async getRole(): Promise<NodeRole | null> {
    return (await SecureStore.getItemAsync(KEYS.NODE_ROLE)) as NodeRole | null;
  }

  static async clearAuth() {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.SUPABASE_ACCESS_TOKEN),
      SecureStore.deleteItemAsync(KEYS.SUPABASE_REFRESH_TOKEN),
      SecureStore.deleteItemAsync(KEYS.NODE_ID),
      SecureStore.deleteItemAsync(KEYS.NODE_ROLE),
    ]);
  }

  static async getFingerprintHeader() {
    const fp = await this.generateFingerprint();
    return { 'X-Device-Fingerprint': fp };
  }
}
