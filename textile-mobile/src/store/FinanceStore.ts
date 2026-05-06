import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LedgerEntry {
  entry_id: string;
  tx_ref: string;
  account_name: string;
  party_name: string;
  entry_type: 'debit' | 'credit';
  amount: string;
  description: string;
  posted_at: number;
}

export interface PartyBalance {
  party_id: string;
  name: string;
  current_balance: string;
  is_blocked: boolean;
  party_type: 'customer' | 'supplier' | 'both';
  overdue_days: number;
}

export interface InvoiceSummary {
  invoice_id: string;
  invoice_no: string;
  party_name: string;
  total: string;
  balance_due: string;
  status: string;
  issue_date: number;
  due_date: number;
}

interface FinanceState {
  ledgerEntries: LedgerEntry[];
  partyBalances: PartyBalance[];
  invoices: InvoiceSummary[];
  lastUpdated: number | null;
  setLedgerEntries: (entries: LedgerEntry[]) => void;
  setPartyBalances: (balances: PartyBalance[]) => void;
  setInvoices: (invoices: InvoiceSummary[]) => void;
  clearCache: () => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      ledgerEntries: [],
      partyBalances: [],
      invoices: [],
      lastUpdated: null,
      setLedgerEntries: (entries) => set({ ledgerEntries: entries, lastUpdated: Date.now() }),
      setPartyBalances: (balances) => set({ partyBalances: balances, lastUpdated: Date.now() }),
      setInvoices: (invoices) => set({ invoices: invoices, lastUpdated: Date.now() }),
      clearCache: () => set({ ledgerEntries: [], partyBalances: [], invoices: [], lastUpdated: null }),
    }),
    {
      name: 'omnora-finance-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
