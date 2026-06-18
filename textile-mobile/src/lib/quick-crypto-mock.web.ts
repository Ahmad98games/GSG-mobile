/**
 * NOXIS INDUSTRIAL OS - QUICK CRYPTO MOCK FOR WEB
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 */

import { Buffer } from '@craftzdog/react-native-buffer';

export const randomBytes = (size: number) => {
  const buf = Buffer.alloc(size);
  for (let i = 0; i < size; i++) {
    buf[i] = Math.floor(Math.random() * 256);
  }
  return buf;
};

export const createHash = (algorithm: string) => {
  return {
    update: (data: any) => ({
      digest: () => Buffer.from('mock-hash-digest-hex-value-sha256-signature-here'),
    }),
  };
};

export const createCipheriv = (algorithm: string, key: any, iv: any) => {
  return {
    update: (data: any) => Buffer.from(data),
    final: () => Buffer.alloc(0),
    getAuthTag: () => Buffer.alloc(16),
  };
};

export const createDecipheriv = (algorithm: string, key: any, iv: any) => {
  return {
    update: (data: any) => Buffer.from(data),
    final: () => Buffer.alloc(0),
    setAuthTag: (tag: any) => {},
  };
};

export const timingSafeEqual = (a: any, b: any) => {
  const bufA = Buffer.isBuffer(a) ? a : Buffer.from(a);
  const bufB = Buffer.isBuffer(b) ? b : Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  let result = 0;
  for (let i = 0; i < bufA.length; i++) {
    result |= bufA[i] ^ bufB[i];
  }
  return result === 0;
};

const QuickCrypto = {
  randomBytes,
  createHash,
  createCipheriv,
  createDecipheriv,
  timingSafeEqual,
};

export default QuickCrypto;
