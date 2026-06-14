import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  RefreshControl, 
  TouchableOpacity 
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useAnalyticsStore } from '../../../src/store/AnalyticsStore';
import { useCashflowStore } from '../../../src/store/CashflowStore';
import { usePersona } from '../../../src/hooks/usePersona';
import { NspService } from '../../../src/services/NspService';
import { MobileFeatureGate } from '../../../src/components/MobileFeatureGate';
import { 
  LucideTrendingUp, 
  LucideTrendingDown, 
  LucideAlertCircle, 
  LucidePackage, 
  LucideChevronRight 
} from 'lucide-react-native';

const AnalyticsScreen = () => {
  const router = useRouter();
  const { t, fmt } = usePersona();
  const analytics = useAnalyticsStore();
  const cashflow = useCashflowStore();
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        NspService.send({ analytics_req: { node_id: 'MOBILE_CLIENT' } }),
        NspService.send({ cashflow_req: { node_id: 'MOBILE_CLIENT', days_window: 30 } })
      ]);
    } catch (e) {
      console.error('[Analytics] FETCH_ERROR:', e);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const AnalyticsCard = ({ title, amount, subtext, type, onPress }: any) => {
    const isGold = type === 'revenue';
    const isRed = type === 'receivables' && parseFloat(amount) > 1000000; // Example threshold
    
    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress} 
        activeOpacity={onPress ? 0.7 : 1}
      >
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={[
          styles.cardAmount, 
          isGold && { color: '#fbbf24' },
          isRed && { color: '#ef4444' }
        ]}>
          {fmt(amount)}
        </Text>
        {subtext && <Text style={styles.cardSub}>{subtext}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <MobileFeatureGate feature="intelligence">
      <View style={styles.container}>
        <Stack.Screen options={{ 
          title: t('analytics.title') || 'Executive Insights',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff' 
        }} />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor="#fbbf24" />
        }
      >
        <AnalyticsCard 
          title={t('analytics.today_revenue') || "Today's Revenue"}
          amount={analytics.todayRevenue}
          subtext={t('analytics.vs_yesterday') || "+12% vs yesterday"}
          type="revenue"
        />

        <AnalyticsCard 
          title={t('analytics.outstanding') || "Outstanding Receivables"}
          amount={analytics.outstandingTotal}
          subtext={t('analytics.overdue_count') || '4 invoices overdue'}
          type="receivables"
          onPress={() => router.push('/finance/receivables')}
        />

        <AnalyticsCard 
          title={t('analytics.cash_position') || "Total Cash Position"}
          amount={cashflow.currentCash}
          subtext={cashflow.riskLevel.toUpperCase()}
          type="cash"
          onPress={() => router.push('/cashflow')}
        />

        <View style={styles.alertsRow}>
          {analytics.anomalyCount > 0 && (
            <TouchableOpacity 
              style={[styles.pill, styles.pillRed]}
              onPress={() => router.push('/notifications')}
            >
              <LucideAlertCircle size={16} color="#fff" />
              <Text style={styles.pillText}>{analytics.anomalyCount} anomalies detected</Text>
            </TouchableOpacity>
          )}

          {analytics.lowStockCount > 0 && (
            <TouchableOpacity 
              style={[styles.pill, styles.pillAmber]}
              onPress={() => router.push('/stock')}
            >
              <LucidePackage size={16} color="#fff" />
              <Text style={styles.pillText}>{analytics.lowStockCount} items low stock</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.lastUpdated}>
          {t('common.last_updated') || 'Last updated'}: {new Date(analytics.lastUpdated).toLocaleTimeString()}
        </Text>
      </ScrollView>
    </View>
  </MobileFeatureGate>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardTitle: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardAmount: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'JetBrainsMono_700Bold',
    marginBottom: 8,
  },
  cardSub: {
    color: '#6b7280',
    fontSize: 13,
  },
  alertsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    flex: 1,
    minWidth: '45%',
  },
  pillRed: {
    backgroundColor: '#7f1d1d',
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  pillAmber: {
    backgroundColor: '#78350f',
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  pillText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  lastUpdated: {
    color: '#4b5563',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },
});

export default AnalyticsScreen;
