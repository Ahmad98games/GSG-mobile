import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FinanceDataService } from '../../../src/services/FinanceDataService';
import { formatCurrency } from '../../../src/lib/currency/formatCurrency';
import { THEME } from '../../../src/constants/theme';

const GOLD = '#C6A756';
const RED = '#C44B4B';
const BG = '#0A0A0A';
const CARD = '#111111';
const BORDER = '#1F1F1F';

export default function KarigarsList() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: karigars, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ['karigars-list'],
    queryFn: async () => {
      const res = await FinanceDataService.fetchKarigars();
      return res.karigars || [];
    }
  });

  const filteredKarigars = useMemo(() => {
    if (!karigars) return [];
    if (!search.trim()) return karigars;
    const query = search.toLowerCase();
    return karigars.filter((k: any) =>
      (k.name || '').toLowerCase().includes(query) ||
      (k.code || k.karigar_code || '').toLowerCase().includes(query)
    );
  }, [karigars, search]);

  const handleRefresh = async () => {
    await refetch();
  };

  const renderKarigarItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/(app)/karigars/[id]', params: { id: item.id } })}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.code}>{item.code || `K-${item.id.slice(0, 4).toUpperCase()}`}</Text>
          </View>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>OUTSTANDING</Text>
            <Text style={[styles.balanceValue, { color: item.balance > 0 ? GOLD : '#10B981' }]}>
              {formatCurrency(item.balance || 0)}
            </Text>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.statusText}>ACTIVE</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#666" />
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={GOLD} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Karigars', 
        headerStyle: { backgroundColor: BG }, 
        headerTintColor: 'white',
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 14 }
      }} />

      {/* Search Input Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#666" style={styles.searchIcon} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or code..."
          placeholderTextColor="#666"
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredKarigars}
        keyExtractor={(item) => item.id}
        renderItem={renderKarigarItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            tintColor={GOLD}
          />
        }
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#444" />
            <Text style={styles.emptyText}>No Karigars found in registry</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered: { justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  code: { color: GOLD, fontSize: 10, fontWeight: '900', marginTop: 4, letterSpacing: 1 },
  balanceContainer: { alignItems: 'flex-end' },
  balanceLabel: { color: '#666', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  balanceValue: { fontSize: 14, fontWeight: '700', marginTop: 4, fontFamily: 'JetBrains Mono' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { color: '#10B981', fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  emptyContainer: { padding: 40, alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { color: '#666', fontSize: 14, marginTop: 12, fontFamily: 'JetBrains Mono' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  searchIcon: {
    marginRight: 4,
  },
  searchInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'JetBrains Mono',
  },
});
