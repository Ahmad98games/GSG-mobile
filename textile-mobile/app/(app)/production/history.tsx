'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SectionList, 
  TouchableOpacity, 
  TextInput, 
  RefreshControl
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../../src/lib/supabase';
import { getSafeStorage } from '../../../src/utils/storage';
import { useAuthStore } from '../../../src/store/AuthStore';
import { THEME } from '../../../src/constants/theme';
import { useIndustryConfig } from '../../../src/hooks/useIndustryConfig';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { SkeletonRow } from '../../../src/components/ui/SkeletonRow';

interface ProductionLog {
  id: string;
  log_date: string;
  units_produced: number;
  grade: string;
  earnings: number;
  department: string;
  karigar_id: string;
  karigar: {
    name: string;
    karigar_code: string;
  } | null;
}

export default function ProductionHistoryScreen() {
  const router = useRouter();
  const tConfig = useIndustryConfig();
  const currency = tConfig.currency;
  const fmt = tConfig.fmt;

  const [logs, setLogs] = useState<ProductionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<'All' | 'A' | 'B' | 'C' | 'Rejected'>('All');

  const loadLogs = useCallback(async (isRefresh = false) => {
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

      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('karigar_production_logs')
        .select(`
          id,
          log_date,
          units_produced,
          grade,
          earnings,
          department,
          karigar_id,
          karigar:karigars(name, karigar_code)
        `)
        .eq('business_id', profileId)
        .gte('log_date', thirtyDaysAgo)
        .order('log_date', { ascending: false })
        .order('created_at', { ascending: false });

      if (data && !error) {
        setLogs(data as any);
      }
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const onRefresh = () => {
    setRefreshing(true);
    loadLogs(true);
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const workerName = log.karigar?.name || '';
      const workerCode = log.karigar?.karigar_code || '';
      const matchesSearch = !search ||
        workerName.toLowerCase().includes(search.toLowerCase()) ||
        workerCode.toLowerCase().includes(search.toLowerCase());

      const matchesGrade = gradeFilter === 'All' || log.grade === gradeFilter;

      return matchesSearch && matchesGrade;
    });
  }, [logs, search, gradeFilter]);

  const groupedSections = useMemo(() => {
    const groups: Record<string, { title: string; data: ProductionLog[]; totalUnits: number }> = {};
    
    for (const log of filteredLogs) {
      const dateStr = log.log_date;
      if (!groups[dateStr]) {
        const dateObj = new Date(dateStr);
        const formattedDate = dateObj.toLocaleDateString('en-PK', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        groups[dateStr] = {
          title: formattedDate,
          data: [],
          totalUnits: 0
        };
      }
      groups[dateStr].data.push(log);
      groups[dateStr].totalUnits += (log.units_produced || 0);
    }

    return Object.keys(groups).map(dateKey => ({
      title: groups[dateKey].title,
      totalUnits: groups[dateKey].totalUnits,
      data: groups[dateKey].data
    }));
  }, [filteredLogs]);

  const GRADE_COLORS: Record<string, string> = {
    A: '#10B981',
    B: '#60A5FA',
    C: '#F59E0B',
    Rejected: '#EF4444',
  };

  const renderItem = ({ item }: { item: ProductionLog }) => {
    const gradeColor = GRADE_COLORS[item.grade] || '#6B7280';
    return (
      <View style={styles.logRow}>
        <View style={styles.logLeft}>
          <Text style={styles.workerName}>{item.karigar?.name || 'Unknown'}</Text>
          <Text style={styles.deptText}>{item.department} · {item.karigar?.karigar_code || 'N/A'}</Text>
        </View>
        <View style={styles.logRight}>
          <Text style={styles.unitsValue}>{item.units_produced.toLocaleString()} pcs</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <View style={[styles.gradeBadge, { backgroundColor: gradeColor + '20', borderColor: gradeColor + '40' }]}>
              <Text style={[styles.gradeText, { color: gradeColor }]}>{item.grade}</Text>
            </View>
            <Text style={styles.earningsText}>{fmt(item.earnings || 0)}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title={`${tConfig.production} History`} showBack={true} />

      {/* Filter and Search Bar */}
      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder={`Search by name or code...`}
            placeholderTextColor="#6B7280"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: '#6B7280', fontSize: 18 }}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Grade Filter Bar */}
        <View style={styles.gradeChips}>
          {(['All', 'A', 'B', 'C', 'Rejected'] as const).map(g => (
            <TouchableOpacity
              key={g}
              style={[
                styles.gradeChip,
                gradeFilter === g && styles.gradeChipActive,
                gradeFilter === g && g !== 'All' && { borderColor: GRADE_COLORS[g] }
              ]}
              onPress={() => {
                setGradeFilter(g);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={[
                styles.gradeChipText,
                gradeFilter === g && styles.gradeChipTextActive,
                gradeFilter === g && g !== 'All' && { color: GRADE_COLORS[g] }
              ]}>
                {g}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <SkeletonRow lines={8} height={72} />
      ) : groupedSections.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No history found"
          description="No production logs match your search filters for the last 30 days."
        />
      ) : (
        <SectionList
          sections={groupedSections}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title, totalUnits } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
              <Text style={styles.sectionTotal}>{totalUnits.toLocaleString()} units</Text>
            </View>
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#60A5FA"
            />
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  filterSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontFamily: THEME.fonts.mono,
  },
  gradeChips: {
    flexDirection: 'row',
    gap: 6,
  },
  gradeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
  },
  gradeChipActive: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: '#FFFFFF',
  },
  gradeChipText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
  },
  gradeChipTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F1114',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  sectionTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTotal: {
    color: '#60A5FA',
    fontSize: 11,
    fontFamily: THEME.fonts.mono,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },
  logLeft: {
    flex: 1,
    gap: 4,
  },
  workerName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  deptText: {
    color: '#6B7280',
    fontSize: 11,
  },
  logRight: {
    alignItems: 'flex-end',
  },
  unitsValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: THEME.fonts.monoBold,
  },
  gradeBadge: {
    borderRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  gradeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  earningsText: {
    fontSize: 11,
    color: '#10B981',
    fontFamily: THEME.fonts.monoBold,
  },
});
