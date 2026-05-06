import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { supabase } from '../lib/supabase';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';

/**
 * Module 3 & 7: Task & Alert Hub
 * Subscribes to realtime updates from the PC Command Center.
 */

export const useTaskSubscriber = () => {
  useEffect(() => {
    let nodeId: string | null = null;

    const setup = async () => {
      nodeId = await SecureStore.getItemAsync('node_id');
      if (!nodeId) return;

      // 1. Listen for Tasks (PC -> Specific Node)
      const taskSub = supabase
        .channel('node_tasks')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'node_tasks', filter: `target_node_id=eq.${nodeId}` },
          (payload) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert(
              `NEW TASK: ${payload.new.title}`,
              payload.new.body.message || 'Check tasks tab for details.'
            );
          }
        )
        .subscribe();

      // 2. Listen for Broadcast Alerts (PC -> Global)
      const alertSub = supabase
        .channel('broadcast_alerts')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'broadcast_alerts' },
          (payload) => {
            if (payload.new.severity === 'CRITICAL') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              // In a real app, this would trigger a full-screen takeover
            }
            Alert.alert(`BROADCAST: ${payload.new.title}`, payload.new.body);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(taskSub);
        supabase.removeChannel(alertSub);
      };
    };

    setup();
  }, []);
};
