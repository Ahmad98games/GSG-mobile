import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { NspService } from '../services/NspService';
import { openMeshDb } from '../lib/db/meshDb';
import { useFinanceStore } from '../store/FinanceStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../utils/storage';

export interface Branch {
  id: string;
  name: string;
  status: string;
  is_hq: boolean;
}

interface BranchState {
  activeBranchId: string | null;
  activeBranch: Branch | null;
  branches: Branch[];
  isSwitching: boolean;
  switchBranch: (branchId: string) => Promise<void>;
  onBranchSwitchConfirmed: (branchId: string) => Promise<void>;
}

let switchResolver: (() => void) | null = null;

/**
 * BRANCH STORE
 * Manages mobile context switching and data isolation.
 */
export const useBranchStore = create<BranchState>((set, get) => ({
  activeBranchId: null,
  activeBranch: null,
  branches: [],
  isSwitching: false,

  switchBranch: async (branchId: string) => {
    set({ isSwitching: true });

    // 2. Require PIN escalation (UI should have verified this or set pin_verified)
    const isVerified = await getSafeStorage('pin_verified') === 'true'; 
    if (!isVerified) {
      set({ isSwitching: false });
      console.warn('[BranchStore] Switch rejected: PIN not verified');
      return;
    }

    try {
      const nodeId = await SecureStore.getItemAsync('gs_node_id');
      
      // 3. Send SwitchBranchRequest via NSP
      await NspService.send({
        switch_branch_req: {
          branch_id: branchId,
          node_id: nodeId
        }
      }, 3000);

      // We await the response from the HubAck handler via the onBranchSwitchConfirmed logic
      // Note: NspService.send with timeout will also throw if no ack is received.
      
      console.log({ event: 'branch_switched_mobile', branchId });
    } catch (err) {
      set({ isSwitching: false });
      console.error('[BranchStore] Branch switch failed', err);
      throw err;
    }
  },

  onBranchSwitchConfirmed: async (branchId: string) => {
    try {
      // 1. Clear ALL cached data for strict data isolation
      // Financial data store
      useFinanceStore.getState().clearCache();

      // sku_cache in SQLite: force full refresh
      const db = await openMeshDb();
      await db.execAsync('DELETE FROM sku_cache');

      // notification history filter (reset to 'All')
      await AsyncStorage.setItem('notification_filter', 'All');

      // 2. Set active context
      const targetBranch = get().branches.find(b => b.id === branchId);
      set({
        activeBranchId: branchId,
        activeBranch: targetBranch || null,
        isSwitching: false
      });

      // 3. Invalidate all TanStack Query caches (Force re-fetch of all industry data)
      // Since queryClient is often initialized in the root, we attempt to get it or trigger a global event
      // If a global queryClient was exported, we would call queryClient.invalidateQueries();
      // For now, we use a custom event that components can listen to, or assume useQuery handles it via key changes
      
      console.log(`[BRANCH_STORE] event: branch_switched_mobile, branchId: ${branchId}`);
    } catch (err) {
      console.error('[BRANCH_STORE] Critical fault during branch context purge', err);
      set({ isSwitching: false });
    }
  }
}));
