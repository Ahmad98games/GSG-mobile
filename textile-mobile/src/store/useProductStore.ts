import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Enterprise Resilience: State Machine Definitions
 * We use a strictly typed state machine to prevent illegal transitions
 */
export type AppMode = 'SCANNING' | 'QUANTITY_INPUT' | 'DASHBOARD' | 'LEDGER';
export type TransactionType = 'IN' | 'OUT' | 'DEBIT' | 'CREDIT' | null;

export interface Party {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface Transaction {
  id: string;
  party_id: string;
  amount: number;
  type: 'debit' | 'credit';
  category: string;
  description?: string;
  created_at: string;
}

interface ScannedBatch {
  id: string;
  item_name: string;
  item_category: string;
  current_gaz: number;
}

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string; // Encrypted string
  created_at: string;
  is_admin: boolean;
}

interface ProductState {
  // --- Persistent Session & Security ---
  isLinked: boolean;
  nodeId: string | null;
  lastInteraction: number; // Unix timestamp
  
  // --- Data & Mode ---
  currentBatch: ScannedBatch | null;
  mode: AppMode;
  transactionType: TransactionType;
  parties: Party[];
  transactions: Transaction[];
  messages: Message[];
  
  // --- Transient UI State ---
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  flashMessage: string | null;

  // --- Actions ---
  linkNode: (nodeId: string) => void;
  updateSession: () => void;
  setScannedBatch: (batch: ScannedBatch | null) => void;
  initiateTransaction: (type: TransactionType) => void;
  resetSession: () => void;
  setSubmitting: (flag: boolean) => void;
  setError: (msg: string | null) => void;
  setParties: (parties: Party[]) => void;
  addTransaction: (tx: Transaction) => void;
  setMode: (mode: AppMode) => void;
  addMessage: (msg: Message) => void;
  setFlashMessage: (msg: string | null) => void;
  checkSession: () => boolean; // returns true if valid
}

/**
 * Root Cause Protocol: 
 * Centralizing all state transitions ensures we never have 
 * dangling UI states or race conditions between scanning and saving.
 */
export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      // Initial States
      isLinked: false,
      nodeId: null,
      lastInteraction: 0,
      currentBatch: null,
      mode: 'SCANNING',
      transactionType: null,
      parties: [],
      transactions: [],
      messages: [],
      isLoading: false,
      isSubmitting: false,
      error: null,
      flashMessage: null,

      // State Transitions
      linkNode: (nodeId) => set({ 
        isLinked: true, 
        nodeId, 
        lastInteraction: Date.now(),
        error: null 
      }),

      updateSession: () => set({ lastInteraction: Date.now() }),

      checkSession: () => {
        const { lastInteraction, isLinked } = get();
        if (!isLinked) return false;
        const now = Date.now();
        const diff = now - lastInteraction;
        return diff < 12 * 60 * 60 * 1000; // 12 Hours TTL
      },

      setScannedBatch: (batch) => set({ 
        currentBatch: batch, 
        error: null,
        mode: 'SCANNING',
        lastInteraction: Date.now()
      }),

      initiateTransaction: (type) => {
        if (!get().checkSession()) {
          set({ error: 'SESSION EXPIRED - RE-AUTHENTICATE NODE' });
          return;
        }
        set({ 
          transactionType: type,
          mode: type ? 'QUANTITY_INPUT' : 'SCANNING',
          lastInteraction: Date.now()
        });
      },

      setSubmitting: (flag) => set({ isSubmitting: flag }),

      setError: (msg) => set({ error: msg }),

      setParties: (parties) => set({ parties }),

      addTransaction: (tx) => set((state) => ({
        transactions: [tx, ...state.transactions],
        parties: state.parties.map(p => 
          p.id === tx.party_id 
            ? { ...p, balance: tx.type === 'credit' ? p.balance + tx.amount : p.balance - tx.amount }
            : p
        ),
        lastInteraction: Date.now()
      })),

      addMessage: (msg) => set((state) => ({
        messages: [msg, ...state.messages].slice(0, 50) // Keep last 50
      })),

      setFlashMessage: (msg) => set({ flashMessage: msg }),

      setMode: (mode) => set({ mode }),

      resetSession: () => set({
        currentBatch: null,
        mode: 'SCANNING',
        transactionType: null,
        error: null,
        isSubmitting: false
      }),
    }),
    {
      name: 'gold-she-v2-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist clinical data for offline resilience
      partialize: (state) => ({
        parties: state.parties,
        transactions: state.transactions,
        isLinked: state.isLinked,
        nodeId: state.nodeId,
        lastInteraction: state.lastInteraction,
        mode: state.mode,
      }),
    }
  )
);
