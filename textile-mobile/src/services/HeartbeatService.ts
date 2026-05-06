import * as Battery from 'expo-battery';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from "@/lib/supabase";
import { useAuthStore } from '../store/AuthStore';
import { queueManager } from './OfflineQueueManager';

/**
 * SOVEREIGN HEARTBEAT SERVICE (v3.0)
 * HIGH-DENSITY NETWORK OPTIMIZATION: Adaptive Jitter
 */
class HeartbeatService {
  private timeoutId: NodeJS.Timeout | null = null;
  private currentScreen: string = 'unknown';
  private baseFrequency: number = 30000;
  private JITTER_MAX = 5000; // 5 seconds jitter

  start() {
    if (this.timeoutId) return;
    this.pulse();
  }

  private scheduleNext() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    
    const jitter = Math.floor(Math.random() * this.JITTER_MAX);
    const delay = this.baseFrequency + jitter;
    
    this.timeoutId = setTimeout(() => this.pulse(), delay);
  }

  public updateFrequency(ms: number) {
    if (this.baseFrequency === ms) return;
    console.log(`[Heartbeat] Base frequency shifted to ${ms / 1000}s`);
    this.baseFrequency = ms;
    this.scheduleNext();
  }

  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }

  setScreen(screenName: string) {
    this.currentScreen = screenName;
  }

  private async pulse() {
    const { nodeId } = useAuthStore.getState();
    if (!nodeId) return;

    try {
      const battery = await Battery.getBatteryLevelAsync();
      const net = await NetInfo.fetch();
      
      const payload = {
        bp: Math.round(battery * 100),
        ss: net.isConnected ? 4 : 0,
        cs: this.currentScreen,
        ts: Date.now()
      };

      // TIER 3: Enqueue for Hub Sync (30-60s jittered window)
      await queueManager.enqueueTier3(0, payload);

      // Optional: Keep Supabase for real-time web dashboard visibility if needed,
      // but the primary sync is now via the Intelligent Edge Queue.
      /*
      await supabase
        .from('node_registrations')
        .update({ ...payload, ls: new Date().toISOString(), ia: true })
        .eq('id', nodeId);
      */
    } catch (err) {
      console.error('Heartbeat Error:', err);
    } finally {
      this.scheduleNext();
    }
  }
}

export const Heartbeat = new HeartbeatService();
