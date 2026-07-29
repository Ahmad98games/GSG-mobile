import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from 'react-native'
import { connectViaWebSocket, getConnectionState } from './TCPClientService'
import { useBridgeStatusStore } from '../stores/BridgeStatusStore'
import { drainQueue, getPendingCount } from './OfflineSyncService'

const LAST_BRIDGE_KEY = 'noxis_last_bridge_data'
const CONNECTION_TIMEOUT_LOCAL  = 3000    // 3 s  — fast LAN probe
const CONNECTION_TIMEOUT_TUNNEL = 10000   // 10 s — Cloudflare tunnel

// Exponential backoff schedule (ms): 1 s → 2 → 4 → 8 → 15 → 30 → 60
const RECONNECT_DELAYS_MS = [1000, 2000, 4000, 8000, 15000, 30000, 60000]

export interface BridgeData {
  v?: number
  bridgeUrl?: string    // ws://192.168.x.x:3000
  tunnelUrl?: string    // wss://xxx.cfargotunnel.com
  mobileUrl?: string    // http://192.168.x.x:3000/mobile
  businessName?: string
}

let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectIntervalTimer: ReturnType<typeof setInterval> | null = null
let isReconnecting = false
let reconnectAttempt = 0
let appStateSubscription: { remove: () => void } | null = null

// ── PENDING COUNT SYNC ────────────────────────────────────────────────────────

let pendingCountTimer: ReturnType<typeof setInterval> | null = null

/**
 * Start polling pending sync count and push it into the store reactively.
 * Runs every 3 seconds so HubStatusBar never needs its own poll.
 */
function startPendingCountSync(): void {
  if (pendingCountTimer) return
  const sync = async () => {
    const count = await getPendingCount()
    useBridgeStatusStore.getState().setPendingCount(count)
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

// ── MAIN ENTRY POINT ─────────────────────────────────────────────────────────

/**
 * Try to connect via local WebSocket first, then Cloudflare tunnel.
 * Updates BridgeStatusStore throughout and starts the reconnect watcher
 * on success.
 */
export async function smartConnect(bridgeData: BridgeData): Promise<{
  success: boolean
  method: 'local' | 'tunnel' | 'none'
  url: string
}> {
  const store = useBridgeStatusStore.getState()

  store.setStatus({
    syncStatus: 'syncing',
    hubOnline: false,
    connectionMethod: null,
    connectionStatus: 'connecting',
  })

  // Reset reconnect counter on a fresh user-initiated connect
  reconnectAttempt = 1
  store.setReconnectState(1, null)

  // Persist for future reconnects (app restart, background wake)
  await AsyncStorage.setItem(LAST_BRIDGE_KEY, JSON.stringify(bridgeData))

  // ── Priority 1: Local WiFi WebSocket (3s timeout) ───────────────────────
  if (bridgeData.bridgeUrl) {
    console.log('[Connect] Trying local LAN IP:', bridgeData.bridgeUrl)
    store.setStatus({ connectionMethod: 'local' })

    const startMs = Date.now()
    const ok = await tryConnect(bridgeData.bridgeUrl, CONNECTION_TIMEOUT_LOCAL)

    if (ok) {
      const latencyMs = Date.now() - startMs
      store.setLatency(latencyMs)
      store.setStatus({
        connectionMethod: 'local',
        syncStatus: 'synced',
        hubOnline: true,
        connectionStatus: 'connected',
        hubIp: bridgeData.bridgeUrl,
      })
      drainQueue()
      startReconnectWatcher(bridgeData)
      startPendingCountSync()
      return { success: true, method: 'local', url: bridgeData.bridgeUrl }
    }
  }

  // ── Priority 2: Cloudflare Tunnel (10s timeout) ─────────────────────────
  if (bridgeData.tunnelUrl) {
    console.log('[Connect] Trying Cloudflare tunnel:', bridgeData.tunnelUrl)
    store.setStatus({ connectionMethod: 'tunnel' })

    const startMs = Date.now()
    const ok = await tryConnect(bridgeData.tunnelUrl, CONNECTION_TIMEOUT_TUNNEL)

    if (ok) {
      const latencyMs = Date.now() - startMs
      store.setLatency(latencyMs)
      store.setStatus({
        connectionMethod: 'tunnel',
        syncStatus: 'synced',
        hubOnline: true,
        connectionStatus: 'connected',
        hubIp: bridgeData.tunnelUrl,
      })
      drainQueue()
      startReconnectWatcher(bridgeData)
      startPendingCountSync()
      return { success: true, method: 'tunnel', url: bridgeData.tunnelUrl }
    }
  }

  // ── All endpoints failed — Silent Fallback to Autonomous Standalone Mode ─
  console.log('[Connect] All endpoints failed — falling back to Autonomous Standalone Mode')
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

// ── TRY A SINGLE CONNECTION ───────────────────────────────────────────────────

async function tryConnect(url: string, timeoutMs: number): Promise<boolean> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeoutMs)

    connectViaWebSocket(url)
      .then(() => {
        const state = getConnectionState()
        clearTimeout(timer)
        resolve(state === 'connected' || state === 'connecting')
      })
      .catch(() => {
        clearTimeout(timer)
        resolve(false)
      })
  })
}

// ── RECONNECT WATCHER ─────────────────────────────────────────────────────────

/**
 * Watches for:
 *  1. App coming to foreground (AppState 'active')
 *  2. WebSocket drop detected by polling every 15 s
 *
 * In both cases, triggers a silent exponential backoff reconnect.
 */
function startReconnectWatcher(bridgeData: BridgeData): void {
  // AppState listener — reconnect when app comes to foreground
  if (appStateSubscription) appStateSubscription.remove()

  appStateSubscription = AppState.addEventListener('change', (nextState) => {
    if (nextState === 'active') {
      const state = useBridgeStatusStore.getState()
      if (!state.hubOnline && !isReconnecting) {
        console.log('[Connect] App active — attempting silent reconnect')
        silentReconnect(bridgeData)
      }
    }
  })

  // 15-second poll — detect silent WebSocket drops
  if (reconnectIntervalTimer) clearInterval(reconnectIntervalTimer)

  reconnectIntervalTimer = setInterval(() => {
    const wsState = getConnectionState()
    const storeState = useBridgeStatusStore.getState()

    if (wsState !== 'connected' && storeState.hubOnline) {
      // Socket dropped but store still says online — correct it
      storeState.setStatus({
        hubOnline: false,
        syncStatus: 'offline',
        connectionStatus: 'offline',
      })
      if (!isReconnecting) silentReconnect(bridgeData)
    }
  }, 15_000)
}

// ── SILENT RECONNECT WITH EXPONENTIAL BACKOFF ─────────────────────────────────

/**
 * Attempt to reconnect without user interaction.
 * Uses exponential backoff — 1s → 2s → 4s → 8s → 15s → 30s → 60s cap.
 * Guards against concurrent reconnect attempts.
 */
export async function silentReconnect(bridgeData?: BridgeData): Promise<void> {
  if (isReconnecting) return
  isReconnecting = true

  const data = bridgeData ?? (await getLastBridgeData())
  if (!data) {
    isReconnecting = false
    return
  }

  const store = useBridgeStatusStore.getState()
  store.setStatus({ connectionStatus: 'connecting' })

  console.log(`[Connect] Silent reconnect attempt ${reconnectAttempt + 1}`)

  const result = await smartConnectInternal(data)

  if (result.success) {
    console.log('[Connect] Reconnected via', result.method)
    reconnectAttempt = 0
    store.setReconnectState(0, null)
  } else {
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

    // Schedule next attempt
    if (reconnectTimer) clearTimeout(reconnectTimer)
    reconnectTimer = setTimeout(async () => {
      isReconnecting = false
      await silentReconnect(data)
    }, delayMs)

    isReconnecting = false
    return
  }

  isReconnecting = false
}

/**
 * Internal version of smartConnect that does NOT reset reconnectAttempt.
 * Used by silentReconnect so the backoff counter is preserved across attempts.
 */
async function smartConnectInternal(bridgeData: BridgeData): Promise<{
  success: boolean
  method: 'local' | 'tunnel' | 'none'
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
      startPendingCountSync()
      return { success: true, method: 'tunnel', url: bridgeData.tunnelUrl }
    }
  }

  return { success: false, method: 'none', url: '' }
}

// ── HELPERS ───────────────────────────────────────────────────────────────────

/** Retrieve the last successfully scanned bridge data. */
export async function getLastBridgeData(): Promise<BridgeData | null> {
  try {
    const raw = await AsyncStorage.getItem(LAST_BRIDGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/** Stop AppState listener, poll timer, pending sync timer (e.g. on logout). */
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

/** Legacy — still used by some callers. Prefer smartConnect(). */
export async function getBestKnownUrl(): Promise<string | null> {
  const data = await getLastBridgeData()
  return data?.bridgeUrl ?? data?.tunnelUrl ?? null
}
