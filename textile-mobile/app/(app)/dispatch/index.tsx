import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { THEME, COMMON_STYLES } from '../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../src/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../../../src/utils/storage';
import { formatCurrency } from '../../../src/lib/currency/formatCurrency';

/**
 * SOVEREIGN DISPATCH HUB (v2.0)
 * Pick-list queue for fulfilled warehouse orders.
 */

const DispatchOrderCard = ({ item, router }: { item: any, router: any }) => {
  const [hasProgress, setHasProgress] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const checkProgress = async () => {
        const saved = await getSafeStorage(`dispatch_progress_${item.id}`);
        setHasProgress(!!saved);
      };
      checkProgress();
    }, [item.id])
  );

  return (
    <TouchableOpacity 
      style={COMMON_STYLES.card}
      onPress={() => router.push(`/(app)/dispatch/order/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.orderCode}>{item.code}</Text>
        <View style={styles.badgeRow}>
           {hasProgress && (
             <View style={[styles.badge, { backgroundColor: THEME.colors.status.info + '20', marginRight: 8 }]}>
               <Text style={[styles.badgeText, { color: THEME.colors.status.info }]}>RESUME</Text>
             </View>
           )}
           <StatusBadge status={item.status} />
        </View>
      </View>

      <Text style={styles.partyName}>{item.parties?.name || 'Unknown Party'}</Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>TOTAL VALUE</Text>
          <Text style={styles.statValue}>{formatCurrency(item.total)}</Text>
        </View>
        <View style={styles.pickIndicator}>
          <Text style={styles.pickText}>CONTINUE PICKING</Text>
          <Ionicons name="arrow-forward" size={14} color={THEME.colors.gold} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function DispatchHome() {
  const router = useRouter();
  
  const { data: orders, isLoading, refetch } = useQuery({
    queryKey: ['dispatch-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, code, status, total, created_at,
          parties(name),
          order_items(count)
        `)
        .eq('status', 'CONFIRMED')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <View style={COMMON_STYLES.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>DISPATCH BAY</Text>
          <Text style={styles.subtitle}>Order Fulfillment Station</Text>
        </View>
        <TouchableOpacity style={styles.scanBtn} onPress={() => router.push('/(app)/scanner')}>
          <Ionicons name="scan" size={24} color={THEME.colors.background} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <DispatchOrderCard item={item} router={router} />}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={THEME.colors.gold} />
        }
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="cart-outline" size={48} color={THEME.colors.border} />
            <Text style={styles.emptyText}>PICK QUEUE EMPTY</Text>
            <Text style={styles.emptySub}>Awaiting order confirmations.</Text>
          </View>
        )}
      />
    </View>
  );
}

const StatusBadge = ({ status }: { status: string }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{status}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    paddingTop: 60,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  title: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 20,
    letterSpacing: 1,
  },
  subtitle: {
    color: THEME.colors.text.muted,
    fontSize: 12,
    fontFamily: THEME.fonts.inter,
  },
  scanBtn: {
    backgroundColor: THEME.colors.gold,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 24,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderCode: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
  },
  partyName: {
    color: 'white',
    fontFamily: THEME.fonts.interBold,
    fontSize: 18,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingTop: 16,
  },
  stat: {
    flexDirection: 'column',
  },
  statLabel: {
    color: THEME.colors.text.muted,
    fontSize: 10,
    fontFamily: THEME.fonts.mono,
    marginBottom: 4,
  },
  statValue: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 14,
  },
  pickIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pickText: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
  },
  badge: {
    backgroundColor: 'rgba(224, 122, 16, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: THEME.colors.status.warning,
    fontSize: 10,
    fontFamily: THEME.fonts.monoBold,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 16,
    marginTop: 16,
  },
  emptySub: {
    color: THEME.colors.text.muted,
    fontSize: 12,
    marginTop: 4,
  }
});
