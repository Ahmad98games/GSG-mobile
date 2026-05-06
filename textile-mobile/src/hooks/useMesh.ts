/**
 * ══════════════════════════════════════════════════════════
 * FILE LOCATION:  src/hooks/useMesh.ts
 * ACTION:         NEW — create this file (also create src/hooks/ folder)
 * ══════════════════════════════════════════════════════════
 *
 * Gold She Mesh — useMesh Hook
 *
 * This hook is the bridge between the MeshClient (raw WebSocket logic)
 * and the Zustand store (reactive UI state).
 *
 * Call useMesh() once at the ROOT of your app (in app/_layout.tsx).
 * Every screen reads state from useMeshStore() directly.
 *
 * What this hook does:
 *   1. On mount: reads saved deviceId + hubUrl from SQLite
 *      - If both exist → reconnects automatically
 *      - If not → stays DISCONNECTED until user pairs
 *   2. Wires all MeshClient events to the Zustand store
 *   3. Handles decryption of incoming message payloads for display
 *   4. Returns connect/send helpers for the pairing screen
 */

import { useEffect, useRef, useCallback } from 'react';
import { getMeshClient } from '@/lib/mesh/mesh-client';
import { getOfflineQueue } from '@/lib/mesh/offline-queue';
import { MobileCrypto } from '@/lib/MobileCrypto';
import { dmConversationId, type DeviceIdentity } from '@/lib/mesh/mesh-protocol';
import {
  useMeshStore,
  type UIMessage,
  type UIMsgType,
} from '@/stores/meshStore';
import type { ConnState } from '@/lib/mesh/mesh-client';
type SendMsgOptions = any;
import type {
  TextMessagePayload,
  PhotoMessagePayload,
  VoiceNotePayload,
  FileManifestPayload,
  TypingIndicatorPayload,
  PresencePayload,
} from '@/lib/mesh/mesh-protocol';

// ─────────────────────────────────────────────────────────────

export function useMesh() {
  const store       = useMeshStore();
  const queue       = getOfflineQueue();
  const mountedRef  = useRef(true);

  // ── Bootstrap on mount ──────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;
    void bootstrap();
    return () => { mountedRef.current = false; };
  }, []);

  const bootstrap = useCallback(async () => {
    const savedId   = await queue.getDeviceId();
    const savedName = await queue.getDeviceName();
    const savedUrl  = await queue.getHubUrl();

    if (!mountedRef.current) return;

    if (savedId && savedName) {
      store.setSelfId(savedId);
      store.setSelfName(savedName);
    }

    if (!savedId || !savedUrl) {
      // Not yet paired — stay disconnected
      store.setConnState('DISCONNECTED');
      return;
    }

    // Reconnect automatically
    const client = getMeshClient(savedName ?? 'Mobile Device');
    attachClientEvents(client);

    try {
      await client.reconnect(savedUrl);
    } catch {
      // Reconnect backoff handles retries — don't crash
    }
  }, []);

  // ── Wire MeshClient events to Zustand ───────────────────

  const attachClientEvents = useCallback((client: ReturnType<typeof getMeshClient>) => {
    // Remove previous listeners to avoid duplicates on re-attach
    client.removeAllListeners();

    client.on('state-change', (s: ConnState) => {
      if (!mountedRef.current) return;
      store.setConnState(s);
    });

    client.on('device-registry', (devices: DeviceIdentity[]) => {
      if (!mountedRef.current) return;
      store.setDevices(devices);
    });

    client.on('device-online', (device: DeviceIdentity) => {
      if (!mountedRef.current) return;
      store.upsertDevice({ ...device, isOnline: true });
    });

    client.on('device-offline', (deviceId: string) => {
      if (!mountedRef.current) return;
      store.setDeviceOnline(deviceId, false);
    });

    client.on('message', ({
      type, from, payload, packetId, ts,
    }: {
      type: string; from: string;
      payload: TextMessagePayload | PhotoMessagePayload | VoiceNotePayload;
      packetId: string; ts: number;
    }) => {
      if (!mountedRef.current) return;

      const selfId = store.selfId || client.selfDeviceId;
      const convId = dmConversationId(from, selfId);
      const device = useMeshStore.getState().devices.find((d) => d.deviceId === from);
      const fromName = device?.deviceName ?? from.slice(0, 8);

      let uiMsg: UIMessage;

      if (type === 'TEXT_MESSAGE') {
        const p = payload as TextMessagePayload;
        uiMsg = {
          id: packetId, from, fromName, type: 'text',
          text: p.text, ts, isMine: false, status: 'delivered',
          conversationId: convId,
        };
      } else if (type === 'PHOTO_MESSAGE') {
        const p = payload as PhotoMessagePayload;
        uiMsg = {
          id: packetId, from, fromName, type: 'photo',
          thumbnailBase64: p.thumbnailBase64, photoCaption: p.caption,
          ts, isMine: false, status: 'delivered', conversationId: convId,
        };
      } else if (type === 'VOICE_NOTE') {
        const p = payload as VoiceNotePayload;
        uiMsg = {
          id: packetId, from, fromName, type: 'voice',
          durationMs: p.durationMs, waveform: p.waveform,
          ts, isMine: false, status: 'delivered', conversationId: convId,
        };
      } else {
        return;
      }

      store.addMessage(uiMsg);
      store.incrementUnread(convId);
    });

    client.on('typing-indicator', (payload: TypingIndicatorPayload) => {
      if (!mountedRef.current) return;
      const { conversationId, deviceName, isTyping } = payload;
      store.setTyping(conversationId, isTyping ? deviceName : null);
    });

    client.on('presence-update', (payload: PresencePayload) => {
      if (!mountedRef.current) return;
      const { deviceId, status, lastSeen } = payload;
      store.setDeviceOnline(deviceId, status === 'online');
    });

    client.on('file-incoming', (manifest: FileManifestPayload) => {
      store.setFileProgress(manifest.fileId, 0);
    });

    client.on('file-progress', ({ fileId, sent, total }: { fileId: string; sent: number; total: number }) => {
      store.setFileProgress(fileId, sent / total);
    });

    client.on('file-received', ({ fileId }: { fileId: string }) => {
      store.clearFileProgress(fileId);
    });

    client.on('hub-error', (err: { code: string; message: string }) => {
      console.error('[useMesh] Hub error:', err);
    });

    client.on('connected', () => {
      if (!mountedRef.current) return;
      store.setSelfId(client.selfDeviceId);
    });
  }, [store]);

  // ── Pairing ──────────────────────────────────────────────

  const pairWithCode = useCallback(async (
    hubWsUrl:    string,
    pairingCode: string,
    deviceName:  string
  ): Promise<void> => {
    store.setPairing(true);
    store.setPairError(null);

    try {
      const client = getMeshClient(deviceName);
      attachClientEvents(client);
      await client.pairAndConnect(hubWsUrl, pairingCode);
      store.setSelfId(client.selfDeviceId);
      store.setSelfName(deviceName);
      store.setHubUrl(hubWsUrl);
    } catch (err) {
      store.setPairError((err as Error).message);
      throw err;
    } finally {
      store.setPairing(false);
    }
  }, [store, attachClientEvents]);

  // ── Send helpers ─────────────────────────────────────────

  const sendText = useCallback(async (toDeviceId: string, text: string): Promise<void> => {
    const { generateUUID, dmConversationId } = await import('@/lib/mesh/mesh-protocol');
    const client  = getMeshClient();
    const selfId  = client.selfDeviceId;
    const msgId   = generateUUID();
    const convId  = dmConversationId(selfId, toDeviceId);

    // Optimistic UI
    const optimistic: UIMessage = {
      id: msgId, from: selfId, fromName: 'You',
      type: 'text', text, ts: Date.now(),
      isMine: true, status: 'sending', conversationId: convId,
    };
    store.addMessage(optimistic);

    try {
      await client.sendMessage({
        to:   toDeviceId,
        type: 'TEXT_MESSAGE',
        payload: { msgId, conversationId: convId, text },
      });
      store.updateMsgStatus(convId, msgId, 'delivered');
    } catch {
      store.updateMsgStatus(convId, msgId, 'failed');
    }
  }, [store]);

  const sendTyping = useCallback((toDeviceId: string, isTyping: boolean) => {
    const client = getMeshClient();
    const selfId = client.selfDeviceId;
    const { dmConversationId } = require('@/lib/mesh/mesh-protocol');
    const convId = dmConversationId(selfId, toDeviceId);
    client.sendTypingIndicator(convId, isTyping);
  }, []);

  return {
    pairWithCode,
    sendText,
    sendTyping,
    attachClientEvents,
  };
}
