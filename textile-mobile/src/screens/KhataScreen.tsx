import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useBridgeStatusStore } from '../stores/BridgeStatusStore'
import { DatabaseGuard } from '../services/DatabaseGuard'
import { getKhataPermissions } from '../services/KhataRoleFilter'
import { KhataLedgerEngine, type KhataEntry } from '../services/KhataLedgerEngine'
import { Lock, ShieldAlert, DollarSign, Wallet, FileText, CheckCircle2, ShoppingCart } from 'lucide-react-native'

export function KhataScreen() {
  const { user } = useBridgeStatusStore()
  const role = user.role.toUpperCase()
  const permissions = getKhataPermissions(role)

  const [activeTab, setActiveTab] = useState<string>('default')
  const [partyId, setPartyId] = useState('party_al_hameed')
  const [partyName, setPartyName] = useState('Al-Hameed Textile')
  const [deductAmount, setDeductAmount] = useState('100000')
  const [description, setDescription] = useState('Yarn Supply Settlement')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ledgerItems, setLedgerItems] = useState<KhataEntry[]>([])

  useEffect(() => {
    // Set default active tab based on role permissions
    if (permissions.canViewPartyLedger) {
      setActiveTab('party_ledger')
    } else if (permissions.canViewKarigarPeshgi) {
      setActiveTab('peshgi_transactions')
    } else if (permissions.canViewPosCounterBilling) {
      setActiveTab('pos_counter')
    }
    loadData()
  }, [role])

  const loadData = async () => {
    // Attempt to query ledger_entries using DatabaseGuard
    const entries = await DatabaseGuard.guardQuery<KhataEntry>(
      'ledger_entries',
      async () => {
        return KhataLedgerEngine.getEntriesForParty(partyId)
      }
    )
    setLedgerItems(entries)
  }

  const handleDeductTransaction = async () => {
    const amountNum = parseFloat(deductAmount)
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid deduction amount.')
      return
    }

    setIsSubmitting(true)
    try {
      // Create transaction via KhataLedgerEngine (Offline deduction flow)
      const entry = await KhataLedgerEngine.addEntry({
        partyId,
        entryType: 'debit',
        amount: amountNum,
        description,
        reference: `REF-${Date.now().toString().slice(-6)}`,
        createdBy: user.name,
        createdByRole: role,
      })

      Alert.alert(
        'Transaction Recorded',
        `Successfully recorded PKR ${amountNum.toLocaleString()} debit for ${partyName}.\nIdempotency Key: ${entry.idempotencyKey}`
      )
      setDeductAmount('')
      loadData()
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to record entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* SECURITY ROLE BANNER */}
      <View style={styles.roleHeaderCard}>
        <View style={styles.roleTagRow}>
          <Text style={styles.roleLabel}>ACTIVE SECURITY CONTEXT</Text>
          <View style={styles.roleTag}>
            <Text style={styles.roleTagText}>{role}</Text>
          </View>
        </View>

        {!permissions.canViewPartyLedger && (
          <View style={styles.securityAlertBox}>
            <ShieldAlert size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={styles.securityAlertText}>
              Party Financial Ledger (ledger_entries) is BLOCKED for {role} role.
            </Text>
          </View>
        )}
      </View>

      {/* ROLE ADAPTIVE NAVIGATION TABS */}
      <View style={styles.tabBar}>
        {permissions.canViewPartyLedger && (
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'party_ledger' && styles.activeTabButton]}
            onPress={() => setActiveTab('party_ledger')}
          >
            <Wallet size={16} color={activeTab === 'party_ledger' ? '#60A5FA' : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === 'party_ledger' && styles.activeTabText]}>
              Party Ledger
            </Text>
          </TouchableOpacity>
        )}

        {permissions.canViewKarigarPeshgi && (
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'peshgi_transactions' && styles.activeTabButton]}
            onPress={() => setActiveTab('peshgi_transactions')}
          >
            <DollarSign size={16} color={activeTab === 'peshgi_transactions' ? '#60A5FA' : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === 'peshgi_transactions' && styles.activeTabText]}>
              Karigar Peshgi
            </Text>
          </TouchableOpacity>
        )}

        {permissions.canViewPosCounterBilling && (
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'pos_counter' && styles.activeTabButton]}
            onPress={() => setActiveTab('pos_counter')}
          >
            <ShoppingCart size={16} color={activeTab === 'pos_counter' ? '#60A5FA' : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === 'pos_counter' && styles.activeTabText]}>
              POS Billing
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* VIEW CONTENT BY ACTIVE TAB */}

      {/* 1. SUPERVISOR VIEW — KARIGAR PESHGI & PRODUCTION LOGS */}
      {role === 'SUPERVISOR' && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Supervisor Controls: Karigar Advances & Wages</Text>

          {/* DEDUCTION FORM */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Record Karigar Peshgi (Advance Deduction)</Text>
            
            <Text style={styles.inputLabel}>Party / Karigar Name</Text>
            <TextInput
              style={styles.input}
              value={partyName}
              onChangeText={setPartyName}
              placeholder="e.g. Al-Hameed Textile / Karigar"
              placeholderTextColor="#64748B"
            />

            <Text style={styles.inputLabel}>Deduction Amount (PKR)</Text>
            <TextInput
              style={styles.input}
              value={deductAmount}
              onChangeText={setDeductAmount}
              keyboardType="numeric"
              placeholder="100000"
              placeholderTextColor="#64748B"
            />

            <Text style={styles.inputLabel}>Description / Reference</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Advance adjustment / Piece wage deduction"
              placeholderTextColor="#64748B"
            />

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeductTransaction}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.actionButtonText}>Execute Offline Deduction (PKR {deductAmount || '0'})</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>Worker Piece-Rate Wages & Peshgi Log</Text>
            <Text style={styles.infoCardBody}>
              Peshgi transactions are stored locally with 0ms latency in peshgi_transactions.
              Financial party ledgers (ledger_entries) remain restricted.
            </Text>
          </View>
        </View>
      )}

      {/* 2. CASHIER VIEW — POS COUNTER BILLING & CLEARANCE */}
      {role === 'CASHIER' && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Cashier Terminal: Counter Billing & Clearances</Text>
          
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Customer Credit Balance Clearance</Text>
            <Text style={styles.inputLabel}>Customer Account</Text>
            <TextInput
              style={styles.input}
              value={partyName}
              onChangeText={setPartyName}
              placeholder="Walk-in / Customer Name"
              placeholderTextColor="#64748B"
            />

            <Text style={styles.inputLabel}>Payment Received (PKR)</Text>
            <TextInput
              style={styles.input}
              value={deductAmount}
              onChangeText={setDeductAmount}
              keyboardType="numeric"
              placeholder="5000"
              placeholderTextColor="#64748B"
            />

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#10B981' }]}
              onPress={handleDeductTransaction}
              disabled={isSubmitting}
            >
              <Text style={styles.actionButtonText}>Clear Credit Balance</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.securityAlertBox}>
            <Lock size={16} color="#F59E0B" style={{ marginRight: 6 }} />
            <Text style={styles.securityAlertText}>
              Supplier ledgers and financial profit statements are hidden for Cashier.
            </Text>
          </View>
        </View>
      )}

      {/* 3. OWNER / MANAGER / ACCOUNTANT VIEW — FULL PARTY LEDGER & P&L */}
      {(role === 'OWNER' || role === 'MANAGER' || role === 'ACCOUNTANT') && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Executive Khata: Full Party Ledger & P&L</Text>

          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Record Party Debit / Credit Entry</Text>
            
            <Text style={styles.inputLabel}>Party Name</Text>
            <TextInput
              style={styles.input}
              value={partyName}
              onChangeText={setPartyName}
              placeholder="Party Name"
              placeholderTextColor="#64748B"
            />

            <Text style={styles.inputLabel}>Amount (PKR)</Text>
            <TextInput
              style={styles.input}
              value={deductAmount}
              onChangeText={setDeductAmount}
              keyboardType="numeric"
              placeholder="100000"
              placeholderTextColor="#64748B"
            />

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDeductTransaction}
              disabled={isSubmitting}
            >
              <Text style={styles.actionButtonText}>Post Ledger Entry</Text>
            </TouchableOpacity>
          </View>

          {/* LEDGER ENTRIES LIST */}
          <Text style={styles.subsectionTitle}>Party Ledger Stream (ledger_entries)</Text>
          {ledgerItems.length === 0 ? (
            <Text style={styles.emptyText}>No local ledger entries found for this party.</Text>
          ) : (
            ledgerItems.map((item) => (
              <View key={item.id} style={styles.ledgerCard}>
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerParty}>{item.description}</Text>
                  <Text
                    style={[
                      styles.ledgerAmount,
                      item.entryType === 'debit' ? { color: '#EF4444' } : { color: '#10B981' },
                    ]}
                  >
                    {item.entryType === 'debit' ? '- ' : '+ '}PKR {item.amount.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.ledgerMetaRow}>
                  <Text style={styles.ledgerMeta}>Ref: {item.reference}</Text>
                  <View style={styles.syncBadge}>
                    <CheckCircle2 size={12} color={item.synced ? '#10B981' : '#F59E0B'} />
                    <Text style={[styles.syncText, { color: item.synced ? '#10B981' : '#F59E0B' }]}>
                      {item.synced ? 'Synced to Hub' : 'Enqueued (Offline)'}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 16,
  },
  roleHeaderCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  roleTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  roleLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  roleTag: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleTagText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '800',
  },
  securityAlertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  securityAlertText: {
    color: '#FCA5A5',
    fontSize: 12,
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#0F172A',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#F8FAFC',
  },
  sectionContainer: {
    gap: 14,
  },
  sectionTitle: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '700',
  },
  subsectionTitle: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  formCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  formTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#0F172A',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#F8FAFC',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoCardTitle: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '600',
  },
  infoCardBody: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  ledgerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ledgerParty: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
  },
  ledgerAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  ledgerMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  ledgerMeta: {
    color: '#64748B',
    fontSize: 11,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  syncText: {
    fontSize: 11,
    fontWeight: '600',
  },
})
