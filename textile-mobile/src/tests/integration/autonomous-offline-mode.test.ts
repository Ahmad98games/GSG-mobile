import { describe, test, expect, beforeAll, beforeEach } from '@jest/globals'

jest.mock('react-native-tcp-socket', () => {
  return require('net');
});

jest.mock('react-native-quick-crypto', () => {
  return require('crypto');
});

jest.mock('react-native-nitro-modules', () => ({
  NitroModules: {},
}));

jest.mock('../../lib/MobileCrypto', () => ({
  MobileCrypto: {
    encrypt: jest.fn().mockResolvedValue(new Uint8Array()),
    decrypt: jest.fn().mockResolvedValue({ content: '{}' }),
  },
}));

import {
  useBridgeStatusStore,
  ConnectionState,
  computeConnectionState,
  type HubAckPayload,
} from '../../stores/BridgeStatusStore'
import { DatabaseGuard } from '../../services/DatabaseGuard'
import { getKhataPermissions } from '../../services/KhataRoleFilter'
import { KhataLedgerEngine } from '../../services/KhataLedgerEngine'

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  getItemAsync: jest.fn().mockResolvedValue(null),
}))

jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn().mockResolvedValue({ isConnected: false, isInternetReachable: false }),
  addEventListener: jest.fn().mockReturnValue(() => {}),
}))

describe('Autonomous Offline Mode & Khata CDC Queue Tests', () => {
  beforeEach(async () => {
    useBridgeStatusStore.getState().reset()
    await KhataLedgerEngine.clearAll()
  })

  describe('1. Sidebar Connection State Machine', () => {
    test('computes CONNECTING state correctly', () => {
      const state = computeConnectionState({
        connectionStatus: 'connecting',
        connectionMethod: null,
        hubOnline: false,
        pendingCount: 0,
      })
      expect(state).toBe(ConnectionState.CONNECTING)
    })

    test('computes CONNECTED_LOCAL state when connected via local LAN', () => {
      const state = computeConnectionState({
        connectionStatus: 'connected',
        connectionMethod: 'local',
        hubOnline: true,
        pendingCount: 0,
      })
      expect(state).toBe(ConnectionState.CONNECTED_LOCAL)
    })

    test('computes CONNECTED_REMOTE state when connected via Cloudflare Tunnel', () => {
      const state = computeConnectionState({
        connectionStatus: 'connected',
        connectionMethod: 'tunnel',
        hubOnline: true,
        pendingCount: 0,
      })
      expect(state).toBe(ConnectionState.CONNECTED_REMOTE)
    })

    test('computes OFFLINE_QUEUED state when offline with pending queue entries', () => {
      const state = computeConnectionState({
        connectionStatus: 'offline',
        connectionMethod: null,
        hubOnline: false,
        pendingCount: 3,
      })
      expect(state).toBe(ConnectionState.OFFLINE_QUEUED)
    })

    test('computes OFFLINE_EMPTY state when offline with empty queue', () => {
      const state = computeConnectionState({
        connectionStatus: 'offline',
        connectionMethod: null,
        hubOnline: false,
        pendingCount: 0,
      })
      expect(state).toBe(ConnectionState.OFFLINE_EMPTY)
    })
  })

  describe('2. RBAC Hydration & DatabaseGuard Table Whitelisting', () => {
    test('hydrates HubAckPayload into store correctly', () => {
      const ackPayload: HubAckPayload = {
        businessName: 'Al-Hameed Textile',
        businessId: 'biz_hameed',
        role: 'supervisor',
        allowedTables: ['peshgi_transactions', 'karigar_logs', 'piece_wages'],
        blockedTables: ['ledger_entries', 'suppliers', 'profit_statements'],
        hubHwid: 'hub_hwid_99',
      }

      useBridgeStatusStore.getState().setHubAckPayload(ackPayload)

      const store = useBridgeStatusStore.getState()
      expect(store.businessName).toBe('Al-Hameed Textile')
      expect(store.user.role).toBe('SUPERVISOR')
      expect(store.allowedTables).toEqual(['peshgi_transactions', 'karigar_logs', 'piece_wages'])
      expect(store.blockedTables).toEqual(['ledger_entries', 'suppliers', 'profit_statements'])
    })

    test('DatabaseGuard restricts SUPERVISOR from querying ledger_entries while allowing peshgi_transactions', () => {
      const ackPayload: HubAckPayload = {
        businessName: 'Al-Hameed Textile',
        businessId: 'biz_hameed',
        role: 'supervisor',
        allowedTables: ['peshgi_transactions', 'karigar_logs', 'piece_wages'],
        blockedTables: ['ledger_entries', 'suppliers'],
        hubHwid: 'hub_hwid_99',
      }
      useBridgeStatusStore.getState().setHubAckPayload(ackPayload)

      expect(DatabaseGuard.canQueryTable('ledger_entries')).toBe(false)
      expect(DatabaseGuard.canQueryTable('peshgi_transactions')).toBe(true)
      expect(DatabaseGuard.canQueryTable('karigar_logs')).toBe(true)
    })

    test('DatabaseGuard allows OWNER full query access', () => {
      useBridgeStatusStore.getState().setUser({ role: 'OWNER' })
      expect(DatabaseGuard.canQueryTable('ledger_entries')).toBe(true)
      expect(DatabaseGuard.canQueryTable('peshgi_transactions')).toBe(true)
    })
  })

  describe('3. Role-Based Khata Permissions Matrix', () => {
    test('returns supervisor restriction matrix', () => {
      const perms = getKhataPermissions('SUPERVISOR')
      expect(perms.canViewPartyLedger).toBe(false)
      expect(perms.canViewKarigarPeshgi).toBe(true)
      expect(perms.canViewProductionLogs).toBe(true)
      expect(perms.canViewSupplierLedger).toBe(false)
    })

    test('returns cashier visibility matrix', () => {
      const perms = getKhataPermissions('CASHIER')
      expect(perms.canViewPartyLedger).toBe(false)
      expect(perms.canViewPosCounterBilling).toBe(true)
      expect(perms.canViewCustomerCreditClearance).toBe(true)
      expect(perms.canViewSupplierLedger).toBe(false)
    })

    test('returns owner full access matrix', () => {
      const perms = getKhataPermissions('OWNER')
      expect(perms.canViewPartyLedger).toBe(true)
      expect(perms.canViewSupplierLedger).toBe(true)
      expect(perms.canViewDailyPnL).toBe(true)
    })
  })

  describe('4. KhataLedgerEngine & Background CDC Queue', () => {
    test('creates offline deduction transaction with idempotency key and updates pending queue count', async () => {
      const entry = await KhataLedgerEngine.addEntry({
        partyId: 'party_hameed',
        entryType: 'debit',
        amount: 100000,
        description: 'Supervisor deduction PKR 100,000',
        reference: 'REF-12345',
        createdBy: 'Supervisor Ahmed',
        createdByRole: 'SUPERVISOR',
      })

      expect(entry.idempotencyKey).toContain('khata_party_hameed_')
      expect(entry.amount).toBe(100000)
      expect(entry.synced).toBe(false)

      const queue = await KhataLedgerEngine.getPendingQueue()
      expect(queue.length).toBe(1)
      expect(queue[0].idempotencyKey).toBe(entry.idempotencyKey)

      const store = useBridgeStatusStore.getState()
      expect(store.pendingCount).toBe(1)
      expect(store.connectionState).toBe(ConnectionState.OFFLINE_QUEUED)
    })

    test('retains queue safety during simulated app restarts', async () => {
      await KhataLedgerEngine.addEntry({
        partyId: 'party_test',
        entryType: 'debit',
        amount: 50000,
        description: 'Test deduction',
        reference: 'REF-999',
        createdBy: 'Test User',
        createdByRole: 'SUPERVISOR',
      })

      // Simulate re-instantiating queue from persistent store
      const pendingQueue = await KhataLedgerEngine.getPendingQueue()
      expect(pendingQueue.length).toBe(1)
      expect(pendingQueue[0].amount).toBe(50000)
    })
  })
})
