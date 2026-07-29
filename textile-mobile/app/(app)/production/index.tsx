import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { THEME, COMMON_STYLES } from '../../../src/constants/DesignSystem';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { ErrorState } from '../../../src/components/ui/ErrorState';
import { SkeletonRow } from '../../../src/components/ui/SkeletonRow';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../src/lib/supabase';
import { SyncEngine } from '../../../src/lib/SyncEngine';
import { useAuthStore } from '../../../src/store/AuthStore';
import { useTranslation } from 'react-i18next';

/**
 * SOVEREIGN PRODUCTION DASHBOARD (v3.5)
 * Centralized queue for Job Orders and Tactical Stock Operations.
 */

export default function ProductionHome() {
  const { t } = useTranslation();
  const router = useRouter();
  const [syncCount, setSyncCount] = useState(0);
  const [jobOrders, setJobOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const nodeRole = useAuthStore(s => s.nodeRole);
  const nodeId = useAuthStore(s => s.nodeId);
  
  const fetchJobOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('job_orders')
        .select(`
          id, code, status, target_suits, gaz_issued, created_at,
          articles(name, desi_color_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setJobOrders(data || []);
    } catch (err) {
      console.error('Fetch Job Orders Error:', err);
      setError('Could not load production logs. Check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobOrders();

    const channel = supabase
      .channel('production-floor-live')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'job_orders'
      }, () => { 
        fetchJobOrders(); 
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const checkSync = async () => {
      const size = await SyncEngine.getQueueLength();
      setSyncCount(size);
    };
    checkSync();
    const interval = setInterval(checkSync, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderJobCard = useCallback(({ item }: { item: any }) => (
    <ProductionRow item={item} onPress={() => router.push(`/(app)/production/job/${item.code}`)} t={t} />
  ), [router, t]);

  return (
    <ScreenContainer style={COMMON_STYLES.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>PRODUCTION_NODE</Text>
          <Text style={styles.sub}>{nodeRole || 'OFFLINE_AGENT'}</Text>
        </View>
        <TouchableOpacity style={styles.scanBtn} onPress={() => router.push('/(app)/scanner')}>
          <Ionicons name="scan" size={24} color={THEME.colors.background} />
        </TouchableOpacity>
      </View>

      {/* TACTICAL ACTION HUB */}
      <View style={styles.actionHub}>
        <TouchableOpacity 
          style={[styles.actionCard, { borderColor: THEME.colors.status.success }]}
          onPress={() => router.push('/(app)/production/inward')}
        >
          <Ionicons name="download-outline" size={24} color={THEME.colors.status.success} />
          <Text style={styles.actionLabel}>TACTICAL_INWARD</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, { borderColor: THEME.colors.blue }]}
          onPress={() => router.push('/(app)/production/pick')}
        >
          <Ionicons name="cube-outline" size={24} color={THEME.colors.blue} />
          <Text style={styles.actionLabel}>SURGICAL_PICKING</Text>
        </TouchableOpacity>
      </View>

      {syncCount > 0 && (
        <View style={styles.syncBanner}>
          <ActivityIndicator size="small" color={THEME.colors.background} style={{ marginRight: 8 }} />
          <Text style={styles.syncText}>{syncCount} OPERATIONS QUEUED FOR SYNC</Text>
        </View>
      )}

      {isLoading ? (
        <SkeletonRow lines={6} />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={fetchJobOrders}
        />
      ) : (
        <FlatList
          data={jobOrders}
          keyExtractor={React.useCallback((item: any) => item.id, [])}
          renderItem={renderJobCard}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={8}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={fetchJobOrders} tintColor={THEME.colors.blue} />
          }
          ListEmptyComponent={() => (
            <EmptyState
              icon="⚡"
              title="No production logs"
              description="Active job orders will show up here once dispatched."
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors = status === 'ISSUED' ? { bg: THEME.colors.gold + '20', text: THEME.colors.gold } :
                 status === 'IN_PROGRESS' ? { bg: THEME.colors.blue + '20', text: THEME.colors.blue } :
                 status === 'SUBMITTED' ? { bg: THEME.colors.status.success + '20', text: THEME.colors.status.success } :
                 { bg: THEME.colors.border, text: THEME.colors.text.muted };
  
  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.badgeText, { color: colors.text }]}>{status}</Text>
    </View>
  );
};

interface ProductionRowProps {
  item: any
  onPress: () => void
  t: any
}

const ProductionRow = React.memo(function ProductionRow({ item, onPress, t }: ProductionRowProps) {
  return (
    <TouchableOpacity 
      style={COMMON_STYLES.card}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.jobCode}>{item.code}</Text>
        <StatusBadge status={item.status} />
      </View>

      <Text style={styles.articleName}>{item.articles?.name || 'Unknown Article'}</Text>
      <Text style={styles.articleSub}>{item.articles?.desi_color_name || 'No Color'}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{t('production.target_suits')}</Text>
          <Text style={styles.statValue}>{item.target_suits} S</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>{t('production.gaz_issued')}</Text>
          <Text style={styles.statValue}>{item.gaz_issued} G</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}, (prev, next) => {
  return prev.item.id === next.item.id && 
         prev.item.status === next.item.status && 
         prev.item.code === next.item.code &&
         prev.item.target_suits === next.item.target_suits &&
         prev.item.gaz_issued === next.item.gaz_issued &&
         prev.item.articles?.name === next.item.articles?.name &&
         prev.item.articles?.desi_color_name === next.item.articles?.desi_color_name;
});

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  title: { color: THEME.colors.blue, fontFamily: THEME.fonts.monoBold, fontSize: 20, letterSpacing: 1 },
  sub: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, fontSize: 10, letterSpacing: 2, marginTop: 4 },
  scanBtn: { backgroundColor: THEME.colors.blue, width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  
  actionHub: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginBottom: 24 },
  actionCard: { flex: 1, backgroundColor: THEME.colors.surface, padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center', gap: 8 },
  actionLabel: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.monoBold, fontSize: 9, letterSpacing: 1 },

  syncBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.colors.blue, paddingVertical: 10 },
  syncText: { color: THEME.colors.background, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 1 },
  
  listContent: { padding: 24, paddingTop: 0, gap: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  jobCode: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, fontSize: 11 },
  articleName: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.manropeBold, fontSize: 18 },
  articleSub: { color: THEME.colors.muted, fontFamily: THEME.fonts.inter, fontSize: 12, marginTop: 2, marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 24, borderTopWidth: 1, borderTopColor: THEME.colors.border, paddingTop: 16 },
  stat: { flex: 1 },
  statLabel: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, fontSize: 9, marginBottom: 4 },
  statValue: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  badgeText: { fontSize: 10, fontFamily: THEME.fonts.monoBold },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80, opacity: 0.3 },
  emptyText: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, marginTop: 12 }
});
