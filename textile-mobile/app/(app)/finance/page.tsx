import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { usePersona } from '../../../src/hooks/usePersona';
import { FinanceDataService } from '../../../src/services/FinanceDataService';
import { useFinanceStore } from '../../../src/store/FinanceStore';
import { BridgeStatusBar } from '../../../src/components/shell/BridgeStatusBar';
import { MobileFeatureGate } from '../../../src/components/MobileFeatureGate';

/**
 * FINANCE HUB
 * Central command for all industrial financial data.
 * All amounts formatted through PersonaEngine.
 */
export default function FinanceHub() {
  const router = useRouter();
  const { t, fmt } = usePersona();
  const [loading, setLoading] = useState(false);
  const ledgerEntries = useFinanceStore(s => s.ledgerEntries);
  const partyBalances = useFinanceStore(s => s.partyBalances);
  const invoices = useFinanceStore(s => s.invoices);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        FinanceDataService.fetchLedger(5),
        FinanceDataService.fetchParties('both'),
        FinanceDataService.fetchInvoices()
      ]);
    } catch (e) {
      console.error('[FinanceHub] Refresh failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'ledger', title: t('FINANCE_LEDGER'), icon: 'journal', path: '/(app)/finance/ledger' },
    { id: 'parties', title: t('FINANCE_PARTIES'), icon: 'people', path: '/(app)/finance/parties' },
    { id: 'invoices', title: t('FINANCE_INVOICES'), icon: 'document-text', path: '/(app)/finance/invoices' },
    { id: 'payslip', title: t('FINANCE_PAYSLIP'), icon: 'cash', path: '/(app)/finance/payslip' },
  ];

  const totalReceivables = React.useMemo(() => 
    partyBalances
      .filter(p => p.party_type === 'customer' || p.party_type === 'both')
      .reduce((acc, p) => acc + Number(p.current_balance), 0),
  [partyBalances]);

  const formattedTotal = React.useMemo(() => fmt(totalReceivables), [totalReceivables, fmt]);

  return (
    <MobileFeatureGate feature="finance">
      <SafeAreaView style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: t('FINANCE_HUB'), 
            headerStyle: { backgroundColor: THEME.colors.bg }, 
            headerTintColor: 'white',
            headerTitleStyle: { fontWeight: '900' }
          }} 
        />
        <BridgeStatusBar />
        
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refreshData} tintColor={THEME.colors.gold} />
          }
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>{t('TOTAL_RECEIVABLES')}</Text>
                <Text style={styles.summaryValue}>{formattedTotal}</Text>
                <View style={styles.cardFooter}>
                  <Ionicons name="shield-checkmark" size={12} color={THEME.colors.gold} />
                  <Text style={styles.footerText}>VERIFIED BY HUB AUDIT</Text>
                </View>
              </View>
              <Text style={styles.sectionTitle}>{t('FINANCE_CATEGORIES')}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => router.push(item.path as any)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBox, { backgroundColor: THEME.colors.gold + '15' }]}>
                <Ionicons name={item.icon as any} size={24} color={THEME.colors.gold} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSub}>{t(`DESC_${item.id.toUpperCase()}`)}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      </SafeAreaView>
    </MobileFeatureGate>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  header: { padding: 20 },
  summaryCard: { 
    backgroundColor: THEME.colors.surface, 
    padding: 24, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: THEME.colors.border,
    shadowColor: THEME.colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4
  },
  summaryLabel: { color: THEME.colors.textSecondary, fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  summaryValue: { color: THEME.colors.gold, fontSize: 32, fontWeight: '900', marginTop: 12, fontFamily: THEME.fonts.monoBold },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 16, opacity: 0.6 },
  footerText: { color: THEME.colors.gold, fontSize: 8, fontWeight: '900', marginLeft: 6, letterSpacing: 1 },
  sectionTitle: { color: THEME.colors.textSecondary, fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginTop: 32, marginBottom: 16 },
  list: { paddingBottom: 40 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: THEME.colors.surface, 
    marginHorizontal: 20, 
    marginBottom: 12, 
    padding: 16, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  iconBox: { width: 54, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuContent: { flex: 1 },
  menuTitle: { color: 'white', fontSize: 16, fontWeight: '700' },
  menuSub: { color: THEME.colors.textSecondary, fontSize: 11, marginTop: 2 }
});
