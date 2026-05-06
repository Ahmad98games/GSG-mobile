import { Buffer } from '@craftzdog/react-native-buffer';

/**
 * Gold She Mesh — Tactical Communication Protocol v1.0
 * Shared between textile-admin (PC Hub) and textile-mobile (Node Devices)
 */

export const MESH_VERSION = '1.0.0';
export const HUB_PORT = 7447;
export const MESH_WS_PATH = '/mesh';

export type DeviceType = 'hub_pc' | 'node_mobile';

export interface DeviceIdentity {
  deviceId: string;
  deviceName: string;
  deviceType: DeviceType;
  ecdhPublicKey: string;
  registeredAt: number;
  lastSeen: number;
  isOnline: boolean;
}

export interface PairingCodePayload {
  code: string;
  hubIp: string;
  hubPort: number;
  hubDeviceId: string;
  expiresAt: number;
}

export interface TextMessagePayload {
  msgId: string;
  conversationId: string;
  text: string;
}

export interface PhotoMessagePayload {
  msgId: string;
  conversationId: string;
  fileId?: string;
  caption?: string;
  thumbnailBase64: string;
}

export interface VoiceNotePayload {
  msgId: string;
  conversationId: string;
  fileId?: string;
  durationMs: number;
  waveform: number[];
}

export interface FileManifestPayload {
  fileId: string;
  fileName: string;
  totalBytes: number;
}

export interface TypingIndicatorPayload {
  conversationId: string;
  deviceName: string;
  isTyping: boolean;
}

export interface PresencePayload {
  deviceId: string;
  status: 'online' | 'offline';
  lastSeen: number;
}

/** RFC 4122 UUID v4 — works in Node.js and React Native (Hermes) */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Build a conversation ID for a direct message pair (order-independent) */
export function dmConversationId(deviceA: string, deviceB: string): string {
  return [deviceA, deviceB].sort().join(':');
}

/** Parse a pairing QR payload string back into PairingCodePayload */
export function decodePairingQR(qrString: string): PairingCodePayload {
  const decoded = Buffer.from(qrString, 'base64').toString('utf8');
  return JSON.parse(decoded) as PairingCodePayload;
}

/** Encode a PairingCodePayload for QR display */
export function encodePairingQR(payload: PairingCodePayload): string {
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}
