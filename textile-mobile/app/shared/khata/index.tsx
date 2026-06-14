import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../src/lib/supabase';

const GOLD = '#C6A756';
const RED = '#C44B4B';
const GREEN = '#3D9970';
const BG = '#0A0A0A';
const CARD = '#111111';

export default function KhataList() {
  const [search, setSearch] = useState('');
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

  const { data: parties, isLoading } = useQuery({
    queryKey: ['parties'],
    queryFn: async () => {
      const { data, error } = await supabase.from('parties').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const filtered = parties?.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/shared/khata/${item.id}`)}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.partyName}>{item.name}</Text>
        <Text style={styles.partyType}>{item.type.toUpperCase()}</Text>
      </View>
      <View style={styles.balanceArea}>
        <Text style={[styles.balance, { color: item.balance >= 0 ? GREEN : RED }]}>
          Rs. {Math.abs(item.balance).toLocaleString()}
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#444" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerSub}>INDUSTRIAL LEDGER</Text>
        <Text style={styles.headerTitle}>KHATA REGISTRY</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color="#444" />
        <TextInput
          style={styles.input}
          placeholder="SEARCH HANDS..."
          placeholderTextColor="#444"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>NO ACTIVE HANDS FOUND</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingTop: 60 },
  header: { paddingHorizontal: 24, marginBottom: 24 },
  headerSub: { color: GOLD, fontSize: 10, fontWeight: '900', letterSpacing: 4 },
  headerTitle: { color: '#FFF', fontSize: 24, fontWeight: '900', letterSpacing: -1 },
  
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD, marginHorizontal: 24, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#1F1F1F', marginBottom: 24 },
  input: { flex: 1, height: 48, color: '#FFF', marginLeft: 12, fontSize: 12, fontWeight: '700' },
  
  list: { paddingHorizontal: 24, paddingBottom: 40 },
  card: { flexDirection: 'row', backgroundColor: CARD, padding: 20, borderRadius: 16, marginBottom: 12, alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#1F1F1F' },
  cardInfo: { flex: 1 },
  partyName: { color: '#FFF', fontSize: 14, fontWeight: '800' },
  partyType: { color: GOLD, fontSize: 8, fontWeight: '900', marginTop: 4, letterSpacing: 1 },
  balanceArea: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  balance: { fontSize: 14, fontWeight: '900', fontFamily: 'JetBrains Mono' },
  empty: { color: '#444', textAlign: 'center', marginTop: 40, fontSize: 10, fontWeight: '900', letterSpacing: 1 },
});
