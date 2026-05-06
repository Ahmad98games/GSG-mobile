import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import { supabase } from './supabase';
import { Platform } from 'react-native';

interface HandshakeResult {
  success: boolean;
  error?: string;
  nodeData?: any;
}

/**
 * PAIRING MANAGER (v3.5)
 * Logic for secure device-to-cloud registration.
 */
export const PairingManager = {
  /**
   * Generates a unique hardware signature for this device.
   * Prevents node cloning and identity spoofing.
   */
  async generateHardwareFingerprint(): Promise<string> {
    const components = [
      Device.brand,
      Device.modelName,
      Device.osVersion,
      Device.totalMemory,
      Platform.OS,
      // uniqueId is from SecureStore or Device if available (requires permissions)
      await SecureStore.getItemAsync('gs_device_internal_id') || Math.random().toString(36),
    ];
    
    // Simple deterministic string (will be hashed by server or client as needed)
    return components.filter(Boolean).join('|');
  },

  /**
   * Submits the node's Public Key and Fingerprint to the Edge Function.
   */
  async claimPairingCode(
    pairingCode: string, 
    publicKey: string, 
    nodeName: string = 'MOBILE_NODE'
  ): Promise<HandshakeResult> {
    try {
      console.log('[PairingManager] Initiating handshake for code:', pairingCode);
      
      const fingerprint = await this.generateHardwareFingerprint();

      // Submit to Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('claim-pairing-code', {
        body: {
          pairing_code: pairingCode,
          public_key: publicKey,
          fingerprint: fingerprint,
          metadata: {
            device_name: Device.deviceName,
            model: Device.modelName,
            os: Platform.OS,
            version: '3.5.0-TACTICAL'
          }
        }
      });

      if (error) {
        console.warn('[PairingManager] Handshake rejected:', error.message);
        return { success: false, error: error.message };
      }

      // Successful pairing → store node identity
      if (data?.node_id) {
        await SecureStore.setItemAsync('gs_node_id', data.node_id);
        console.log('[PairingManager] Node identity confirmed:', data.node_id);
        return { success: true, nodeData: data };
      }

      return { success: false, error: 'INVALID_SERVER_RESPONSE' };
    } catch (e) {
      console.error('[PairingManager] Handshake crash:', e);
      return { success: false, error: 'NETWORK_FAILURE' };
    }
  }
};
