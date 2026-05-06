import { create } from 'zustand';

// 1. Interface mein function define karna zaroori hai
export interface DiagnosticsState {
  encryptionTime: number;
  cpuLoad: number;
  memoryUsage: number;
  setEncryptionTime: (time: number) => void;
  updateSystemMetrics: (cpu: number, mem: number) => void;
}

// 2. Store ka actual logic
export const useDiagnosticStore = create<DiagnosticsState>((set) => ({
  encryptionTime: 0,
  cpuLoad: 0,
  memoryUsage: 0,

  // Ye raha wo function jo missing tha
  setEncryptionTime: (time) => set({ encryptionTime: time }),

  updateSystemMetrics: (cpu, mem) => set({ cpuLoad: cpu, memoryUsage: mem }),
}));