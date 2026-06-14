'use client';

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useBridgeStatus } from '../../src/store/BridgeStatusStore';
import { useAuthStore } from '../../src/store/AuthStore';
import { supabase } from '../../src/lib/supabase';
import { getSafeStorage } from '../../src/utils/storage';
import { getPendingCount } from '../../src/services/OfflineQueueManager';
import { THEME } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const {
    hubOnline,
    businessName,
    currency,
    tier,
    syncStatus,
    connectionState,
  } = useBridgeStatus();

  const [stats, setStats] = useState({
    totalKarigars: 0,
    presentToday: 0,
    pendingDispatch: 0,
    overdueInvoices: 0,
    loading: true,
  });

  const [pendingSync, setPendingSync] = useState(0);

  useEffect(() => {
    loadStats();
    
    // Check pending sync count immediately and periodically
    const check = async () => {
      const count = await getPendingCount();
      setPendingSync(count);
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
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

      const [karigars, attendance, dispatch] = await Promise.allSettled([
        supabase.from('karigars')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', profileId)
          .eq('status', 'active'),
        supabase.from('attendance_logs')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', profileId)
          .eq('attendance_date', today)
          .eq('status', 'present'),
        supabase.from('dispatch_orders')
          .select('id', { count: 'exact', head: true })
          .eq('business_id', profileId)
          .in('status', ['pending', 'packed']),
      ]);

      setStats({
        totalKarigars: karigars.status === 'fulfilled' ? karigars.value.count || 0 : 0,
        presentToday: attendance.status === 'fulfilled' ? attendance.value.count || 0 : 0,
        pendingDispatch: dispatch.status === 'fulfilled' ? dispatch.value.count || 0 : 0,
        overdueInvoices: 0,
        loading: false,
      });
    } catch {
      setStats(s => ({ ...s, loading: false }));
    }
  };

  const handleRefresh = async () => {
    setStats(s => ({ ...s, loading: true }));
    await loadStats();
  };

  const isHubConnected = hubOnline || connectionState === 'connected';

  const QUICK_ACTIONS = [
    {
      label: 'Mark Attendance',
      icon: 'checkmark-circle-outline',
      color: '#10B981',
      route: '/(app)/attendance',
    },
    {
      label: 'Log Production',
      icon: 'flash-outline',
      color: '#60A5FA',
      route: '/(app)/production/quick-log',
    },
    {
      label: 'Give Advance',
      icon: 'cash-outline',
      color: '#C5A059',
      route: '/(app)/karigars',
    },
    {
      label: 'Scan Barcode',
      icon: 'barcode-outline',
      color: '#8B5CF6',
      route: '/(app)/scanner',
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Dashboard', headerShown: false }} />
      
      <ScrollView 
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={stats.loading} 
            onRefresh={handleRefresh} 
            tintColor="#C5A059" 
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleBox}>
            <Text style={styles.bizName} numberOfLines={1}>
              {businessName.toUpperCase()}
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

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>METRICS_TELEMETRY</Text>
        {stats.loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={THEME.colors.gold} size="small" />
            <Text style={styles.loadingText}>SYNCING_METRICS...</Text>
          </View>
        ) : (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {stats.presentToday}/{stats.totalKarigars}
              </Text>
              <Text style={styles.statLabel}>Present Today</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={[
                styles.statValue,
                stats.pendingDispatch > 0 && { color: '#C5A059' }
              ]}>
                {stats.pendingDispatch}
              </Text>
              <Text style={styles.statLabel}>Pending Dispatch</Text>
            </View>

            {!isHubConnected && (
              <View style={styles.statCard}>
                <Text style={[styles.statValue, { color: '#EF4444' }]}>
                  OFFLINE
                </Text>
                <Text style={styles.statLabel}>Data Queued</Text>
              </View>
            )}
          </View>
        )}

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Command Center</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map(action => (
            <TouchableOpacity
              key={action.label}
              style={[styles.actionCard, { borderColor: action.color + '30' }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push(action.route as any);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIconBox, { backgroundColor: action.color + '15' }]}>
                <Ionicons name={action.icon as any} size={28} color={action.color} />
              </View>
              <Text style={styles.actionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* System metadata & Tier information */}
        <View style={styles.tierRow}>
          <View>
            <Text style={styles.tierText}>
              {tier.toUpperCase()} PLAN
            </Text>
            <Text style={styles.tierSub}>
              {currency} • {businessName}
            </Text>
          </View>
          <Ionicons name="shield-checkmark" size={16} color={THEME.colors.gold} />
        </View>
      </ScrollView>
    </View>
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
    padding: 20, 
    paddingTop: 60,
    paddingBottom: 40 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 24
  },
  headerTitleBox: {
    flex: 1,
    marginRight: 12
  },
  bizName: { 
    fontSize: 20, 
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
    marginBottom: 24,
  },
  syncWarningText: {
    fontSize: 11,
    color: '#C5A059',
    fontWeight: '600',
    fontFamily: THEME.fonts.mono
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
  loadingBox: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 10
  },
  loadingText: {
    color: THEME.colors.textSecondary,
    fontSize: 9,
    fontFamily: THEME.fonts.mono
  },
  statsRow: { 
    flexDirection: 'row', 
    gap: 12,
    marginBottom: 28 
  },
  statCard: { 
    flex: 1, 
    backgroundColor: THEME.colors.surface,
    borderWidth: 1, 
    borderColor: THEME.colors.border,
    borderRadius: 16, 
    padding: 16, 
    alignItems: 'center' 
  },
  statValue: { 
    fontSize: 22, 
    fontWeight: '800',
    fontFamily: THEME.fonts.monoExtraBold, 
    color: '#FFFFFF',
    marginBottom: 6 
  },
  statLabel: { 
    fontSize: 10, 
    color: THEME.colors.textSecondary,
    textTransform: 'uppercase', 
    letterSpacing: 0.5,
    textAlign: 'center',
    fontFamily: THEME.fonts.monoBold
  },
  actionsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: 12, 
    marginBottom: 28 
  },
  actionCard: { 
    width: (width - 52) / 2, 
    backgroundColor: THEME.colors.surface,
    borderWidth: 1, 
    borderRadius: 16,
    padding: 16, 
    alignItems: 'center', 
    gap: 12 
  },
  actionIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center'
  },
  actionLabel: { 
    fontSize: 12, 
    fontWeight: '600',
    color: '#E2E8F0', 
    textAlign: 'center' 
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
