/**
 * NOXIS INDUSTRIAL OS - SYNAPSE PROTOCOL TYPES
 * Proprietary types for the hardened mesh networking stack.
 */

export enum PacketType {
  CONNECT = 0,
  DISCONNECT = 1,
  EVENT = 2,
  ACK = 3,
  CONNECT_ERROR = 4,
  BINARY_EVENT = 5,
  BINARY_ACK = 6,
}

export interface Packet {
  type: PacketType;
  nsp: string;
  data?: any;
  id?: number;
  attachments?: number;
}

export interface SocketOptions {
  auth?: { [key: string]: any } | ((cb: (data: object) => void) => void);
  path?: string;
  autoConnect?: boolean;
  forceNew?: boolean;
  multiplex?: boolean;
  [key: string]: any;
}

export interface Flags {
  volatile?: boolean;
  compress?: boolean;
  [key: string]: any;
}
