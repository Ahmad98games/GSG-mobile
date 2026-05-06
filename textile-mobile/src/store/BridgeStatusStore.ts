import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ConnectionState = 'connected' | 'reconnecting' | 'offline';
export type SignalQuality = 'strong' | 'weak' | 'lost';
export type TierLimit = 'lite' | 'pro' | 'elite' | null;

export type TierFeatures = {
  maxDevices: number;        // Lite:15, Pro:35, Elite:75
  maxCameras: number;        // Lite:2, Pro:8, Elite:unlimited(-1)
  voiceMessages: boolean;    // Lite:false, Pro:true, Elite:true
  voiceMaxSeconds: number;   // Lite:0, Pro:60, Elite:180
  msgMaxChars: number;       // Lite:500, Pro:1000, Elite:2000
  aiDetection: boolean;      // Lite:false, Pro:true, Elite:true
  multiLocation: boolean;    // Lite:false, Pro:false, Elite:true
  guardianAuth: boolean;      // Lite:false, Pro:false, Elite:true
  clientPortal: boolean;     // Lite:false, Pro:true, Elite:true
  whatsappReports: boolean;  // Lite:false, Pro:false, Elite:true
  systemLock: boolean;       // Lite:false, Pro:false, Elite:true
};

const TIER_CONFIGS: Record<string, { tier: TierLimit, features: TierFeatures }> = {
  LITE: {
    tier: 'lite',
    features: {
      maxDevices: 15, maxCameras: 2, voiceMessages: false, voiceMaxSeconds: 0,
      msgMaxChars: 500, aiDetection: false, multiLocation: false, guardianAuth: false,
      clientPortal: false, whatsappReports: false, systemLock: false
    }
  },
  PRO: {
    tier: 'pro',
    features: {
      maxDevices: 35, maxCameras: 8, voiceMessages: true, voiceMaxSeconds: 60,
      msgMaxChars: 1000, aiDetection: true, multiLocation: false, guardianAuth: false,
      clientPortal: true, whatsappReports: false, systemLock: false
    }
  },
  ELITE: {
    tier: 'elite',
    features: {
      maxDevices: 75, maxCameras: -1, voiceMessages: true, voiceMaxSeconds: 180,
      msgMaxChars: 2000, aiDetection: true, multiLocation: true, guardianAuth: true,
      clientPortal: true, whatsappReports: true, systemLock: true
    }
  }
};

interface BridgeStatusState {
  connectionState: ConnectionState;
  reconnectAttempts: number;
  lastAckAt: number | null;
  currentSyncOffset: number | null;
  signalQuality: SignalQuality;
  rollingRtt: number[];
  pairedDeviceCount: number; // For backward compatibility if needed, but we use connectedNodeCount now
  connectedNodeCount: number;
  maxNodeCount: number;
  tierLimit: TierLimit;
  tierFeatures: TierFeatures | null;
  lastTierSyncAt: number | null;
  portalUpgradeUrl: string;
  
  // Actions
  setConnectionState: (state: ConnectionState) => void;
  incrementReconnectAttempts: () => void;
  resetReconnectAttempts: () => void;
  setLastAckAt: (timestamp: number) => void;
  setSyncOffset: (offset: number) => void;
  setTierFromHubAck: (ack: any) => void;
  setConnectedNodeCount: (count: number) => void;
  recordRtt: (rtt: number) => void;
  setTierLimit: (tier: TierLimit) => void;
  
  // Computed (Functions)
  isFeatureAvailable: (feature: keyof TierFeatures) => boolean;
  isNodeLimitReached: () => boolean;
}

/**
 * BRIDGE STATUS STORE
 * Tracks real-time TCP connectivity, signal quality, and industrial tier gating.
 */
export const useBridgeStatus = create<BridgeStatusState>()(
  persist(
    (set, get) => ({
      connectionState: 'offline',
      reconnectAttempts: 0,
      lastAckAt: null,
      currentSyncOffset: null,
      signalQuality: 'lost',
      rollingRtt: [],
      pairedDeviceCount: 0,
      connectedNodeCount: 0,
      maxNodeCount: 15,
      tierLimit: 'lite',
      tierFeatures: TIER_CONFIGS.LITE.features,
      lastTierSyncAt: null,
      portalUpgradeUrl: 'https://omnora.com/portal/billing',

      setConnectionState: (connectionState) => {
        const signalQuality = connectionState === 'connected' ? get().signalQuality : 'lost';
        set({ connectionState, signalQuality });
      },

      incrementReconnectAttempts: () => 
        set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),

      resetReconnectAttempts: () => 
        set({ reconnectAttempts: 0 }),

      setLastAckAt: (lastAckAt) => set({ lastAckAt }),

      setSyncOffset: (currentSyncOffset) => set({ currentSyncOffset }),

      setTierFromHubAck: (ack) => {
        if (!ack.activeProfile) {
          set({ tierLimit: null, tierFeatures: null });
          return;
        }

        const profile = ack.activeProfile.toUpperCase();
        let config = TIER_CONFIGS.LITE; // Fallback

        if (profile.includes('ELITE')) config = TIER_CONFIGS.ELITE;
        else if (profile.includes('PRO')) config = TIER_CONFIGS.PRO;
        else if (profile.includes('LITE')) config = TIER_CONFIGS.LITE;
        else {
          // Unrecognized profile
          set({ tierLimit: null, tierFeatures: null });
          return;
        }

        set({
          tierLimit: config.tier,
          tierFeatures: config.features,
          maxNodeCount: config.features.maxDevices,
          lastTierSyncAt: Date.now()
        });
      },

      setConnectedNodeCount: (count) => set({ connectedNodeCount: count }),
      
      setTierLimit: (tier) => {
        const configKey = tier?.toUpperCase() || 'LITE';
        const config = TIER_CONFIGS[configKey] || TIER_CONFIGS.LITE;
        set({ 
          tierLimit: tier,
          tierFeatures: config.features,
          lastTierSyncAt: Date.now()
        });
      },
      
      recordRtt: (rtt) => {
        const { rollingRtt } = get();
        const newRtt = [...rollingRtt, rtt].slice(-10); 
        const avgRtt = newRtt.length > 0 ? newRtt.reduce((a, b) => a + b, 0) / newRtt.length : 0;

        let signalQuality: SignalQuality = 'lost';
        if (avgRtt < 80) signalQuality = 'strong';
        else if (avgRtt < 300) signalQuality = 'weak';
        else signalQuality = 'lost';

        set({ rollingRtt: newRtt, signalQuality });
      },

      isFeatureAvailable: (feature) => {
        const { tierFeatures } = get();
        if (!tierFeatures) return false;
        return !!tierFeatures[feature];
      },

      isNodeLimitReached: () => {
        const { connectedNodeCount, maxNodeCount } = get();
        if (maxNodeCount === -1) return false;
        return connectedNodeCount >= maxNodeCount;
      }
    }),
    {
      name: 'bridge-status-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        tierLimit: state.tierLimit,
        tierFeatures: state.tierFeatures,
        lastTierSyncAt: state.lastTierSyncAt,
        connectedNodeCount: state.connectedNodeCount,
        maxNodeCount: state.maxNodeCount,
      }),
    }
  )
);
