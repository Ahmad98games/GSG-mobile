import { useEffect } from 'react';
import * as Battery from 'expo-battery';
import * as NetInfo from '@react-native-community/netinfo';
import { usePathname } from 'expo-router';
import { supabase } from '../lib/supabase';
import * as SecureStore from 'expo-secure-store';

/**
 * Module 3: Heartbeat Sync
 * Updates node_registrations with live telemetry every 30s.
 */

export const useHeartbeat = () => {
  const pathname = usePathname();

  useEffect(() => {
    const syncHeartbeat = async () => {
      const nodeId = await SecureStore.getItemAsync('node_id');
      if (!nodeId) return;

      const battery = await Battery.getPowerStateAsync();
      const network = await NetInfo.fetch();

      const { error } = await supabase
        .from('node_registrations')
        .update({
          last_seen_at: new Date().toISOString(),
          battery_pct: Math.round(battery.batteryLevel * 100),
          signal_strength: network.type, // Basic type for now
          current_screen: pathname,
          is_active: true,
        })
        .eq('id', nodeId);

      if (error) console.error('[HEARTBEAT_FAILURE]', error.message);
    };

    // Initial heartbeat
    syncHeartbeat();

    // 30s Interval
    const interval = setInterval(syncHeartbeat, 30000);

    return () => clearInterval(interval);
  }, [pathname]);
};
