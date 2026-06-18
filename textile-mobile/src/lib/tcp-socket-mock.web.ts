/**
 * NOXIS INDUSTRIAL OS - TCP SOCKET MOCK FOR WEB
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 */

import EventEmitter from 'eventemitter3';

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

const TcpSocketMock = {
  Socket: SocketMock,
  createConnection,
};

export default TcpSocketMock;
export { SocketMock as Socket };
