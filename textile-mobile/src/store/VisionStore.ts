import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface CCTVTelemetry {
  id: string;
  node_id: string;
  camera_model: string;
  latency_ms: number;
  bitrate_mbps: number;
  status: string;
  created_at: string;
}

interface VisionState {
  nodes: CCTVTelemetry[];
  criticalAlert: boolean;
  isLoading: boolean;
  
  // Actions
  fetchTelemetry: () => Promise<void>;
  setCriticalAlert: (active: boolean) => void;
  acknowledgeAlert: (nodeId: string) => Promise<void>;
  subscribeToTelemetry: () => () => void;
}

/**
 * VISION STORE — SaaS EDITION
 * Manages real-time CCTV hardware telemetry from the public.cctv_telemetry table.
 */
export const useVisionStore = create<VisionState>((set, get) => ({
  nodes: [],
  criticalAlert: false,
  isLoading: false,

  fetchTelemetry: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('cctv_telemetry')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      // Group by node_id to get latest telemetry for each node
      const latestNodes = data.reduce((acc: CCTVTelemetry[], current) => {
        const x = acc.find(item => item.node_id === current.node_id);
        if (!x) acc.push(current);
        return acc;
      }, []);

      set({ nodes: latestNodes, isLoading: false });
      
      // Check for any critical status
      const hasCritical = latestNodes.some(n => n.status === 'CRITICAL');
      if (hasCritical) set({ criticalAlert: true });
    } else {
      set({ isLoading: false });
    }
  },

  setCriticalAlert: (active) => set({ criticalAlert: active }),

  acknowledgeAlert: async (nodeId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Log the acknowledgement in the DB for forensics
    const { error } = await supabase
      .from('alert_logs')
      .insert({
        node_id: nodeId,
        user_id: user.id,
        event_type: 'ACKNOWLEDGEMENT',
        acknowledged_at: new Date().toISOString()
      });

    if (!error) {
      console.log(`[VisionStore] Alert acknowledged for node: ${nodeId}`);
      set({ criticalAlert: false });
      
      // Also update the telemetry status back to NOMINAL
      await supabase
        .from('cctv_telemetry')
        .update({ status: 'NOMINAL' })
        .eq('node_id', nodeId);
    }
  },

  subscribeToTelemetry: () => {
    const channel = supabase
      .channel('cctv-telemetry-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cctv_telemetry' },
        (payload) => {
          console.log('[VisionStore] Telemetry change detected:', payload.eventType);
          get().fetchTelemetry(); // Refresh entire list for simplicity in low-bandwidth mode
          
          if (payload.new && (payload.new as CCTVTelemetry).status === 'CRITICAL') {
            set({ criticalAlert: true });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}));
