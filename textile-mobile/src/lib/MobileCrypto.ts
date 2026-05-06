import * as SecureStore from 'expo-secure-store';
import QuickCrypto from 'react-native-quick-crypto';
import { Buffer } from '@craftzdog/react-native-buffer';
import { useDiagnosticStore } from '../store/DiagnosticsStore';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

/**
 * PRODUCTION-GRADE MOBILE CRYPTO SERVICE
 * Implements AES-256-GCM with secure storage and forensic latency tracking.
 */
export const MobileCrypto = {
  /**
   * Generates a random session key or ECDH shared secret.
   */
  generateKey(): string {
    return QuickCrypto.randomBytes(32).toString('hex');
  },

  /**
   * SENSITIVE: Stores the mesh key in SecureStore.
   */
  async setMeshKey(key: string): Promise<void> {
    await SecureStore.setItemAsync('gs_mesh_key', key);
  },

  /**
   * SENSITIVE: Retrieves the mesh key from SecureStore.
   */
  async getMeshKey(): Promise<string | null> {
    return await SecureStore.getItemAsync('gs_mesh_key');
  },

  /**
   * AES-256-GCM Encryption
   * Format: IV(12) + Ciphertext + AuthTag(16)
   */
  async encrypt(data: Uint8Array | string, key: string): Promise<Uint8Array> {
    const startTime = Date.now();
    try {
      const hashedKey = QuickCrypto.createHash('sha256').update(key).digest();
      const iv = QuickCrypto.randomBytes(IV_LENGTH);
      
      const cipher = QuickCrypto.createCipheriv(ALGORITHM, hashedKey as any, iv as any);
      const input = typeof data === 'string' ? Buffer.from(data, 'utf8') : Buffer.from(data);
      
      const encrypted = Buffer.concat([
        cipher.update(input as any),
        cipher.final()
      ]);
      
      const authTag = cipher.getAuthTag();
      const result = Buffer.concat([iv as any, encrypted as any, authTag as any]);

      // Push latency metric to store
      const latency = Date.now() - startTime;
      useDiagnosticStore.getState().addEncLatency(latency);

      return new Uint8Array(result);
    } catch (error) {
      console.error('[Crypto] Encryption Failure:', error);
      throw error;
    }
  },

  /**
   * AES-256-GCM Decryption
   */
  async decrypt(data: Uint8Array | Buffer, key: string): Promise<Uint8Array> {
    try {
      const buffer = Buffer.from(data);
      const hashedKey = QuickCrypto.createHash('sha256').update(key).digest();
      
      const iv = buffer.subarray(0, IV_LENGTH);
      const authTag = buffer.subarray(buffer.length - AUTH_TAG_LENGTH);
      const ciphertext = buffer.subarray(IV_LENGTH, buffer.length - AUTH_TAG_LENGTH);

      const decipher = QuickCrypto.createDecipheriv(ALGORITHM, hashedKey as any, iv as any);
      decipher.setAuthTag(Buffer.from(authTag) as any);
      
      const decrypted = Buffer.concat([
        decipher.update(ciphertext as any),
        decipher.final()
      ]);

      return new Uint8Array(decrypted);
    } catch (error) {
      console.error('[Crypto] Decryption Failure:', error);
      throw error;
    }
  },
  /**
   * Timing-safe comparison for cryptographic keys and tokens.
   */
  timingSafeEqual(a: string | Buffer, b: string | Buffer): boolean {
    const bufA = typeof a === 'string' ? Buffer.from(a) : a;
    const bufB = typeof b === 'string' ? Buffer.from(b) : b;
    
    if (bufA.length !== bufB.length) return false;
    return QuickCrypto.timingSafeEqual(bufA as any, bufB as any);
  },
};
