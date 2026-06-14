import { create } from 'zustand';

export interface AnalyticsData {
  todayRevenue: string;
  outstandingTotal: string;
  activeKarigars: number;
  lowStockCount: number;
  anomalyCount: number;
  lastUpdated: number;
}

interface AnalyticsState extends AnalyticsData {
  setAnalyticsData: (data: Partial<AnalyticsData>) => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  todayRevenue: '0',
  outstandingTotal: '0',
  activeKarigars: 0,
  lowStockCount: 0,
  anomalyCount: 0,
  lastUpdated: Date.now(),
  setAnalyticsData: (data) => set((state) => ({ ...state, ...data })),
}));
