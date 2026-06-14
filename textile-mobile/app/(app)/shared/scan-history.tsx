import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { THEME, COMMON_STYLES } from '../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../src/lib/supabase';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';

/**
 * SOVEREIGN SCAN HISTORY (v2.0)
 * Industrial traceability with client-side filtering.
 */

type ScanType = 'ALL' | 'ARTICLE' | 'BATCH' | 'JOB';

export default function ScanHistory() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState<ScanType>('ALL');
  const { code } = useLocalSearchParams<{ code?: string }>();

  useEffect(() => {
    navigation.setOptions({
      title: 'Scan History',
      headerStyle: {
        backgroundColor: '#0A0C0F',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 15,
      },
    });
  }, []);

  const { data: scans = [], isLoading } = useQuery({
    queryKey: ['scan-history'],
    queryFn: async () => {
      const { data } = await supabase
        .from('scan_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      return data || [];
    }
  });

  const filteredScans = scans.filter((s: any) => {
    const typeMatch = filter === 'ALL' || s.scan_type === filter;
    const codeMatch = !code || s.code === code;
    return typeMatch && codeMatch;
  });

  const FilterChip = ({ type, label }: { type: ScanType, label: string }) => (
    <TouchableOpacity 
      style={[styles.chip, filter === type && styles.chipActive]}
      onPress={() => setFilter(type)}
    >
      <Text style={[styles.chipText, filter === type && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.scanItem}>
      <View style={styles.scanIcon}>
        <Ionicons 
            name={item.scan_type === 'BATCH' ? 'layers' : item.scan_type === 'ARTICLE' ? 'shirt' : 'construct'} 
            size={16} 
            color={THEME.colors.gold} 
        />
      </View>
      <View style={styles.scanInfo}>
        <Text style={styles.scanCode}>{item.code}</Text>
        <Text style={styles.scanMeta}>{item.scan_type} • {format(new Date(item.created_at), 'MMM dd, HH:mm')}</Text>
      </View>
      <TouchableOpacity>
        <Ionicons name="chevron-forward" size={16} color={THEME.colors.border} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={COMMON_STYLES.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SCAN LOGS</Text>
      </View>

      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <FilterChip type="ALL" label="ALL" />
          <FilterChip type="ARTICLE" label="ARTICLE" />
          <FilterChip type="BATCH" label="BATCH" />
          <FilterChip type="JOB" label="JOB ORDER" />
        </ScrollView>
      </View>

      <FlashList
        data={filteredScans}
        renderItem={renderItem}
        estimatedItemSize={70}
        contentContainerStyle={{ padding: 24 }}
        ListEmptyComponent={() => (
           <View style={styles.empty}>
              <Text style={styles.emptyText}>{isLoading ? 'LOADING TELEMETRY...' : 'NO SCANS RECORDED'}</Text>
           </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 24, paddingTop: 60 },
  title: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 24 },
  filterRow: { marginBottom: 12 },
  filterScroll: { paddingHorizontal: 24, gap: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: THEME.colors.border },
  chipActive: { backgroundColor: THEME.colors.gold, borderColor: THEME.colors.gold },
  chipText: { color: THEME.colors.text.muted, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  chipTextActive: { color: THEME.colors.background },
  scanItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: THEME.colors.border },
  scanIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(198, 167, 86, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  scanInfo: { flex: 1 },
  scanCode: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  scanMeta: { color: THEME.colors.text.muted, fontSize: 10, fontFamily: THEME.fonts.mono, marginTop: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
  emptyText: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.mono, fontSize: 12 }
});
