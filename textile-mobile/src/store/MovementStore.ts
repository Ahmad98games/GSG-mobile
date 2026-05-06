import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * NOXIS PATHFINDER: MOVEMENT STORE
 * High-resiliency GPS log management for industrial dispatch.
 */

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  speed?: number;
  isSynced: boolean;
}

interface MovementState {
  currentLocation: LocationPoint | null;
  unsyncedLogs: LocationPoint[];
  
  // Actions
  updateLocation: (point: LocationPoint) => void;
  markAsSynced: (timestamp: number) => void;
  clearLogs: () => void;
}

export const useMovementStore = create<MovementState>()(
  persist(
    (set, get) => ({
      currentLocation: null,
      unsyncedLogs: [],

      updateLocation: (point) => set((state) => ({
        currentLocation: point,
        unsyncedLogs: point.isSynced ? state.unsyncedLogs : [...state.unsyncedLogs, point].slice(-1000) // Buffer last 1000 points
      })),

      markAsSynced: (timestamp) => set((state) => ({
        unsyncedLogs: state.unsyncedLogs.filter(l => l.timestamp !== timestamp)
      })),

      clearLogs: () => set({ unsyncedLogs: [] }),
    }),
    {
      name: 'noxis-movement-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ unsyncedLogs: state.unsyncedLogs }),
    }
  )
);
