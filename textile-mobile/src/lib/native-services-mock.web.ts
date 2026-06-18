/**
 * NOXIS INDUSTRIAL OS - NATIVE NETWORK SERVICES MOCK FOR WEB
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 */

import EventEmitter from 'eventemitter3';

// 1. Zeroconf Mock
export class ZeroconfMock extends EventEmitter {
  scan = (type?: string, protocol?: string, domain?: string) => {
    // No-op scan on web
  };
  stop = () => {};
  destroy = () => {};
}

// 2. TCP Socket Mock
export class SocketMock extends EventEmitter {
  connect = (options: any, callback?: () => void) => {
    if (callback) setTimeout(callback, 50);
    return this;
  };
  write = (data: any, encoding?: string, callback?: () => void) => {
    if (callback) setTimeout(callback, 10);
    return true;
  };
  destroy = () => {};
  end = () => {};
  setTimeout = (timeout: number, callback?: () => void) => {};
  setKeepAlive = (enable?: boolean, initialDelay?: number) => {};
  setNoDelay = (noDelay?: boolean) => {};
}

export const createConnection = (options: any, callback?: () => void) => {
  const socket = new SocketMock();
  socket.connect(options, callback);
  return socket;
};

// Default export covers both or individual requirements
const NativeServicesMock = {
  Zeroconf: ZeroconfMock,
  Socket: SocketMock,
  createConnection,
};

export default NativeServicesMock;
