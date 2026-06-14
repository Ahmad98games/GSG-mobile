import { create } from 'zustand';

export interface KarigarRankItem {
  rank: number;
  karigarId: string;
  name: string;
  code: string;
  unitsProduced: number;
  qualityScore: number;
  efficiencyRate: string;
}

interface LeaderboardState {
  rankings: KarigarRankItem[];
  period: 'week' | 'month' | 'last_month';
  setRankings: (rankings: KarigarRankItem[]) => void;
  setPeriod: (period: 'week' | 'month' | 'last_month') => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  rankings: [],
  period: 'week',
  setRankings: (rankings) => set({ rankings }),
  setPeriod: (period) => set({ period }),
}));
