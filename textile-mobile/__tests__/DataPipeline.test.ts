// @ts-ignore
import { describe, test, expect } from '@jest/globals';
import { ProtobufService } from '../src/services/ProtobufService';
import { MobileCrypto } from '../src/lib/MobileCrypto';

describe('Omnora Data Pipeline', () => {
  const MOCK_KEY = 'industrial-mesh-key-7447';
  const MOCK_NODE = 'node-001';

  test('Step 1 & 2: Serialize and Encrypt', async () => {
    const scanData = { nodeId: MOCK_NODE, barcode: 'BATCH-A1', timestamp: Date.now() };
    const proto = ProtobufService.encode(MOCK_NODE, 'scan', scanData);
    
    expect(proto).toBeInstanceOf(Uint8Array);
    
    const encrypted = await MobileCrypto.encrypt(proto, MOCK_KEY);
    expect(encrypted.length).toBeGreaterThan(proto.length);
    
    const decrypted = await MobileCrypto.decrypt(encrypted, MOCK_KEY);
    expect(decrypted).toEqual(proto);
  });

  test('Protobuf Envelope Integrity', () => {
    const scanData = { nodeId: MOCK_NODE, barcode: 'INTEGRITY-01', timestamp: Date.now() };
    const buffer = ProtobufService.encode(MOCK_NODE, 'scan', scanData);
    const decoded = ProtobufService.decode(buffer);
    
    expect(decoded.nodeId).toBe(MOCK_NODE);
    expect(decoded.scan.barcode).toBe('INTEGRITY-01');
  });
});
