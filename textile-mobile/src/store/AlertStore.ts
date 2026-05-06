import { create } from 'zustand';

interface AlertState {
  activeBreaches: any[];
  addBreach: (breach: any) => void;
  removeBreach: (timestamp: number) => void;
}

/**
 * ALERT STORE
 * Manages active security breaches and critical overlays.
 */
export const useAlertStore = create<AlertState>((set) => ({
  activeBreaches: [],
  addBreach: (breach) => set((state) => ({ 
    activeBreaches: [...state.activeBreaches.filter(b => b.timestamp !== breach.timestamp), breach] 
  })),
  removeBreach: (timestamp) => set((state) => ({ 
    activeBreaches: state.activeBreaches.filter((b) => b.timestamp !== timestamp) 
  })),
}));
