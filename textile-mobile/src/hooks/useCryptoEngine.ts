import { useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
// @ts-ignore - QuickCrypto uses JSI and follows Node.js Crypto API
import QuickCrypto from 'react-native-quick-crypto';

const PRIVATE_KEY_STORAGE_KEY = 'gs_tactical_private_key';
const PUBLIC_KEY_STORAGE_KEY = 'gs_tactical_public_key';

/**
 * TACTICAL CRYPTO ENGINE (v3.5)
 * Principal Security Engineer Protocol: Native RSA-OAEP Generation.
 * 
 * Cryptographic Choices:
 * - RSA-OAEP: Optimal Asymmetric Encryption Padding (OAEP) is preferred 
 *   over PKCS#1 v1.5 as it provides proven security against chosen-ciphertext 
 *   attacks by incorporating MGF1 mask generation and random seeds.
 * - Key Size: 2048-bit (Industrial Standard for Mobile Handshakes).
 */

export const useCryptoEngine = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generates a native RSA Key Pair.
   * Private key is stored in SecureStore (Keychain/Keystore).
   * Public key is returned for server registration.
   */
  const generateTacticalKeyPair = useCallback(async () => {
    setIsGenerating(true);
    try {
      console.log('[CryptoEngine] Initiating native RSA-OAEP generation...');

      // Generate Key Pair (Managed natively via QuickCrypto JSI)
      const { publicKey, privateKey } = QuickCrypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
          type: 'spki', // Simple Public Key Infrastructure (standard for public keys)
          format: 'pem',
        },
        privateKeyEncoding: {
          type: 'pkcs8', // PKCS#8 is the standard for private keys
          format: 'pem',
        },
      });

      // Persist Private Key in hardware-backed storage
      await SecureStore.setItemAsync(PRIVATE_KEY_STORAGE_KEY, privateKey as string, {
        keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
      });

      // Persist Public Key (for local reference/display)
      await SecureStore.setItemAsync(PUBLIC_KEY_STORAGE_KEY, publicKey as string);

      console.log('[CryptoEngine] RSA-OAEP Keys Deployed & Secured.');
      return publicKey as string;
    } catch (error) {
      console.error('[CryptoEngine] RSA Generation Failure:', error);
      throw new Error('KEY_GEN_FAILED');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Clears tactical keys (Used for decommissioning nodes)
   */
  const decommissionKeys = useCallback(async () => {
    await Promise.all([
      SecureStore.deleteItemAsync(PRIVATE_KEY_STORAGE_KEY),
      SecureStore.deleteItemAsync(PUBLIC_KEY_STORAGE_KEY),
    ]);
  }, []);

  const getStoredPublicKey = useCallback(async () => {
    return await SecureStore.getItemAsync(PUBLIC_KEY_STORAGE_KEY);
  }, []);

  return {
    generateTacticalKeyPair,
    getStoredPublicKey,
    decommissionKeys,
    isGenerating,
  };
};
