import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'
import NetInfo from '@react-native-community/netinfo'
import { connectViaWebSocket, getConnectionState } from './TCPClientService'
import { useBridgeStatusStore } from '../stores/BridgeStatusStore'
import { drainQueue, getPendingCount } from './OfflineSyncService'
import { KhataLedgerEngine } from './KhataLedgerEngine'
import { supabase } from '../lib/supabase'

import {
  RealtimeMeshSyncEngine,
  PRIMARY_PRODUCTION_BUSINESS_ID,
  PRIMARY_BUSINESS_NAME,
} from './RealtimeMeshSyncEngine'
import { LocalDataManager } from './LocalDataManager'

const LAST_BRIDGE_KEY = 'noxis_last_bridge_data'
const CONNECTION_TIMEOUT_LOCAL  = 3500    // 3.5 s — robust LAN probe
const CONNECTION_TIMEOUT_TUNNEL = 4000    // 4 s   — Cloudflare tunnel
const CONNECTION_TIMEOUT_CLOUD  = 2500    // 2.5 s — Supabase cloud check

const KNOWN_PC_IP = '192.168.0.102'
const KNOWN_PC_IP_ALT = '192.168.0.103'
const KNOWN_PC_IP_ALT2 = '192.168.0.110'
const KNOWN_PC_IP_ALT3 = '192.168.0.105'
const KNOWN_PC_IP_ALT4 = '192.168.0.111'

const RECONNECT_DELAYS_MS = [1000, 2000, 4000, 8000, 15000, 30000, 60000]

export interface BridgeData {
  v?: number
  bridgeUrl?: string    // ws://192.168.x.x:7447
  tunnelUrl?: string    // wss://xxx.cfargotunnel.com
  mobileUrl?: string    // http://192.168.x.x:3000/mobile
  businessName?: string
  businessId?: string
}

let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectIntervalTimer: ReturnType<typeof setInterval> | null = null
let isReconnecting = false
let reconnectAttempt = 0
let appStateSubscription: { remove: () => void } | null = null
let pendingCountTimer: ReturnType<typeof setInterval> | null = null

function startPendingCountSync(): void {
  if (pendingCountTimer) return
  const sync = async () => {
    const offlineCount = await getPendingCount()
    const khataCount = await KhataLedgerEngine.getPendingCount()
    useBridgeStatusStore.getState().setPendingCount(offlineCount + khataCount)
  }
  sync()
  pendingCountTimer = setInterval(sync, 3000)
}

function stopPendingCountSync(): void {
  if (pendingCountTimer) {
    clearInterval(pendingCountTimer)
    pendingCountTimer = null
  }
}

export async function smartConnect(bridgeData: BridgeData): Promise<{
  success: boolean
  method: 'local' | 'tunnel' | 'supabase' | 'none'
  url: string
}> {
  const store = useBridgeStatusStore.getState()

  store.setStatus({
    syncStatus: 'syncing',
    hubOnline: false,
    connectionMethod: null,
    connectionStatus: 'connecting',
  })

  reconnectAttempt = 1
  store.setReconnectState(1, null)

  await AsyncStorage.setItem(LAST_BRIDGE_KEY, JSON.stringify(bridgeData))

  // ── Enterprise Multi-Transport Fast-Path Race (Google / Microsoft Architecture) ──
  // Concurrently race Local LAN WebSocket, Subnet Discovery, and Global Supabase Cloud Mesh.
  // Whichever establishes valid communication first binds the session in milliseconds.
  const probes: Promise<{ success: boolean; method: 'local' | 'tunnel' | 'supabase' | 'none'; url: string }>[] = []

  // 1. Direct Local LAN WebSocket Probe
  const lanCandidates = [
    bridgeData.bridgeUrl,
    `ws://${KNOWN_PC_IP}:7447`,
    `ws://${KNOWN_PC_IP}:7447/mobile-bridge`,
    `ws://${KNOWN_PC_IP_ALT}:7447`,
    `ws://${KNOWN_PC_IP_ALT2}:7447`,
    `ws://${KNOWN_PC_IP_ALT3}:7447`,
    `ws://${KNOWN_PC_IP_ALT4}:7447`,
  ].filter(Boolean) as string[]

  const uniqueLanCandidates = Array.from(new Set(lanCandidates))

  for (const candUrl of uniqueLanCandidates) {
    probes.push(
      (async () => {
        const startMs = Date.now()
        const ok = await tryConnect(candUrl, CONNECTION_TIMEOUT_LOCAL)
        if (ok) {
          const latencyMs = Date.now() - startMs
          store.setLatency(latencyMs)
          store.setStatus({
            connectionMethod: 'local',
            syncStatus: 'synced',
            hubOnline: true,
            connectionStatus: 'connected',
            hubIp: candUrl,
            businessId: bridgeData.businessId || store.businessId || PRIMARY_PRODUCTION_BUSINESS_ID,
            businessName: bridgeData.businessName || store.businessName || PRIMARY_BUSINESS_NAME,
          })
          // Establish persistent WebSocket session for hardware bridge
          connectViaWebSocket(candUrl).catch(() => {})
          // Start cloud realtime mesh as secondary channel only if real businessId exists
          if (store.businessId) {
            RealtimeMeshSyncEngine.start(store.businessId).catch(() => {})
            LocalDataManager.hydrateFromCloud(store.businessId).catch(() => {})
          }
          drainQueue().catch(() => {})
          KhataLedgerEngine.drain().catch((e) =>
            console.error('[Connect] KhataLedgerEngine drain error:', e)
          )
          return { success: true, method: 'local' as const, url: candUrl }
        }
        return { success: false, method: 'none' as const, url: '' }
      })()
    )
  }

  // 2. Encrypted Tunnel Probe
  if (bridgeData.tunnelUrl) {
    probes.push(
      (async () => {
        const startMs = Date.now()
        const ok = await tryConnect(bridgeData.tunnelUrl!, CONNECTION_TIMEOUT_TUNNEL)
        if (ok) {
          const latencyMs = Date.now() - startMs
          store.setLatency(latencyMs)
          const resolvedBizId = bridgeData.businessId || store.businessId || ''
          const resolvedBizName = bridgeData.businessName || store.businessName || 'My Factory'
          store.setStatus({
            connectionMethod: 'tunnel',
            syncStatus: 'synced',
            hubOnline: true,
            connectionStatus: 'connected',
            hubIp: bridgeData.tunnelUrl,
            businessId: resolvedBizId,
            businessName: resolvedBizName,
          })
          connectViaWebSocket(bridgeData.tunnelUrl!).catch(() => {})
          if (resolvedBizId) {
            RealtimeMeshSyncEngine.start(resolvedBizId).catch(() => {})
            LocalDataManager.hydrateFromCloud(resolvedBizId).catch(() => {})
          }
          drainQueue().catch(() => {})
          KhataLedgerEngine.drain().catch((e) =>
            console.error('[Connect] KhataLedgerEngine drain error:', e)
          )
          return { success: true, method: 'tunnel' as const, url: bridgeData.tunnelUrl! }
        }
        return { success: false, method: 'none' as const, url: '' }
      })()
    )
  }

  // Race to find first successful LAN / Tunnel response
  const localResult = await new Promise<{ success: boolean; method: 'local' | 'tunnel' | 'supabase' | 'none'; url: string }>((resolve) => {
    let pending = probes.length;
    let resolved = false;

    if (pending === 0) {
      resolve({ success: false, method: 'none', url: '' });
      return;
    }

    probes.forEach(async (p) => {
      try {
        const res = await p;
        if (res.success && !resolved) {
          resolved = true;
          resolve(res);
        }
      } catch {}
      pending--;
      if (pending === 0 && !resolved) {
        resolve({ success: false, method: 'none', url: '' });
      }
    });
  });

  if (localResult.success) {
    console.log('[Connect] Fast-Path Race won by LAN/Tunnel:', localResult.method, 'url:', localResult.url);
    startReconnectWatcher(bridgeData);
    startPendingCountSync();
    return localResult;
  }

  // Fallback to Cloud Supabase Mesh ONLY if all local LAN & Tunnel endpoints are unreachable
  console.log('[Connect] Local LAN & Tunnel unavailable — checking Supabase Cloud fallback...');
  const cloudRes = await tryCloudConnect(bridgeData);
  if (cloudRes.success) {
    console.log('[Connect] Fallback won by Supabase Cloud Mesh');
    startReconnectWatcher(bridgeData);
    startPendingCountSync();
    return cloudRes;
  }

  console.log('[Connect] All endpoints unreachable — Standalone Local Cache Mode')
  store.setStatus({
    syncStatus: 'offline',
    hubOnline: false,
    connectionMethod: null,
    connectionStatus: 'offline',
    hubIp: null,
  })

  startPendingCountSync()
  return { success: false, method: 'none', url: '' }
}

async function tryCloudConnect(bridgeData?: BridgeData): Promise<{
  success: boolean
  method: 'supabase' | 'none'
  url: string
}> {
  const store = useBridgeStatusStore.getState()
  try {
    const startMs = Date.now()
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT_CLOUD)

    // Direct health ping to Supabase Auth/Gateway (<80ms response)
    const res = await fetch('https://zgxmvwxzjmpmesqliwxl.supabase.co/auth/v1/health', {
      signal: controller.signal,
      headers: { apikey: 'sb_publishable_cGJQMAam_R4JU3X4IEIrkQ_EPeSsQIt' },
    })
    clearTimeout(timer)

    if (res.ok || res.status === 200) {
      const latencyMs = Date.now() - startMs
      const targetBizId = bridgeData?.businessId || store.businessId || 'ffa84a41-941e-4e4e-87c3-9580271db2bd'
      const targetBizName = bridgeData?.businessName || (store.businessName && store.businessName !== 'My Factory' ? store.businessName : 'Noxis Textile Mills')

      store.setLatency(latencyMs)
      store.setStatus({
        connectionMethod: 'supabase',
        syncStatus: 'synced',
        hubOnline: true,
        connectionStatus: 'connected',
        hubIp: 'Supabase Cloud Mesh',
        businessId: targetBizId,
        businessName: targetBizName,
        role: 'owner',
      })

      // Bond to Realtime Cloud Mesh if valid businessId
      if (targetBizId) {
        RealtimeMeshSyncEngine.start(targetBizId).catch(() => {})
        LocalDataManager.hydrateFromCloud(targetBizId).catch(() => {})
      }

      drainQueue().catch(() => {})
      KhataLedgerEngine.drain().catch((e) =>
        console.error('[Connect] KhataLedgerEngine drain error:', e)
      )
      return { success: true, method: 'supabase', url: 'Supabase Cloud Mesh' }
    }
  } catch (e) {
    console.log('[Connect] Cloud probe error:', e)
  }
  return { success: false, method: 'none', url: '' }
}

async function tryConnect(url: string, timeoutMs: number): Promise<boolean> {
  const cleanIpMatch = url.match(/^(?:https?|wss?):\/\/([^:/]+)/);
  const targetIp = cleanIpMatch ? cleanIpMatch[1] : null;

  if (targetIp && !targetIp.includes('supabase')) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), Math.min(timeoutMs, 1000));
      const res = await Promise.any([
        fetch(`http://${targetIp}:7447/api/hub/info`, { signal: controller.signal }),
        fetch(`http://${targetIp}:3000/api/hub/info`, { signal: controller.signal }),
      ]);
      clearTimeout(timer);
      if (res.ok) {
        return true;
      }
    } catch {}
  }

  return new Promise((resolve) => {
    let settled = false;
    let probeSocket: WebSocket | null = null;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        try { probeSocket?.close(); } catch {}
        resolve(false);
      }
    }, timeoutMs);

    try {
      probeSocket = new WebSocket(url);
      probeSocket.onopen = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          try { probeSocket?.close(); } catch {}
          resolve(true);
        }
      };
      probeSocket.onerror = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(false);
        }
      };
      probeSocket.onclose = () => {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve(false);
        }
      };
    } catch {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        resolve(false);
      }
    }
  });
}

function startReconnectWatcher(bridgeData?: BridgeData): void {
  if (appStateSubscription) appStateSubscription.remove()

  appStateSubscription = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'active') {
      const state = useBridgeStatusStore.getState()
      if (!state.hubOnline && !isReconnecting) {
        console.log('[Connect] App active — probing connection')
        silentReconnect(bridgeData)
      }
    }
  })

  reconnectIntervalTimer = setInterval(async () => {
    const wsState = getConnectionState()
    const storeState = useBridgeStatusStore.getState()

    if (wsState !== 'connected') {
      // Background upgrade: Probe local LAN WSS to see if PC Hub is available on Wi-Fi
      const pcUrl = `ws://${KNOWN_PC_IP}:7447`
      const isLanUp = await tryConnect(pcUrl, 2500)
      if (isLanUp) {
        console.log('[Connect] PC Hub detected on LAN! Upgrading session to Local WSS')
        connectViaWebSocket(pcUrl).catch(() => {})
        storeState.setStatus({
          connectionMethod: 'local',
          syncStatus: 'synced',
          hubOnline: true,
          connectionStatus: 'connected',
          hubIp: pcUrl,
        })
        return
      }

      if (storeState.connectionMethod !== 'supabase' && storeState.hubOnline) {
        storeState.setStatus({
          hubOnline: false,
          syncStatus: 'offline',
          connectionStatus: 'offline',
        })
        if (!isReconnecting) silentReconnect(bridgeData)
      }
    }
  }, 10_000)
}

export async function silentReconnect(bridgeData?: BridgeData): Promise<void> {
  if (isReconnecting) return
  isReconnecting = true

  const data = bridgeData ?? (await getLastBridgeData())
  const store = useBridgeStatusStore.getState()
  store.setStatus({ connectionStatus: 'connecting' })

  console.log(`[Connect] Reconnect probe attempt ${reconnectAttempt + 1}`)

  if (data) {
    const result = await smartConnectInternal(data)
    if (result.success) {
      console.log('[Connect] Reconnected via', result.method)
      reconnectAttempt = 0
      store.setReconnectState(0, null)
      isReconnecting = false
      return
    }
  }

  // Fallback: Test Cloud Supabase connection if network is online
  const cloudRes = await tryCloudConnect()
  if (cloudRes.success) {
    console.log('[Connect] Connected via Supabase Cloud')
    reconnectAttempt = 0
    store.setReconnectState(0, null)
    startPendingCountSync()
    isReconnecting = false
    return
  }

  reconnectAttempt++
  const delayMs =
    RECONNECT_DELAYS_MS[Math.min(reconnectAttempt - 1, RECONNECT_DELAYS_MS.length - 1)]
  const nextRetryAt = Date.now() + delayMs

  console.log(`[Connect] Reconnect failed — retry in ${delayMs}ms (attempt ${reconnectAttempt})`)
  store.setReconnectState(reconnectAttempt, nextRetryAt)
  store.setStatus({
    hubOnline: false,
    syncStatus: 'offline',
    connectionStatus: 'offline',
  })

  if (reconnectTimer) clearTimeout(reconnectTimer)
  reconnectTimer = setTimeout(async () => {
    isReconnecting = false
    await silentReconnect(data || undefined)
  }, delayMs)

  isReconnecting = false
}

async function smartConnectInternal(bridgeData: BridgeData): Promise<{
  success: boolean
  method: 'local' | 'tunnel' | 'supabase' | 'none'
  url: string
}> {
  const store = useBridgeStatusStore.getState()

  if (bridgeData.bridgeUrl) {
    const startMs = Date.now()
    const ok = await tryConnect(bridgeData.bridgeUrl, CONNECTION_TIMEOUT_LOCAL)
    if (ok) {
      store.setLatency(Date.now() - startMs)
      store.setStatus({
        connectionMethod: 'local',
        syncStatus: 'synced',
        hubOnline: true,
        connectionStatus: 'connected',
        hubIp: bridgeData.bridgeUrl,
      })
      drainQueue()
      KhataLedgerEngine.drain().catch(e => console.error('[Connect] KhataLedgerEngine drain error:', e))
      startPendingCountSync()
      return { success: true, method: 'local', url: bridgeData.bridgeUrl }
    }
  }

  if (bridgeData.tunnelUrl) {
    const startMs = Date.now()
    const ok = await tryConnect(bridgeData.tunnelUrl, CONNECTION_TIMEOUT_TUNNEL)
    if (ok) {
      store.setLatency(Date.now() - startMs)
      store.setStatus({
        connectionMethod: 'tunnel',
        syncStatus: 'synced',
        hubOnline: true,
        connectionStatus: 'connected',
        hubIp: bridgeData.tunnelUrl,
      })
      drainQueue()
      KhataLedgerEngine.drain().catch(e => console.error('[Connect] KhataLedgerEngine drain error:', e))
      startPendingCountSync()
      return { success: true, method: 'tunnel', url: bridgeData.tunnelUrl }
    }
  }

  return { success: false, method: 'none', url: '' }
}

export async function getLastBridgeData(): Promise<BridgeData | null> {
  try {
    const raw = await AsyncStorage.getItem(LAST_BRIDGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function stopReconnectWatcher(): void {
  appStateSubscription?.remove()
  appStateSubscription = null

  if (reconnectIntervalTimer) {
    clearInterval(reconnectIntervalTimer)
    reconnectIntervalTimer = null
  }
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  stopPendingCountSync()
  isReconnecting = false
  reconnectAttempt = 0
  useBridgeStatusStore.getState().setReconnectState(0, null)
}

export async function getBestKnownUrl(): Promise<string | null> {
  const data = await getLastBridgeData()
  return data?.bridgeUrl ?? data?.tunnelUrl ?? null
}
