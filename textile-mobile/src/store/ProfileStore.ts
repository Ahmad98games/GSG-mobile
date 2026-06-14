import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../utils/storage';

export type IndustryProfile = 'TEXTILE' | 'PHARMA' | 'LOGISTICS' | 'GENERAL' | 'AGRICULTURE' | 'WHOLESALE' | 'RICE_MILL';

interface ProfileState {
  activeProfile: IndustryProfile;
  uiManifest: any | null;
  isProfileLoaded: boolean;
  
  setProfile: (profile: IndustryProfile) => Promise<void>;
  loadPersistedProfile: () => Promise<void>;
  updateManifest: (manifest: any) => void;
}

/**
 * PROFILE STORE
 * Manages the "Chameleon" state of the node based on the Hub-assigned industry profile.
 */
export const useProfileStore = create<ProfileState>((set) => ({
  activeProfile: 'GENERAL',
  uiManifest: null,
  isProfileLoaded: false,

  setProfile: async (profile) => {
    console.log(`[ProfileStore] Switching to ${profile} profile.`);
    await AsyncStorage.setItem('gs_active_profile', profile);
    set({ activeProfile: profile });
  },

  loadPersistedProfile: async () => {
    try {
      const profile = await getSafeStorage('gs_active_profile') as IndustryProfile;
      if (profile && ['TEXTILE', 'PHARMA', 'LOGISTICS', 'GENERAL', 'AGRICULTURE', 'WHOLESALE', 'RICE_MILL'].includes(profile)) {
        set({ activeProfile: profile, isProfileLoaded: true });
      } else {
        set({ isProfileLoaded: true });
      }
    } catch (e) {
      set({ isProfileLoaded: true });
    }
  },

  updateManifest: (uiManifest) => set({ uiManifest })
}));
