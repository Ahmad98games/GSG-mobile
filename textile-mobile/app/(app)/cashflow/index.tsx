import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Stack } from 'expo-router';
import { useCashflowStore } from '../../../src/store/CashflowStore';
import { usePersona } from '../../../src/hooks/usePersona';
import { NspService } from '../../../src/services/NspService';
import { LucideArrowUpRight, LucideArrowDownRight, LucideInfo } from 'lucide-react-native';

const CashflowDetailScreen = () => {
  const { t, fmt } = usePersona();
  const cashflow = useCashflowStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      await NspService.send({
        cashflow_req: {
          node_id: 'MOBILE_CLIENT', // Hub fills this
          days_window: 30
        }
      });
    } catch (e) {
      console.error('[Cashflow] FETCH_ERROR:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const PositionRow = ({ label, amount, type }: { label: string, amount: string, type: 'in' | 'out' | 'net' }) => {
    const isPositive = parseFloat(amount) >= 0;
    const color = type === 'in' ? '#10b981' : (type === 'out' ? '#ef4444' : (isPositive ? '#10b981' : '#ef4444'));

    return (
      <View style={styles.row}>
        <View style={styles.rowLabelContainer}>
          {type === 'in' ? <LucideArrowUpRight size={18} color="#10b981" /> : 
           type === 'out' ? <LucideArrowDownRight size={18} color="#ef4444" /> : 
           <LucideInfo size={18} color="#9ca3af" />}
          <Text style={styles.rowLabel}>{label}</Text>
        </View>
        <Text style={[styles.rowAmount, { color }]}>{fmt(amount)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: t('cashflow.detail_title') || 'Cash Intelligence',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
        }} 
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor="#fbbf24" />
        }
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{t('cashflow.available_balance') || 'Available Balance'}</Text>
          <Text style={styles.summaryAmount}>{fmt(cashflow.currentCash)}</Text>
          <View style={[styles.riskBadge, { backgroundColor: cashflow.riskLevel === 'healthy' ? '#064e3b' : '#7f1d1d' }]}>
            <Text style={[styles.riskText, { color: cashflow.riskLevel === 'healthy' ? '#10b981' : '#ef4444' }]}>
              {cashflow.riskLevel.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('cashflow.30d_outlook') || '30-Day Outlook'}</Text>
          <PositionRow label={t('cashflow.inflows') || 'Total Inflows'} amount={cashflow.inflows30d} type="in" />
          <PositionRow label={t('cashflow.outflows') || 'Total Outflows'} amount={cashflow.outflows30d} type="out" />
          <View style={styles.divider} />
          <PositionRow label={t('cashflow.net_change') || 'Net Position'} amount={cashflow.netPosition} type="net" />
        </View>

        {cashflow.shortfallDate && (
          <View style={styles.warningBox}>
            <LucideInfo size={20} color="#fbbf24" />
            <View style={styles.warningContent}>
              <Text style={styles.warningTitle}>{t('cashflow.shortfall_title') || 'Liquidity Risk'}</Text>
              <Text style={styles.warningBody}>
                {t('cashflow.shortfall_msg') || 'Potential cash shortfall detected around'} {cashflow.shortfallDate}.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.placeholderChart}>
          <Text style={styles.placeholderText}>
            [ {t('cashflow.chart_placeholder') || 'Visual Analytics (Victory Native) Toggled Off'} ]
          </Text>
          <Text style={styles.placeholderSub}>
            {t('cashflow.chart_sub') || 'Detailed trend visualization is available on Hub Desktop'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  summaryLabel: {
    color: '#9ca3af',
    fontSize: 16,
    marginBottom: 8,
  },
  summaryAmount: {
    color: '#fbbf24',
    fontSize: 40,
    fontFamily: 'JetBrainsMono_700Bold',
    marginBottom: 16,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowLabel: {
    color: '#d1d5db',
    fontSize: 16,
  },
  rowAmount: {
    fontSize: 16,
    fontFamily: 'JetBrainsMono_700Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#374151',
    marginVertical: 8,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#451a03',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#78350f',
    marginBottom: 24,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  warningBody: {
    color: '#fde68a',
    fontSize: 13,
    lineHeight: 18,
  },
  placeholderChart: {
    height: 150,
    backgroundColor: '#1f2937',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#4b5563',
    padding: 20,
  },
  placeholderText: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  placeholderSub: {
    color: '#6b7280',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CashflowDetailScreen;
