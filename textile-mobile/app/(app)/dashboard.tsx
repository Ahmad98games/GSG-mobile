'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl,
  Dimensions,
  Linking,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useBridgeStatusStore } from '../../src/store/BridgeStatusStore';
import { useAuthStore } from '../../src/store/AuthStore';
import { supabase } from '../../src/lib/supabase';
import { getSafeStorage } from '../../src/utils/storage';
import { getPendingCount } from '../../src/services/OfflineQueueManager';
import { THEME } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ScreenHeader } from '../../src/components/navigation/ScreenHeader';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { useIndustryConfig } from '../../src/hooks/useIndustryConfig';
import { HubStatusBar } from '../../src/components/HubStatusBar';
import { useTranslation } from '../../src/hooks/useTranslation';

const { width } = Dimensions.get('window');

function DashboardSkeleton() {
  return (
    <View style={{ padding: 16, gap: 12 }}>
      {[1, 2, 3, 4].map(i => (
        <View key={i} style={{
          height: 80,
          backgroundColor: 'rgba(255,255,255,0.04)',
          borderRadius: 10,
        }} />
      ))}
    </View>
  );
}

function formatTimeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { tr } = useTranslation();
  const {
    hubOnline,
    businessName,
    currency,
    tier,
    connectionState,
    canMarkAttendance,
    canLogProduction,
    canGivePeshgi,
    canViewFinancials,
    ownerWhatsApp,
  } = useBridgeStatusStore();
  const tConfig = useIndustryConfig();
  const fmt = tConfig.fmt;

  const [stats, setStats] = useState({
    presentToday: 0,
    totalWorkers: 0,
    unitsToday: 0,
    pendingDispatch: 0,
    lowStockAlerts: 0,
    prediction: null as any,
    recentActivity: [] as any[],
    loading: true,
  });

  const [pendingSync, setPendingSync] = useState(0);

  const loadDashboardData = useCallback(async () => {
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

      if (!profileId) {
        setStats(s => ({ ...s, loading: false }));
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      const [
        attendanceRes,
        workersRes,
        productionRes,
        dispatchRes,
        lowStockRes,
        foresightRes,
        activityRes,
      ] = await Promise.allSettled([
        supabase.from('attendance_logs')
          .select('status', { count: 'exact' })
          .eq('business_id', profileId)
          .eq('attendance_date', today)
          .eq('status', 'present'),

        supabase.from('karigars')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', profileId)
          .eq('status', 'active'),

        supabase.from('karigar_production_logs')
          .select('units_produced')
          .eq('business_id', profileId)
          .eq('log_date', today),

        supabase.from('dispatch_orders')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', profileId)
          .in('status', ['pending', 'packed']),

        supabase.from('low_stock_items')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', profileId),

        supabase.from('foresight_predictions')
          .select('title, impact, detail')
          .eq('business_id', profileId)
          .eq('status', 'active')
          .in('impact', ['critical', 'high'])
          .order('confidence', { ascending: false })
          .limit(1),

        supabase.from('audit_logs')
          .select('action, entity_label, created_at, user_name')
          .eq('business_id', profileId)
          .order('created_at', { ascending: false })
          .limit(5),
      ]);

      const presentToday = attendanceRes.status === 'fulfilled' ? attendanceRes.value.count || 0 : 0;
      const totalWorkers = workersRes.status === 'fulfilled' ? workersRes.value.count || 0 : 0;
      const unitsToday = productionRes.status === 'fulfilled' && productionRes.value.data
        ? (productionRes.value.data as any[]).reduce((sum, current) => sum + (current.units_produced || 0), 0)
        : 0;
      const pendingDispatch = dispatchRes.status === 'fulfilled' ? dispatchRes.value.count || 0 : 0;
      const lowStockAlerts = lowStockRes.status === 'fulfilled' ? lowStockRes.value.count || 0 : 0;
      const prediction = foresightRes.status === 'fulfilled' && foresightRes.value.data && foresightRes.value.data.length > 0
        ? foresightRes.value.data[0]
        : null;
      const recentActivity = activityRes.status === 'fulfilled' ? activityRes.value.data || [] : [];

      setStats({
        presentToday,
        totalWorkers,
        unitsToday,
        pendingDispatch,
        lowStockAlerts,
        prediction,
        recentActivity,
        loading: false,
      });
    } catch (err) {
      console.error('[Dashboard] Load failed:', err);
      setStats(s => ({ ...s, loading: false }));
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
    
    const check = async () => {
      const count = await getPendingCount();
      setPendingSync(count);
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const handleRefresh = async () => {
    setStats(s => ({ ...s, loading: true }));
    await loadDashboardData();
  };

  const isHubConnected = hubOnline || connectionState === 'connected';

  const sendWhatsAppReminder = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const text = 'Noxis System Alert: Please check the dashboard updates and attendance log for today.';
    const phone = ownerWhatsApp || '';
    const url = `whatsapp://send?text=${encodeURIComponent(text)}${phone ? `&phone=${phone}` : ''}`;
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'WhatsApp is not installed on this device.');
      }
    });
  };

  return (
    <ScreenContainer style={styles.container}>
      <Stack.Screen options={{ title: 'Dashboard', headerShown: false }} />
      <HubStatusBar />
      <ScreenHeader title={tr('Dashboard')} showBack={false} />

      {stats.loading ? (
        <DashboardSkeleton />
      ) : (
        <ScrollView 
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={stats.loading} 
              onRefresh={handleRefresh} 
              tintColor="#60A5FA" 
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleBox}>
              <Text style={styles.bizName} numberOfLines={1}>
                {businessName ? businessName.toUpperCase() : 'MY FACTORY'}
              </Text>
              <Text style={styles.systemSubtitle}>OPERATIONS_HUB</Text>
            </View>
            <View style={[
              styles.statusBadge,
              { backgroundColor: isHubConnected ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }
            ]}>
              <View style={[
                styles.statusDot,
                { backgroundColor: isHubConnected ? '#10B981' : '#EF4444' }
              ]} />
              <Text style={[
                styles.statusText,
                { color: isHubConnected ? '#10B981' : '#EF4444' }
              ]}>
                {isHubConnected ? 'Hub Online' : 'Hub Offline'}
              </Text>
            </View>
          </View>

          {/* Sync Backlog warning banner */}
          {pendingSync > 0 && (
            <View style={styles.syncWarningBanner}>
              <Ionicons name="cloud-upload-outline" size={16} color="#C5A059" />
              <Text style={styles.syncWarningText}>
                {pendingSync} action{pendingSync > 1 ? 's' : ''} waiting to sync with Hub
              </Text>
            </View>
          )}

          {/* Foresight Top Prediction Banner */}
          {stats.prediction && (
            <TouchableOpacity 
              style={[
                styles.foresightBanner, 
                stats.prediction.impact === 'critical' ? styles.borderCritical : styles.borderHigh
              ]}
              onPress={() => router.push('/(app)/foresight')}
            >
              <View style={styles.foresightHeader}>
                <Text style={styles.foresightBadge}>🧠 FORESIGHT PREDICTION</Text>
                <View style={[
                  styles.impactDot, 
                  { backgroundColor: stats.prediction.impact === 'critical' ? '#EF4444' : '#60A5FA' }
                ]} />
              </View>
              <Text style={styles.foresightTitle}>{stats.prediction.title}</Text>
              <Text style={styles.foresightDetail} numberOfLines={2}>{stats.prediction.detail}</Text>
            </TouchableOpacity>
          )}

          {/* KPI Grid (2x2 Layout) */}
          <Text style={styles.sectionTitle}>{tr('METRICS_TELEMETRY')}</Text>
          <View style={styles.kpiGrid}>
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <View style={[styles.cardDot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.kpiValue}>{stats.presentToday}/{stats.totalWorkers}</Text>
                <Text style={styles.kpiLabel}>Present Today</Text>
              </View>
              <View style={styles.kpiCard}>
                <View style={[styles.cardDot, { backgroundColor: '#60A5FA' }]} />
                <Text style={styles.kpiValue}>{stats.unitsToday.toLocaleString()}</Text>
                <Text style={styles.kpiLabel}>Units Logged</Text>
              </View>
            </View>
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <View style={[styles.cardDot, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.kpiValue}>{stats.pendingDispatch}</Text>
                <Text style={styles.kpiLabel}>Pending Dispatch</Text>
              </View>
              <View style={styles.kpiCard}>
                <View style={[styles.cardDot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.kpiValue}>{stats.lowStockAlerts}</Text>
                <Text style={styles.kpiLabel}>Low Stock Alerts</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions Grid */}
          <Text style={styles.sectionTitle}>{tr('COMMAND CENTER')}</Text>
          <View style={styles.actionsGrid}>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(app)/attendance');
                }}
              >
                <Text style={[styles.actionIcon, { color: '#10B981' }]}>✓</Text>
                <Text style={styles.actionLabel}>{tr('Mark Attendance')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(app)/production/quick-log');
                }}
              >
                <Text style={[styles.actionIcon, { color: '#60A5FA' }]}>⚡</Text>
                <Text style={styles.actionLabel}>{tr('Log Production')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/(app)/scanner');
                }}
              >
                <Text style={[styles.actionIcon, { color: '#F59E0B' }]}>⬚</Text>
                <Text style={styles.actionLabel}>{tr('Scan Item')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={sendWhatsAppReminder}
              >
                <Text style={[styles.actionIcon, { color: '#C5A059' }]}>💬</Text>
                <Text style={styles.actionLabel}>{tr('Send Reminder')}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Activity Feed */}
          <Text style={styles.sectionTitle}>{tr('RECENT ACTIVITY FEED')}</Text>
          <View style={styles.activityFeed}>
            {stats.recentActivity.length === 0 ? (
              <Text style={styles.noActivityText}>No recent activity logs available.</Text>
            ) : (
              stats.recentActivity.map((activity, idx) => (
                <View key={idx} style={styles.activityRow}>
                  <View style={styles.activityLeft}>
                    <Text style={styles.activityAction}>{activity.action.toUpperCase()}</Text>
                    <Text style={styles.activityDetail}>
                      {activity.entity_label || 'Record'} · By {activity.user_name || 'System'}
                    </Text>
                  </View>
                  <Text style={styles.activityTime}>{formatTimeAgo(activity.created_at)}</Text>
                </View>
              ))
            )}
          </View>

          {/* System metadata & Tier information */}
          <View style={styles.tierRow}>
            <View>
              <Text style={styles.tierText}>
                {tier ? tier.toUpperCase() : 'LITE'} PLAN
              </Text>
              <Text style={styles.tierSub}>
                {currency || 'PKR'} • {businessName || 'Noxis System'}
              </Text>
            </View>
            <Ionicons name="shield-checkmark" size={16} color={THEME.colors.gold} />
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: THEME.colors.bg 
  },
  scroll: { 
    flex: 1 
  },
  content: { 
    padding: 16, 
    paddingBottom: 40 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 20
  },
  headerTitleBox: {
    flex: 1,
    marginRight: 12
  },
  bizName: { 
    fontSize: 18, 
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: THEME.fonts.monoExtraBold,
    letterSpacing: 0.5
  },
  systemSubtitle: {
    fontSize: 9,
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.blue,
    letterSpacing: 1.5,
    marginTop: 2
  },
  statusBadge: { 
    flexDirection: 'row',
    alignItems: 'center', 
    gap: 6,
    paddingHorizontal: 10, 
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  statusDot: { 
    width: 6, 
    height: 6,
    borderRadius: 3 
  },
  statusText: { 
    fontSize: 10, 
    fontWeight: '700',
    fontFamily: THEME.fonts.monoBold
  },
  syncWarningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(197, 160, 89, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.25)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  syncWarningText: {
    fontSize: 11,
    color: '#C5A059',
    fontWeight: '600',
    fontFamily: THEME.fonts.mono
  },
  foresightBanner: {
    backgroundColor: '#0F1114',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    gap: 6,
  },
  borderCritical: {
    borderColor: 'rgba(239,68,68,0.4)',
  },
  borderHigh: {
    borderColor: 'rgba(96,165,250,0.4)',
  },
  foresightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foresightBadge: {
    fontSize: 9,
    color: THEME.colors.gold,
    fontWeight: '800',
    fontFamily: THEME.fonts.monoBold,
    letterSpacing: 1,
  },
  impactDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  foresightTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  foresightDetail: {
    color: '#6B7280',
    fontSize: 11,
    lineHeight: 16,
  },
  sectionTitle: { 
    fontSize: 10, 
    fontWeight: '700',
    color: THEME.colors.textSecondary, 
    textTransform: 'uppercase',
    letterSpacing: 2, 
    marginBottom: 12,
    fontFamily: THEME.fonts.monoBold
  },
  kpiGrid: {
    gap: 12,
    marginBottom: 24,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 12,
  },
  kpiCard: { 
    flex: 1, 
    backgroundColor: '#0F1114',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16, 
    padding: 16, 
    position: 'relative',
  },
  cardDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  kpiValue: { 
    fontSize: 22, 
    fontWeight: '800',
    fontFamily: THEME.fonts.monoExtraBold, 
    color: '#FFFFFF',
    marginBottom: 4
  },
  kpiLabel: { 
    fontSize: 9, 
    color: '#6B7280',
    textTransform: 'uppercase', 
    letterSpacing: 0.5,
    fontFamily: THEME.fonts.monoBold
  },
  actionsGrid: {
    gap: 12,
    marginBottom: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: { 
    flex: 1,
    backgroundColor: '#0F1114',
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 16,
    padding: 16, 
    alignItems: 'center', 
    gap: 8 
  },
  actionIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionLabel: { 
    fontSize: 11, 
    fontWeight: '700',
    color: '#D1D5DB', 
    textAlign: 'center' 
  },
  activityFeed: {
    backgroundColor: '#0F1114',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    padding: 16,
    gap: 12,
    marginBottom: 24,
  },
  noActivityText: {
    color: '#4B5563',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 12,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
    paddingBottom: 8,
  },
  activityLeft: {
    flex: 1,
    gap: 2,
  },
  activityAction: {
    fontSize: 10,
    color: '#60A5FA',
    fontWeight: '800',
    fontFamily: THEME.fonts.monoBold,
  },
  activityDetail: {
    fontSize: 11,
    color: '#E5E7EB',
  },
  activityTime: {
    fontSize: 10,
    color: '#4B5563',
    fontFamily: THEME.fonts.mono,
  },
  tierRow: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20, 
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border
  },
  tierText: { 
    fontSize: 10, 
    fontWeight: '700',
    color: THEME.colors.gold, 
    letterSpacing: 2,
    fontFamily: THEME.fonts.monoBold
  },
  tierSub: { 
    fontSize: 10, 
    color: THEME.colors.textMuted,
    fontFamily: THEME.fonts.mono,
    marginTop: 2
  },
});
