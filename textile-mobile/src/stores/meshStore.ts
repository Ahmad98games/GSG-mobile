/**
 * ══════════════════════════════════════════════════════════
 * FILE LOCATION:  src/stores/meshStore.ts
 * ACTION:         NEW — create this file
 * ══════════════════════════════════════════════════════════
 *
 * Gold She Mesh — Zustand Store
 *
 * Central reactive state for everything mesh-related.
 * Components subscribe to slices — only re-render on changes they care about.
 *
 * Covers:
 *   - Connection state + hub URL
 *   - Device list (online/offline)
 *   - Per-conversation message arrays (decrypted at display time)
 *   - Unread counts
 *   - Active file transfers progress
 *   - Pairing flow state
 */

import { create } from 'zustand';
import type { DeviceIdentity } from '@/lib/mesh/mesh-protocol';
import type { ConnState } from '@/lib/mesh/mesh-client';

// ─── Message shape for UI display ─────────────────────────────

export type UIMsgType = 'text' | 'photo' | 'voice' | 'system';
export type UIMsgStatus = 'sending' | 'delivered' | 'read' | 'failed' | 'queued';

export interface UIMessage {
  id:               string;
  from:             string;
  fromName:         string;
  type:             UIMsgType;
  text?:            string;
  thumbnailBase64?: string;
  photoCaption?:    string;
  durationMs?:      number;
  waveform?:        number[];
  fileId?:          string;
  fileName?:        string;
  transferProgress?: number;   // 0..1
  ts:               number;
  isMine:           boolean;
  status:           UIMsgStatus;
  conversationId:   string;
}

// ─── Store shape ──────────────────────────────────────────────

interface MeshState {
  // Connection
  connState:   ConnState;
  hubUrl:      string;
  selfId:      string;
  selfName:    string;
  isConnected: boolean;

  // Devices
  devices:     DeviceIdentity[];

  // Messages: conversationId → UIMessage[]
  messages:    Record<string, UIMessage[]>;

  // Unread counts: conversationId → number
  unreadCounts: Record<string, number>;

  // File transfers: fileId → progress 0..1
  fileProgress: Record<string, number>;

  // Typing status: conversationId → deviceName (null if none)
  typingStatus: Record<string, string | null>;

  // Pairing flow
  isPairing:   boolean;
  pairError:   string | null;

  // ── Actions ───────────────────────────────────────────────
  setConnState:   (s: ConnState) => void;
  setHubUrl:      (url: string) => void;
  setSelfId:      (id: string) => void;
  setSelfName:    (name: string) => void;

  setDevices:     (devices: DeviceIdentity[]) => void;
  upsertDevice:   (device: DeviceIdentity) => void;
  setDeviceOnline:(deviceId: string, online: boolean) => void;

  addMessage:     (msg: UIMessage) => void;
  updateMsgStatus:(convId: string, msgId: string, status: UIMsgStatus) => void;
  setMessages:    (convId: string, msgs: UIMessage[]) => void;
  clearConversation:(convId: string) => void;

  incrementUnread:(convId: string) => void;
  clearUnread:    (convId: string) => void;

  setFileProgress:(fileId: string, progress: number) => void;
  clearFileProgress:(fileId: string) => void;

  setTyping:      (convId: string, deviceName: string | null) => void;

  setPairing:     (val: boolean) => void;
  setPairError:   (err: string | null) => void;
}

// ─────────────────────────────────────────────────────────────

export const useMeshStore = create<MeshState>((set, get) => ({
  connState:    'DISCONNECTED',
  hubUrl:       '',
  selfId:       '',
  selfName:     '',
  isConnected:  false,
  devices:      [],
  messages:     {},
  unreadCounts: {},
  fileProgress: {},
  typingStatus: {},
  isPairing:    false,
  pairError:    null,

  setConnState: (s) => set({ connState: s, isConnected: s === 'CONNECTED' }),
  setHubUrl:    (url) => set({ hubUrl: url }),
  setSelfId:    (id) => set({ selfId: id }),
  setSelfName:  (name) => set({ selfName: name }),

  setDevices: (devices) => set({ devices }),

  upsertDevice: (device) => set((state) => ({
    devices: [
      ...state.devices.filter((d) => d.deviceId !== device.deviceId),
      device,
    ],
  })),

  setDeviceOnline: (deviceId, online) => set((state) => ({
    devices: state.devices.map((d) =>
      d.deviceId === deviceId ? { ...d, isOnline: online, lastSeen: Date.now() } : d
    ),
  })),

  addMessage: (msg) => set((state) => {
    const convMsgs = state.messages[msg.conversationId] ?? [];
    // Deduplicate — don't add if already present
    if (convMsgs.some((m) => m.id === msg.id)) return state;
    return {
      messages: {
        ...state.messages,
        [msg.conversationId]: [...convMsgs, msg],
      },
    };
  }),

  updateMsgStatus: (convId, msgId, status) => set((state) => ({
    messages: {
      ...state.messages,
      [convId]: (state.messages[convId] ?? []).map((m) =>
        m.id === msgId ? { ...m, status } : m
      ),
    },
  })),

  setMessages: (convId, msgs) => set((state) => ({
    messages: { ...state.messages, [convId]: msgs },
  })),

  clearConversation: (convId) => set((state) => ({
    messages: { ...state.messages, [convId]: [] },
  })),

  incrementUnread: (convId) => set((state) => ({
    unreadCounts: {
      ...state.unreadCounts,
      [convId]: (state.unreadCounts[convId] ?? 0) + 1,
    },
  })),

  clearUnread: (convId) => set((state) => ({
    unreadCounts: { ...state.unreadCounts, [convId]: 0 },
  })),

  setFileProgress: (fileId, progress) => set((state) => ({
    fileProgress: { ...state.fileProgress, [fileId]: progress },
  })),

  clearFileProgress: (fileId) => set((state) => {
    const { [fileId]: _, ...rest } = state.fileProgress;
    return { fileProgress: rest };
  }),

  setTyping: (convId, deviceName) => set((state) => ({
    typingStatus: { ...state.typingStatus, [convId]: deviceName },
  })),

  setPairing:   (val) => set({ isPairing: val }),
  setPairError: (err) => set({ pairError: err }),
}));

// ─── Selectors (memoisation helpers) ─────────────────────────

export const selectOnlineDevices  = (s: MeshState) => s.devices.filter((d) =>  d.isOnline);
export const selectOfflineDevices = (s: MeshState) => s.devices.filter((d) => !d.isOnline);
export const selectConvMessages   = (convId: string) => (s: MeshState) => s.messages[convId] ?? [];
export const selectUnread         = (convId: string) => (s: MeshState) => s.unreadCounts[convId] ?? 0;
export const selectTyping         = (convId: string) => (s: MeshState) => s.typingStatus[convId] ?? null;
export const selectTotalUnread    = (s: MeshState) =>
  Object.values(s.unreadCounts).reduce((a, b) => a + b, 0);
