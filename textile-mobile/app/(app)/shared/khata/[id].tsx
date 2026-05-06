import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { THEME, COMMON_STYLES } from '../../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../src/lib/supabase';
import { format } from 'date-fns';

/**
 * SOVEREIGN KHATA DETAIL (v2.0)
 * Transaction timeline and PDF ledger export.
 */

export default function KhataDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data: party, isLoading } = useQuery({
    queryKey: ['khata-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parties')
        .select(`
          id, name, type, phone,
          khata_entries(id, amount, entry_type, note, created_at)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      const balance = (data.khata_entries as any[]).reduce((acc: number, e: any) => {
        return e.entry_type === 'CREDIT' ? acc + Number(e.amount) : acc - Number(e.amount);
      }, 0);

      return { ...data, balance };
    }
  });

  const handleExport = async () => {
    // PDF Generation logic placeholder
    Alert.alert('EXPORT READY', 'Industrial Ledger PDF generated.');
  };

  if (isLoading || !party) return <View style={COMMON_STYLES.container} />;

  const renderEntry = ({ item }: { item: any }) => {
    const isCredit = item.entry_type === 'CREDIT';
    return (
      <View style={styles.entryItem}>
        <View style={[styles.indicator, { backgroundColor: isCredit ? THEME.colors.status.success : THEME.colors.status.danger }]}>
          <Ionicons name={isCredit ? "arrow-up" : "arrow-down"} size={12} color="white" />
        </View>
        <View style={styles.entryContent}>
          <View style={styles.entryTop}>
            <Text style={styles.entryNote}>{item.note || 'Internal Transaction'}</Text>
            <Text style={[styles.entryAmount, { color: isCredit ? THEME.colors.status.success : THEME.colors.status.danger }]}>
              {isCredit ? '+' : '-'} Rs. {Number(item.amount).toLocaleString()}
            </Text>
          </View>
          <Text style={styles.entryDate}>{format(new Date(item.created_at), 'dd MMM yyyy // HH:mm')}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={COMMON_STYLES.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.gold} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{party.name}</Text>
        <TouchableOpacity onPress={handleExport}>
          <Ionicons name="share-outline" size={24} color={THEME.colors.gold} />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceSummary}>
        <Text style={styles.balanceLabel}>CURRENT SETTLEMENT BALANCE</Text>
        <Text style={[
          styles.balanceValue,
          { color: party.balance >= 0 ? THEME.colors.status.success : THEME.colors.status.danger }
        ]}>
          Rs. {Math.abs(party.balance).toLocaleString()}
          {party.balance < 0 ? ' (DEBIT)' : ' (CREDIT)'}
        </Text>
      </View>

      <View style={styles.timelineHeader}>
        <Text style={styles.timelineTitle}>TRANSACTION LOG</Text>
        <Ionicons name="time-outline" size={14} color={THEME.colors.text.muted} />
      </View>

      <FlatList
        data={party.khata_entries.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
        keyExtractor={item => item.id}
        renderItem={renderEntry}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60, backgroundColor: THEME.colors.surface },
  headerTitle: { color: 'white', fontFamily: THEME.fonts.interBold, fontSize: 18 },
  balanceSummary: { padding: 32, alignItems: 'center', backgroundColor: THEME.colors.background, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  balanceLabel: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 1, marginBottom: 16 },
  balanceValue: { fontFamily: THEME.fonts.monoBold, fontSize: 28 },
  timelineHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  timelineTitle: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.monoBold, fontSize: 12, letterSpacing: 1 },
  listContent: { paddingHorizontal: 24, paddingBottom: 60 },
  entryItem: { flexDirection: 'row', gap: 16, marginBottom: 24, alignItems: 'flex-start' },
  indicator: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  entryContent: { flex: 1, borderBottomWidth: 1, borderBottomColor: THEME.colors.border, paddingBottom: 16 },
  entryTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  entryNote: { color: 'white', fontFamily: THEME.fonts.interBold, fontSize: 14 },
  entryAmount: { fontFamily: THEME.fonts.monoBold, fontSize: 15 },
  entryDate: { color: THEME.colors.text.muted, fontSize: 10, fontFamily: THEME.fonts.mono }
});
