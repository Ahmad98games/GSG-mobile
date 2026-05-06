import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import * as Device from 'expo-device';

export type NodeTier = 'LITE' | 'ELITE';
export type NodeRole = 'INWARD_DOCK' | 'DISPATCH_BAY' | 'PRODUCTION_FLOOR' | 'MANAGER_ROVING' | 'EXECUTIVE_ADMIN' | 'ACCOUNTANT';

interface AuthState {
  nodeId: string | null;
  hubIp: string | null;
  hubPort: number;
  isAuthenticated: boolean;
  session: Session | null;
  nodeTier: NodeTier;
  nodeRole: NodeRole | null;
  companyName: string;
  subscriptionActive: boolean;
  deviceId: string | null;
  isDeviceApproved: boolean;
  isBiometricAuthenticated: boolean;
  companyBranding: {
    logoUrl: string | null;
    primaryColor: string | null;
    specs: Record<string, any> | null;
  };

  setCredentials: (ip: string, port: number, nodeId: string, tier?: NodeTier, role?: NodeRole | null) => void;
  setAuthenticated: (status: boolean) => void;
  setSession: (session: Session | null) => void;
  setBranding: (branding: any) => void;
  setTier: (tier: NodeTier) => void;
  fetchSaaSProfile: () => Promise<void>;
  verifyDeviceBinding: () => Promise<boolean>;
  setBiometricStatus: (status: boolean) => void;
  logout: () => void;
  clearAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  nodeId: null,
  hubIp: null,
  hubPort: 7447,
  isAuthenticated: false,
  session: null,
  nodeTier: 'LITE',
  nodeRole: null,
  companyName: 'Omnora Labs',
  subscriptionActive: true,
  deviceId: null,
  isDeviceApproved: true,
  isBiometricAuthenticated: false,
  companyBranding: {
    logoUrl: null,
    primaryColor: null,
    specs: null,
  },

  setCredentials: (ip, port, nodeId, tier = 'LITE', role = null) => {
    AsyncStorage.setItem('gs_hub_ip', ip);
    AsyncStorage.setItem('gs_hub_port', port.toString());
    SecureStore.setItemAsync('gs_node_id', nodeId);
    SecureStore.setItemAsync('gs_node_tier', tier);
    if (role) SecureStore.setItemAsync('gs_node_role', role);
    
    set({ hubIp: ip, hubPort: port, nodeId, isAuthenticated: true, nodeTier: tier, nodeRole: role });
  },

  setAuthenticated: (status) => set({ isAuthenticated: status }),
  
  setSession: (session) => {
    set({ session, isAuthenticated: !!session });
    if (session) get().fetchSaaSProfile();
  },

  setBranding: (branding) => set({ companyBranding: branding }),
  
  fetchSaaSProfile: async () => {
    const { session } = get();
    if (!session) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('pricing_tier, company_name, subscription_active, device_id')
      .eq('id', session.user.id)
      .single();

    if (data && !error) {
      console.log(`[AuthStore] SaaS Profile synced: ${data.company_name} (${data.pricing_tier})`);
      const currentDeviceId = Device.osBuildId || Device.modelName || 'unknown_device';
      
      set({ 
        nodeTier: data.pricing_tier as NodeTier, 
        companyName: data.company_name,
        subscriptionActive: data.subscription_active ?? true,
        deviceId: currentDeviceId,
        isDeviceApproved: data.device_id ? data.device_id === currentDeviceId : true
      });

      // Auto-bind device for Elite if not set
      if (data.pricing_tier === 'ELITE' && !data.device_id) {
        await supabase
          .from('profiles')
          .update({ device_id: currentDeviceId })
          .eq('id', session.user.id);
      }
    }
  },

  verifyDeviceBinding: async () => {
    const { nodeTier, isDeviceApproved } = get();
    if (nodeTier === 'ELITE' && !isDeviceApproved) {
      console.warn('[Security] Elite Device ID mismatch detected!');
      return false;
    }
    return true;
  },

  setTier: (tier) => {
    SecureStore.setItemAsync('gs_node_tier', tier);
    set({ nodeTier: tier });
  },

  setBiometricStatus: (status) => set({ isBiometricAuthenticated: status }),


  logout: async () => {
    await supabase.auth.signOut();
    await (AsyncStorage as any).multiRemove(['gs_hub_ip', 'gs_hub_port']);
    await SecureStore.deleteItemAsync('gs_node_id');
    await SecureStore.deleteItemAsync('gs_node_tier');
    await SecureStore.deleteItemAsync('gs_node_role');
    
    set({ 
      hubIp: null, 
      hubPort: 7447, 
      nodeId: null, 
      isAuthenticated: false, 
      session: null,
      nodeTier: 'LITE', 
      nodeRole: null, 
      isBiometricAuthenticated: false,
      companyBranding: { logoUrl: null, primaryColor: null, specs: null }
    });
  },

  clearAuth: async () => {
    await (AsyncStorage as any).multiRemove(['gs_hub_ip', 'gs_hub_port']);
    await SecureStore.deleteItemAsync('gs_node_id');
    await SecureStore.deleteItemAsync('gs_node_tier');
    await SecureStore.deleteItemAsync('gs_node_role');
    set({ hubIp: null, hubPort: 7447, nodeId: null, isAuthenticated: false, nodeTier: 'LITE', nodeRole: null, isBiometricAuthenticated: false });
  }

}));

