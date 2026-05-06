import { create } from 'zustand';

interface TelemetryPoint {
  timestamp: number;
  cpu_temp: number;
  cpu_load: number;
  ram_usage: number;
  yarn_tension: number;
  loom_speed: number;
  vibration_index: number;
}

interface DiagnosticsState {
  packetSizes: number[];
  encLatencies: number[];
  temperature: number;
  telemetryHistory: TelemetryPoint[];
  queueDepth: { memory: number; sqlite: number };
  syncOffset: number;
  tcpState: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING';
  lastAck: number;
  isLowBatteryMode: boolean;

  addPacketSize: (size: number) => void;
  addEncLatency: (ms: number) => void;
  addTelemetry: (point: TelemetryPoint) => void;
  setTemperature: (temp: number) => void;
  updateQueueDepth: (memory: number, sqlite: number) => void;
  setSyncOffset: (offset: number) => void;
  setTcpState: (state: 'CONNECTED' | 'DISCONNECTED' | 'SYNCING') => void;
  setLastAck: (ts: number) => void;
  setLowBatteryMode: (mode: boolean) => void;
}

const ROLLING_LIMIT = 50;

export const useDiagnosticStore = create<DiagnosticsState>((set) => ({
  packetSizes: [],
  encLatencies: [],
  temperature: 0,
  telemetryHistory: [],
  queueDepth: { memory: 0, sqlite: 0 },
  syncOffset: 0,
  tcpState: 'DISCONNECTED',
  lastAck: 0,
  isLowBatteryMode: false,

  addPacketSize: (size) => set((state) => ({
    packetSizes: [size, ...state.packetSizes].slice(0, ROLLING_LIMIT)
  })),

  addEncLatency: (ms) => set((state) => ({
    encLatencies: [ms, ...state.encLatencies].slice(0, ROLLING_LIMIT)
  })),

  addTelemetry: (point) => set((state) => ({
    telemetryHistory: [...state.telemetryHistory, point].slice(-ROLLING_LIMIT),
    temperature: point.cpu_temp
  })),

  setTemperature: (temp) => set({ temperature: temp }),
  updateQueueDepth: (memory, sqlite) => set({ queueDepth: { memory, sqlite } }),
  setSyncOffset: (offset) => set({ syncOffset: offset }),
  setTcpState: (state) => set({ tcpState: state }),
  setLastAck: (ts) => set({ lastAck: ts }),
  setLowBatteryMode: (mode) => set({ isLowBatteryMode: mode }),
}));
