'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../../src/lib/supabase';
import { getSafeStorage } from '../../../src/utils/storage';
import { useBridgeStatusStore } from '../../../src/store/BridgeStatusStore';
import { useAuthStore } from '../../../src/store/AuthStore';
import { THEME } from '../../../src/constants/theme';
import { useIndustryConfig } from '../../../src/hooks/useIndustryConfig';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { SkeletonRow } from '../../../src/components/ui/SkeletonRow';

export default function ReportsScreen() {
  const router = useRouter();
  const { canViewFinancials } = useBridgeStatusStore();
  const tConfig = useIndustryConfig();
  const fmt = tConfig.fmt;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reportData, setReportData] = useState({
    revenue: 0,
    receivables: 0,
    payroll: 0,
    productionUnits: 0
  });

  const loadReportData = useCallback(async (isRefresh = false) => {
    if (!canViewFinancials) {
      setLoading(false);
      return;
    }
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
      if (!profileId) {
        setLoading(false);
        return;
      }

      const todayObj = new Date();
      const firstDayOfMonth = new Date(todayObj.getFullYear(), todayObj.getMonth(), 1).toISOString().split('T')[0];

      const [partiesRes, prodRes, khataRes] = await Promise.all([
        supabase
          .from('parties')
          .select('id, name, type, khata_entries(amount, entry_type)')
          .eq('business_id', profileId),
        supabase
          .from('karigar_production_logs')
          .select('units_produced, earnings')
          .eq('business_id', profileId)
          .gte('log_date', firstDayOfMonth),
        supabase
          .from('khata_entries')
          .select('amount, entry_type, created_at, party:parties(type)')
          .eq('business_id', profileId)
          .gte('created_at', firstDayOfMonth + 'T00:00:00')
      ]);

      let receivables = 0;
      if (partiesRes.data) {
        for (const p of partiesRes.data) {
          const balance = (p.khata_entries || []).reduce((acc: number, e: any) => {
            return e.entry_type === 'CREDIT' ? acc + Number(e.amount) : acc - Number(e.amount);
          }, 0);
          if (p.type === 'customer' || p.type === 'both') {
            receivables += balance;
          }
        }
      }

      let productionUnits = 0;
      let payroll = 0;
      if (prodRes.data) {
        for (const log of prodRes.data) {
          productionUnits += (log.units_produced || 0);
          payroll += (log.earnings || 0);
        }
      }

      let revenue = 0;
      if (khataRes.data) {
        for (const entry of khataRes.data) {
          const partyType = (entry.party as any)?.type;
          if ((partyType === 'customer' || partyType === 'both') && entry.entry_type === 'CREDIT') {
            revenue += Number(entry.amount || 0);
          }
        }
      }

      setReportData({
        revenue,
        receivables,
        payroll,
        productionUnits
      });
    } catch (err) {
      console.error('Error loading report data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [canViewFinancials]);

  useEffect(() => {
    loadReportData();
  }, [loadReportData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadReportData(true);
  };

  if (!canViewFinancials) {
    return (
      <ScreenContainer style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScreenHeader title="Reports Summary" showBack={false} />
        <EmptyState
          icon="🔒"
          title="Financial data restricted"
          description="Contact the factory owner to request access to financial reports."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="Reports Summary" showBack={false} />

      {loading ? (
        <View style={{ padding: 16 }}>
          <SkeletonRow lines={4} height={90} />
        </View>
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
          {/* Card 1: Revenue this month */}
          <TouchableOpacity 
            style={styles.reportCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(app)/finance');
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>REVENUE THIS MONTH</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
            <Text style={[styles.cardValue, { color: '#10B981' }]}>{fmt(reportData.revenue)}</Text>
            <Text style={styles.cardSubText}>Aggregated from customer invoices</Text>
          </TouchableOpacity>

          {/* Card 2: Outstanding receivables */}
          <TouchableOpacity 
            style={styles.reportCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(app)/finance');
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>OUTSTANDING RECEIVABLES</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
            <Text style={[styles.cardValue, { color: '#F59E0B' }]}>{fmt(reportData.receivables)}</Text>
            <Text style={styles.cardSubText}>Total active customer balance due</Text>
          </TouchableOpacity>

          {/* Card 3: Payroll this month */}
          <TouchableOpacity 
            style={styles.reportCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(app)/finance');
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>PAYROLL THIS MONTH</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
            <Text style={styles.cardValue}>{fmt(reportData.payroll)}</Text>
            <Text style={styles.cardSubText}>Piece rate earnings logged this month</Text>
          </TouchableOpacity>

          {/* Card 4: Production units this month */}
          <TouchableOpacity 
            style={styles.reportCard}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push('/(app)/production/analytics');
            }}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardLabel}>PRODUCTION THIS MONTH</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
            <Text style={[styles.cardValue, { color: '#60A5FA' }]}>
              {reportData.productionUnits.toLocaleString()} pcs
            </Text>
            <Text style={styles.cardSubText}>Total manufactured units output</Text>
          </TouchableOpacity>
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
    gap: 12,
    paddingBottom: 40,
  },
  reportCard: {
    backgroundColor: '#0F1114',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 1.5,
  },
  chevron: {
    fontSize: 20,
    color: '#4B5563',
  },
  cardValue: {
    fontSize: 26,
    fontWeight: '900',
    fontFamily: THEME.fonts.monoExtraBold,
    color: '#FFFFFF',
  },
  cardSubText: {
    fontSize: 10,
    color: '#4B5563',
  },
});
