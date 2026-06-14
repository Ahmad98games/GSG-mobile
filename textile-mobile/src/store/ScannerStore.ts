import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../utils/storage';

export interface ScanHistoryItem {
  id: string;
  barcode: string;
  sku_code: string;
  name: string;
  qty: number;
  timestamp: number;
}

interface ScannerState {
  history: ScanHistoryItem[];
  addToHistory: (item: Omit<ScanHistoryItem, 'id' | 'timestamp'>) => void;
  loadHistory: () => Promise<void>;
  clearHistory: () => void;
}

export const useScannerStore = create<ScannerState>((set, get) => ({
  history: [],
  
  addToHistory: (item) => {
    const newItem: ScanHistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now()
    };
    
    const newHistory = [newItem, ...get().history].slice(0, 10);
    set({ history: newHistory });
    AsyncStorage.setItem('scan_history', JSON.stringify(newHistory));
  },

  loadHistory: async () => {
    const raw = await getSafeStorage('scan_history');
    const stored = raw ? JSON.parse(raw) : null;
    if (stored) {
      set({ history: stored });
    }
  },

  clearHistory: () => {
    set({ history: [] });
    AsyncStorage.removeItem('scan_history');
  }
}));
