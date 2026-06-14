import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { THEME, COMMON_STYLES } from '../../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../../src/lib/supabase';
import { formatCurrency } from '../../../../src/lib/currency/formatCurrency';

/**
 * SOVEREIGN KHATA HOME (v2.0)
 * Industrial ledger management for parties.
 */

export default function KhataHome() {
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      title: 'Party Ledger',
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

  const [search, setSearch] = useState('');
  
  const { data: parties, isLoading, refetch } = useQuery({
    queryKey: ['khata-parties'],
    queryFn: async () => {
      // Fetch parties with their total KHATA balance
      const { data, error } = await supabase
        .from('parties')
        .select(`
          id, name, type, phone,
          khata_entries(amount, entry_type)
        `)
        .order('name', { ascending: true });
      
      if (error) throw error;

      // Calculate aggregated balances
      return data.map(p => {
        const balance = p.khata_entries.reduce((acc: number, e: any) => {
          return e.entry_type === 'CREDIT' ? acc + Number(e.amount) : acc - Number(e.amount);
        }, 0);
        return { ...p, balance };
      });
    }
  });

  const filteredParties = parties?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderPartyCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={COMMON_STYLES.card}
      onPress={() => router.push(`/shared/khata/${item.id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.partyType}>{item.type}</Text>
        <Ionicons name="chevron-forward" size={16} color={THEME.colors.border} />
      </View>

      <Text style={styles.partyName}>{item.name}</Text>
      
      <View style={styles.balanceRow}>
        <Text style={styles.balanceLabel}>CURRENT BALANCE</Text>
        <Text style={[
          styles.balanceValue,
          { color: item.balance >= 0 ? THEME.colors.status.success : THEME.colors.status.danger }
        ]}>
          {formatCurrency(Math.abs(item.balance))}
          {item.balance < 0 ? ' (DR)' : ' (CR)'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={COMMON_STYLES.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PARTY LEDGER</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={THEME.colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Party Name..."
            placeholderTextColor={THEME.colors.text.muted}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <FlatList
        data={filteredParties}
        keyExtractor={item => item.id}
        renderItem={renderPartyCard}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={THEME.colors.gold} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 24, paddingTop: 60, backgroundColor: THEME.colors.surface },
  title: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 20, marginBottom: 16, letterSpacing: 1 },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: THEME.colors.background, 
    paddingHorizontal: 16, 
    borderRadius: 4, 
    height: 48,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchInput: { flex: 1, marginLeft: 12, color: 'white', fontFamily: THEME.fonts.inter },
  listContent: { padding: 24, gap: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  partyType: { color: THEME.colors.text.muted, fontSize: 10, fontFamily: THEME.fonts.mono },
  partyName: { color: 'white', fontFamily: THEME.fonts.interBold, fontSize: 18, marginBottom: 16 },
  balanceRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: THEME.colors.border,
    paddingTop: 12,
  },
  balanceLabel: { color: THEME.colors.text.muted, fontSize: 10, fontFamily: THEME.fonts.mono },
  balanceValue: { fontFamily: THEME.fonts.monoBold, fontSize: 16 }
});
