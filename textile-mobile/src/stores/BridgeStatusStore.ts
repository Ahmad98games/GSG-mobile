import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export enum ConnectionState {
  CONNECTED_LOCAL = 'CONNECTED_LOCAL',
  CONNECTED_REMOTE = 'CONNECTED_REMOTE',
  CONNECTING = 'CONNECTING',
  OFFLINE_QUEUED = 'OFFLINE_QUEUED',
  OFFLINE_EMPTY = 'OFFLINE_EMPTY',
}

export interface HubAckPayload {
  businessName: string
  businessId: string
  role: 'owner' | 'manager' | 'accountant' | 'supervisor' | 'cashier'
  allowedTables: string[]
  blockedTables: string[]
  hubHwid: string
}

export interface UserProfile {
  name: string
  email: string
  role: 'OWNER' | 'SUPERVISOR' | 'CASHIER' | 'MANAGER' | 'ACCOUNTANT' | string
}

export function computeConnectionState(state: {
  connectionStatus: 'connecting' | 'connected' | 'offline' | 'error'
  connectionMethod: 'local' | 'tunnel' | 'supabase' | null
  hubOnline: boolean
  pendingCount: number
}): ConnectionState {
  if (state.connectionStatus === 'connecting') {
    return ConnectionState.CONNECTING
  }
  if (state.hubOnline || state.connectionStatus === 'connected') {
    if (state.connectionMethod === 'tunnel') {
      return ConnectionState.CONNECTED_REMOTE
    }
    return ConnectionState.CONNECTED_LOCAL
  }
  if (state.pendingCount > 0) {
    return ConnectionState.OFFLINE_QUEUED
  }
  return ConnectionState.OFFLINE_EMPTY
}

interface BridgeState {
  hubOnline: boolean
  lastSeen: string | null
  syncStatus: 'synced' | 'syncing' | 'offline'
  connectionStatus: 'connecting' | 'connected' | 'offline' | 'error'
  connectionState: ConnectionState
  latency: number
  hubIp: string | null
  pairingError: string | null
  connectedDevices: number
  connectionMethod: 'local' | 'tunnel' | 'supabase' | null

  // User Profile & RBAC Hydration
  user: UserProfile
  allowedTables: string[]
  blockedTables: string[]
  hubAckPayload: HubAckPayload | null

  // Reactive sync counters — updated by ConnectionManager / OfflineSyncService
  pendingCount: number
  reconnectAttempt: number
  nextRetryAt: number | null   // Unix ms — when next reconnect fires

  businessId: string | null
  businessName: string
  industry: string
  city: string
  countryCode: string
  currency: string
  ownerPhone: string

  tier: 'lite' | 'pro' | 'elite' | 'trial'
  maxDevices: number
  isTrialActive: boolean
  trialDaysRemaining: number | null

  canViewFinance: boolean
  canViewIntelligence: boolean
  canAccessApi: boolean
  canUseAdvancedReports: boolean
  canMarkAttendance: boolean
  canLogProduction: boolean
  canGivePeshgi: boolean
  canViewFinancials: boolean
  canViewReports: boolean

  workerTerm: string
  workerTermPlural: string
  advanceTerm: string
  itemTerm: string

  setStatus: (s: Partial<BridgeState>) => void
  setConnectionMethod: (method: 'local' | 'tunnel' | 'supabase' | null) => void
  setConnectionStatus: (status: 'connecting' | 'connected' | 'offline' | 'error') => void
  setHubOnline: (online: boolean) => void
  setPendingCount: (count: number) => void
  setReconnectState: (attempt: number, nextRetryAt: number | null) => void
  setLatency: (ms: number) => void
  setUser: (u: Partial<UserProfile>) => void
  setHubAckPayload: (payload: HubAckPayload) => void
  reset: () => void
}

const DEFAULT_STATE = {
  hubOnline: false,
  lastSeen: null,
  syncStatus: 'offline' as const,
  connectionStatus: 'offline' as const,
  connectionState: ConnectionState.OFFLINE_EMPTY,
  latency: 0,
  hubIp: null,
  pairingError: null,
  connectedDevices: 0,
  connectionMethod: null,

  user: {
    name: 'Operator',
    email: 'operator@noxishub.com',
    role: 'OWNER',
  },
  allowedTables: [
    'ledger_entries',
    'peshgi_transactions',
    'parties',
    'karigar_logs',
    'piece_wages',
    'pos_orders',
    'customers',
    'suppliers',
  ],
  blockedTables: [],
  hubAckPayload: null,

  pendingCount: 0,
  reconnectAttempt: 0,
  nextRetryAt: null,

  businessId: null,
  businessName: 'My Factory',
  industry: 'textile',
  city: '',
  countryCode: 'PK',
  currency: 'PKR',
  ownerPhone: '',

  tier: 'lite' as const,
  maxDevices: 5,
  isTrialActive: false,
  trialDaysRemaining: null,

  canViewFinance: false,
  canViewIntelligence: false,
  canAccessApi: false,
  canUseAdvancedReports: false,
  canMarkAttendance: true,
  canLogProduction: true,
  canGivePeshgi: true,
  canViewFinancials: false,
  canViewReports: false,

  workerTerm: 'Karigar',
  workerTermPlural: 'Karigars',
  advanceTerm: 'Peshgi',
  itemTerm: 'Item',
}

export const useBridgeStatusStore = create<BridgeState>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,
      setStatus: (s) =>
        set((prev) => {
          const next = { ...prev, ...s }
          next.connectionState = computeConnectionState({
            connectionStatus: next.connectionStatus,
            connectionMethod: next.connectionMethod,
            hubOnline: next.hubOnline,
            pendingCount: next.pendingCount,
          })
          return next
        }),
      setConnectionMethod: (method) =>
        set((prev) => {
          const next = { ...prev, connectionMethod: method }
          next.connectionState = computeConnectionState({
            connectionStatus: next.connectionStatus,
            connectionMethod: next.connectionMethod,
            hubOnline: next.hubOnline,
            pendingCount: next.pendingCount,
          })
          return next
        }),
      setConnectionStatus: (status) =>
        set((prev) => {
          const next = { ...prev, connectionStatus: status }
          next.connectionState = computeConnectionState({
            connectionStatus: next.connectionStatus,
            connectionMethod: next.connectionMethod,
            hubOnline: next.hubOnline,
            pendingCount: next.pendingCount,
          })
          return next
        }),
      setHubOnline: (online) =>
        set((prev) => {
          const next = { ...prev, hubOnline: online }
          next.connectionState = computeConnectionState({
            connectionStatus: next.connectionStatus,
            connectionMethod: next.connectionMethod,
            hubOnline: next.hubOnline,
            pendingCount: next.pendingCount,
          })
          return next
        }),
      setPendingCount: (count) =>
        set((prev) => {
          const next = { ...prev, pendingCount: count }
          next.connectionState = computeConnectionState({
            connectionStatus: next.connectionStatus,
            connectionMethod: next.connectionMethod,
            hubOnline: next.hubOnline,
            pendingCount: next.pendingCount,
          })
          return next
        }),
      setReconnectState: (attempt, nextRetryAt) =>
        set((prev) => {
          const next = { ...prev, reconnectAttempt: attempt, nextRetryAt }
          next.connectionState = computeConnectionState({
            connectionStatus: next.connectionStatus,
            connectionMethod: next.connectionMethod,
            hubOnline: next.hubOnline,
            pendingCount: next.pendingCount,
          })
          return next
        }),
      setLatency: (ms) => set({ latency: ms }),
      setUser: (u) =>
        set((prev) => ({
          ...prev,
          user: { ...prev.user, ...u },
        })),
      setHubAckPayload: (payload) =>
        set((prev) => {
          const normalizedRole = (payload.role || 'owner').toUpperCase()
          return {
            ...prev,
            hubAckPayload: payload,
            businessName: payload.businessName || prev.businessName,
            businessId: payload.businessId || prev.businessId,
            allowedTables: payload.allowedTables || prev.allowedTables,
            blockedTables: payload.blockedTables || prev.blockedTables,
            user: {
              ...prev.user,
              role: normalizedRole,
            },
          }
        }),
      reset: () => set(DEFAULT_STATE),
    }),
    {
      name: 'noxis-bridge-status',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        businessId: state.businessId,
        businessName: state.businessName,
        industry: state.industry,
        city: state.city,
        countryCode: state.countryCode,
        currency: state.currency,
        ownerPhone: state.ownerPhone,
        tier: state.tier,
        maxDevices: state.maxDevices,
        workerTerm: state.workerTerm,
        workerTermPlural: state.workerTermPlural,
        advanceTerm: state.advanceTerm,
        itemTerm: state.itemTerm,
        canViewFinance: state.canViewFinance,
        canViewIntelligence: state.canViewIntelligence,
        canUseAdvancedReports: state.canUseAdvancedReports,
        canMarkAttendance: state.canMarkAttendance,
        canLogProduction: state.canLogProduction,
        canGivePeshgi: state.canGivePeshgi,
        canViewFinancials: state.canViewFinancials,
        canViewReports: state.canViewReports,
        user: state.user,
        allowedTables: state.allowedTables,
        blockedTables: state.blockedTables,
        hubAckPayload: state.hubAckPayload,
      }),
    }
  )
)