import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Branch {
  branch_id: string;
  name: string;
  city: string;
  is_hq: boolean;
  user_role_at_branch: string;
}

interface BranchState {
  branches: Branch[];
  currentBranchId: string | null;
  setBranches: (branches: Branch[]) => void;
  setCurrentBranch: (branchId: string) => void;
  clearBranches: () => void;
}

/**
 * BRANCH STORE
 * Manages multi-branch context and isolation.
 * Persisted to allow offline context retention.
 */
export const useBranchStore = create<BranchState>()(
  persist(
    (set) => ({
      branches: [],
      currentBranchId: null,
      setBranches: (branches) => set({ branches }),
      setCurrentBranch: (branchId) => set({ currentBranchId: branchId }),
      clearBranches: () => set({ branches: [], currentBranchId: null }),
    }),
    {
      name: 'omnora-branch-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
