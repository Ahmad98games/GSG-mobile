import { create } from 'zustand';

interface StatsState {
  scanCount: number;
  shiftStartTime: number;
  firstScanTime: number | null;
  efficiency: number;

  incrementScan: () => void;
  resetShift: () => void;
  checkShiftExpiraton: () => void;
}

export const useStatsStore = create<StatsState>((set, get) => ({
  scanCount: 0,
  shiftStartTime: Date.now(),
  firstScanTime: null,
  efficiency: 0,

  incrementScan: () => {
    const now = Date.now();
    const { firstScanTime, scanCount } = get();
    const newFirstScanTime = firstScanTime || now;
    const newCount = scanCount + 1;
    
    // Calculate Efficiency (Units Per Minute)
    const minutesElapsed = (now - newFirstScanTime) / 60000;
    const eff = minutesElapsed > 0.1 ? newCount / minutesElapsed : 0;

    set({ 
      scanCount: newCount, 
      firstScanTime: newFirstScanTime,
      efficiency: parseFloat(eff.toFixed(1))
    });
  },

  resetShift: () => set({
    scanCount: 0,
    shiftStartTime: Date.now(),
    firstScanTime: null,
    efficiency: 0
  }),

  checkShiftExpiraton: () => {
    const now = new Date();
    const lastReset = new Date(get().shiftStartTime);
    
    // Reset at midnight (00:00 local time)
    if (now.getDate() !== lastReset.getDate()) {
      get().resetShift();
    }
  }
}));
