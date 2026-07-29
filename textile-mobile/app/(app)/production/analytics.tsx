'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { supabase } from '../../../src/lib/supabase';
import { getSafeStorage } from '../../../src/utils/storage';
import { useAuthStore } from '../../../src/store/AuthStore';
import { THEME } from '../../../src/constants/theme';
import { useIndustryConfig } from '../../../src/hooks/useIndustryConfig';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { SkeletonRow } from '../../../src/components/ui/SkeletonRow';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LogData {
  units_produced: number;
  grade: string;
  log_date: string;
  karigar: {
    name: string;
  } | null;
}

export default function ProductionAnalyticsScreen() {
  const router = useRouter();
  const tConfig = useIndustryConfig();
  const currency = tConfig.currency;
  const fmt = tConfig.fmt;

  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    try {
      const session = useAuthStore.getState().session;
      let profileId = session?.user?.id;
      if (!profileId) {
        const profile = await getSafeStorage('noxis_profile', null);
        if (profile) {
          const parsed = JSON.parse(profile);
          profileId = parsed?.id;
        }
      }
      if (!profileId) return;

      const todayObj = new Date();
      const firstDayOfMonth = new Date(todayObj.getFullYear(), todayObj.getMonth(), 1).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('karigar_production_logs')
        .select(`
          units_produced,
          grade,
          log_date,
          karigar:karigars(name)
        `)
        .eq('business_id', profileId)
        .gte('log_date', firstDayOfMonth);

      if (data && !error) {
        setLogs(data as any);
      }
    } catch (err) {
      console.error('Error loading analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAnalytics(true);
  };

  // Computations
  const stats = useMemo(() => {
    if (logs.length === 0) {
      return {
        totalUnits: 0,
        avgPerDay: 0,
        bestWorker: 'N/A',
        bestWorkerUnits: 0,
        rejectionRate: 0,
        weekdayData: [0, 0, 0, 0, 0, 0, 0],
        rejectionTrend: [] as { date: string; rate: number }[]
      };
    }

    let totalUnits = 0;
    let rejectedUnits = 0;
    const workerMap = new Map<string, number>();
    const dayMap = new Set<string>();
    const weekdayData = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    
    // Group logs by day for last 7 days rejection rate trend
    const last7DaysMap = new Map<string, { total: number; rejected: number }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      last7DaysMap.set(dateStr, { total: 0, rejected: 0 });
    }

    for (const log of logs) {
      const qty = log.units_produced || 0;
      totalUnits += qty;
      dayMap.add(log.log_date);

      if (log.grade === 'Rejected') {
        rejectedUnits += qty;
      }

      // Best worker computation
      const name = log.karigar?.name || 'Unknown';
      workerMap.set(name, (workerMap.get(name) || 0) + qty);

      // Day of week heatmap (0 is Sunday, 1 is Monday ... 6 is Saturday)
      const logDateObj = new Date(log.log_date);
      let dayIndex = logDateObj.getDay();
      // Map Sunday from index 0 to 6, and Monday-Saturday from 1-6 to 0-5
      dayIndex = dayIndex === 0 ? 6 : dayIndex - 1; 
      if (dayIndex >= 0 && dayIndex < 7) {
        weekdayData[dayIndex] += qty;
      }

      // Rejection trend
      if (last7DaysMap.has(log.log_date)) {
        const current = last7DaysMap.get(log.log_date)!;
        current.total += qty;
        if (log.grade === 'Rejected') {
          current.rejected += qty;
        }
      }
    }

    // Best worker
    let bestWorker = 'N/A';
    let bestWorkerUnits = 0;
    workerMap.forEach((unitsCount, name) => {
      if (unitsCount > bestWorkerUnits) {
        bestWorkerUnits = unitsCount;
        bestWorker = name;
      }
    });

    const uniqueDays = dayMap.size || 1;
    const avgPerDay = Math.round(totalUnits / uniqueDays);
    const rejectionRate = Math.round((rejectedUnits / (totalUnits || 1)) * 100);

    // Format rejection trend data
    const rejectionTrend = Array.from(last7DaysMap.entries()).map(([date, data]) => {
      const rate = data.total > 0 ? Math.round((data.rejected / data.total) * 100) : 0;
      const dateObj = new Date(date);
      const shortDate = dateObj.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
      return { date: shortDate, rate };
    });

    return {
      totalUnits,
      avgPerDay,
      bestWorker,
      bestWorkerUnits,
      rejectionRate,
      weekdayData,
      rejectionTrend
    };
  }, [logs]);

  // Heatmap helper: calculate opacity/color intensity
  const maxWeekdayProduction = Math.max(...stats.weekdayData, 1);
  const weekdayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <ScreenContainer style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title={`${tConfig.production} Analytics`} showBack={true} />

      {loading ? (
        <SkeletonRow lines={8} height={80} />
      ) : logs.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No analytics data"
          description="Log some production outputs first to unlock monthly telemetry insights."
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#60A5FA"
            />
          }
        >
          {/* Main KPI Stats Card */}
          <View style={styles.grid}>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Total Units (Month)</Text>
              <Text style={styles.kpiValue}>{stats.totalUnits.toLocaleString()}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Average Units/Day</Text>
              <Text style={styles.kpiValue}>{stats.avgPerDay.toLocaleString()}</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Best Worker</Text>
              <Text style={[styles.kpiValue, { fontSize: 16, color: '#C6A756' }]} numberOfLines={1}>
                {stats.bestWorker}
              </Text>
              <Text style={styles.kpiSubText}>{stats.bestWorkerUnits.toLocaleString()} units</Text>
            </View>
            <View style={styles.kpiCard}>
              <Text style={styles.kpiLabel}>Avg Rejection Rate</Text>
              <Text style={[styles.kpiValue, { color: stats.rejectionRate > 10 ? '#EF4444' : '#10B981' }]}>
                {stats.rejectionRate}%
              </Text>
            </View>
          </View>

          {/* Rejection Rate Trend Bar Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Rejection Rate Trend (Last 7 Days)</Text>
            <View style={styles.barChartContainer}>
              {stats.rejectionTrend.map((item, idx) => (
                <View key={idx} style={styles.chartCol}>
                  <View style={styles.barWrapper}>
                    {/* Background track */}
                    <View style={styles.barTrack} />
                    {/* Filled bar representing rejection rate */}
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          height: `${Math.min(100, item.rate * 4)}%`, // Scale visually
                          backgroundColor: item.rate > 8 ? '#EF4444' : '#F59E0B'
                        }
                      ]} 
                    />
                    <Text style={styles.barValueText}>{item.rate}%</Text>
                  </View>
                  <Text style={styles.barLabel}>{item.date}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Production by Day of Week Heatmap */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Production Day-of-Week Heatmap</Text>
            <View style={styles.heatmapRow}>
              {weekdayNames.map((name, index) => {
                const prod = stats.weekdayData[index];
                const percentage = prod / maxWeekdayProduction;
                // Calculate color intensity (0.1 to 1 opacity)
                const opacity = 0.1 + percentage * 0.9;
                return (
                  <View key={name} style={styles.heatmapCellContainer}>
                    <View 
                      style={[
                        styles.heatmapCell, 
                        { 
                          backgroundColor: `rgba(96, 165, 250, ${opacity})`,
                          borderColor: prod > 0 ? 'rgba(96, 165, 250, 0.4)' : 'rgba(255,255,255,0.05)'
                        }
                      ]}
                    >
                      <Text style={[styles.heatmapUnits, { color: opacity > 0.5 ? '#000000' : '#FFFFFF' }]}>
                        {prod > 1000 ? `${(prod/1000).toFixed(1)}k` : prod}
                      </Text>
                    </View>
                    <Text style={styles.heatmapLabel}>{name}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  scroll: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
    gap: 6,
  },
  kpiLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: THEME.fonts.monoBold,
  },
  kpiSubText: {
    fontSize: 10,
    color: '#4B5563',
    fontFamily: THEME.fonts.mono,
  },
  chartCard: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  chartTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  barChartContainer: {
    flexDirection: 'row',
    height: 160,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: 24,
    height: 120,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 4,
  },
  barFill: {
    width: '100%',
    borderRadius: 4,
  },
  barValueText: {
    position: 'absolute',
    top: -16,
    fontSize: 9,
    color: '#FFFFFF',
    fontFamily: THEME.fonts.mono,
    fontWeight: '700',
  },
  barLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginTop: 8,
  },
  heatmapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  heatmapCellContainer: {
    alignItems: 'center',
    gap: 8,
  },
  heatmapCell: {
    width: (SCREEN_WIDTH - 32 - 32 - 42) / 7, // screen width - margins - spacing divided by 7
    height: (SCREEN_WIDTH - 32 - 32 - 42) / 7,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heatmapUnits: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: THEME.fonts.monoBold,
  },
  heatmapLabel: {
    fontSize: 9,
    color: '#6B7280',
  },
});
