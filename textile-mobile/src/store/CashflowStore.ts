import { create } from 'zustand';

export interface CashflowData {
  currentCash: string;
  inflows30d: string;
  outflows30d: string;
  netPosition: string;
  riskLevel: 'healthy' | 'warning' | 'critical';
  shortfallDate: string | null;
}

interface CashflowState extends CashflowData {
  setCashflowData: (data: Partial<CashflowData>) => void;
}

export const useCashflowStore = create<CashflowState>((set) => ({
  currentCash: '0',
  inflows30d: '0',
  outflows30d: '0',
  netPosition: '0',
  riskLevel: 'healthy',
  shortfallDate: null,
  setCashflowData: (data) => set((state) => ({ ...state, ...data })),
}));
