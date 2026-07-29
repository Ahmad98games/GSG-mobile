import NetInfo from '@react-native-community/netinfo'
import { drainQueue } from './OfflineSyncService'
import { silentReconnect, getLastBridgeData } from './ConnectionManager'

let unsubscribe: (() => void) | null = null
let lastWasOnline = false

/**
 * Start listening for network state changes.
 *
 * On reconnect:
 *  1. Drain the Supabase offline queue (Supabase writes that were pending)
 *  2. Attempt a silent Hub reconnect (WebSocket bridge) so the status bar
 *     updates immediately without waiting for the 15-second poll tick
 *
 * Safe to call multiple times — only one listener is registered.
 */
export function startNetworkMonitor(): void {
  if (unsubscribe) return // Already running

  unsubscribe = NetInfo.addEventListener(async (state) => {
    const isOnline = !!state.isConnected && !!state.isInternetReachable

    if (isOnline && !lastWasOnline) {
      console.log('[Network] Online — draining queue and reconnecting Hub')

      // Small delay to let the connection stabilise
      await new Promise<void>((r) => setTimeout(r, 1000))

      // Run both in parallel — they are independent
      const lastBridge = await getLastBridgeData()
      await Promise.all([
        drainQueue(),
        lastBridge ? silentReconnect(lastBridge) : Promise.resolve(),
      ])
    }

    lastWasOnline = isOnline
  })

  console.log('[Network] Monitor started')
}

/**
 * Remove the NetInfo listener. Call this on logout or app cleanup.
 */
export function stopNetworkMonitor(): void {
  unsubscribe?.()
  unsubscribe = null
  console.log('[Network] Monitor stopped')
}
