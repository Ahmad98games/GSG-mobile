/**
 * NOXIS INDUSTRIAL OS - ZEROCONF MOCK FOR WEB
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 */

import EventEmitter from 'eventemitter3';

export default class ZeroconfMock extends EventEmitter {
  scan(type?: string, protocol?: string, domain?: string) {
    console.log(`[ZeroconfMock] Scan initiated for type: ${type}, protocol: ${protocol}, domain: ${domain}`);
  }
  stop() {
    console.log('[ZeroconfMock] Scan stopped');
  }
  destroy() {
    console.log('[ZeroconfMock] Scan destroyed');
  }
}
