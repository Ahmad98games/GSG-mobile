import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Module 6: Offline Sync Engine
 * Robust operation queue for intermittent warehouse connectivity.
 */

export interface SyncOperation {
  id: string;
  operation_type: 'STOCK_MOVEMENT_IN' | 'STOCK_MOVEMENT_OUT' | 'JOB_AUDIT_SUBMIT' | 'TASK_ACKNOWLEDGE';
  payload: any;
  created_at: string;
  retry_count: number;
  status: 'PENDING' | 'SYNCING' | 'FAILED';
}

interface SyncState {
  queue: SyncOperation[];
  addToQueue: (op: Omit<SyncOperation, 'id' | 'created_at' | 'retry_count' | 'status'>) => void;
  removeFromQueue: (id: string) => void;
  updateStatus: (id: string, status: SyncOperation['status'], error?: string) => void;
  incrementRetry: (id: string) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      queue: [],

      addToQueue: (op) => set((state) => ({
        queue: [...state.queue, {
          ...op,
          id: Math.random().toString(36).substr(2, 9),
          created_at: new Date().toISOString(),
          retry_count: 0,
          status: 'PENDING'
        }]
      })),

      removeFromQueue: (id) => set((state) => ({
        queue: state.queue.filter(o => o.id !== id)
      })),

      updateStatus: (id, status) => set((state) => ({
        queue: state.queue.map(o => o.id === id ? { ...o, status } : o)
      })),

      incrementRetry: (id) => set((state) => ({
        queue: state.queue.map(o => o.id === id ? { ...o, retry_count: o.retry_count + 1 } : o)
      })),
    }),
    {
      name: 'industrial-sync-queue',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
