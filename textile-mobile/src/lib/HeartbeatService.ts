import * as Battery from 'expo-battery';
import NetInfo from '@react-native-community/netinfo';
import * as SecureStore from 'expo-secure-store';
import { SupabaseClient } from '@supabase/supabase-js';

const HEARTBEAT_INTERVAL_MS = 30 * 1000; // 30 seconds

interface HeartbeatPayload {
  last_seen_at: string;
  battery_pct: number;
  signal_strength: number;      // 0 = none, 1 = poor, 2 = cellular, 3 = good wifi, 4 = excellent wifi
  current_screen: string;
  updated_at: string;
}

class HeartbeatServiceClass {
  private supabase: SupabaseClient | null = null;
  private interval: ReturnType<typeof setInterval> | null = null;
  private currentScreen = '/';
  private pushToken: string | null = null;
  private nodeId: string | null = null;

  // ─── Init ─────────────────────────────────────────────────────────────────
  async init(supabaseClient: SupabaseClient): Promise<void> {
    this.supabase = supabaseClient;
    this.nodeId = await SecureStore.getItemAsync('gs_node_id');
  }

  // ─── Start sending heartbeats ─────────────────────────────────────────────
  start(): void {
    if (this.interval) return; // Already running
    this.send().catch((e) => console.warn('[Heartbeat] Initial send failed:', e));
    this.interval = setInterval(() => {
      this.send().catch((e) => console.warn('[Heartbeat] Periodic send failed:', e));
    }, HEARTBEAT_INTERVAL_MS);
    console.log('[Heartbeat] Started — interval:', HEARTBEAT_INTERVAL_MS + 'ms');
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('[Heartbeat] Stopped');
    }
  }

  // ─── Dynamically update current screen ───────────────────────────────────
  setCurrentScreen(screen: string): void {
    this.currentScreen = screen;
  }

  // ─── Dynamically inject push token ───────────────────────────────────────
  setPushToken(token: string): void {
    this.pushToken = token;
  }

  // ─── Build and send heartbeat payload ────────────────────────────────────
  private async send(): Promise<void> {
    if (!this.supabase || !this.nodeId) return;

    try {
      // Collect telemetry
      const [batteryLevel, netState] = await Promise.all([
        Battery.getBatteryLevelAsync().catch(() => -1),
        NetInfo.fetch(),
      ]);

      const signalStrength = this.mapSignalStrength(netState);

      const now = new Date().toISOString();
      const payload: HeartbeatPayload = {
        last_seen_at: now,
        battery_pct: batteryLevel >= 0 ? Math.round(batteryLevel * 100) : -1,
        signal_strength: signalStrength,
        current_screen: this.currentScreen,
        updated_at: now,
      };

      // Optionally include push token if set
      const update: Record<string, unknown> = { ...payload };
      if (this.pushToken) update.push_token = this.pushToken;

      const { error } = await this.supabase
        .from('node_registrations')
        .update(update)
        .eq('id', this.nodeId);

      if (error) console.warn('[Heartbeat] Supabase update failed:', error.message);
    } catch (e) {
      // Heartbeat failure must never crash the app
      console.warn('[Heartbeat] Send error (non-fatal):', e);
    }
  }

  private mapSignalStrength(netState: { type: string; isConnected: boolean | null }): number {
    if (!netState.isConnected) return 0;
    switch (netState.type) {
      case 'wifi':     return 4;
      case 'cellular': return 2;
      case 'ethernet': return 4;
      default:         return 1;
    }
  }
}

export const HeartbeatService = new HeartbeatServiceClass();
