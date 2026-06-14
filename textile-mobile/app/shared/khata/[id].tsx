import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../../src/lib/supabase';
import * as Print from 'expo-print';
import { PartyActions } from '@/components/ui/PartyActions';

const GOLD = '#C6A756';
const RED = '#C44B4B';
const GREEN = '#3D9970';
const BG = '#0A0A0A';
const CARD = '#111111';

export default function KhataDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const navigation = useNavigation();

  const { data: party, isLoading: partyLoading } = useQuery({
    queryKey: ['party', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('parties').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    navigation.setOptions({
      title: party?.name || 'Khata Detail',
      headerStyle: {
        backgroundColor: '#0A0C0F',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: '600',
        fontSize: 15,
      },
    });
  }, [party?.name]);

  const { data: transactions, isLoading: txLoading } = useQuery({
    queryKey: ['transactions', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('ledger').select('*').eq('party_id', id).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleExport = async () => {
    if (!party || !transactions) return;
    const html = `
      <html>
        <body style="font-family: sans-serif; padding: 40px; background: #FFF;">
          <h1>LEDGER STATEMENT</h1>
          <h3>PARTY: ${party.name}</h3>
          <p>BALANCE: Rs. ${party.balance}</p>
          <hr/>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #EEE;">
                <th style="padding: 10px; border: 1px solid #CCC;">DATE</th>
                <th style="padding: 10px; border: 1px solid #CCC;">DESC</th>
                <th style="padding: 10px; border: 1px solid #CCC;">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map((t: any) => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #CCC;">${new Date(t.created_at).toLocaleDateString()}</td>
                  <td style="padding: 10px; border: 1px solid #CCC;">${t.category}</td>
                  <td style="padding: 10px; border: 1px solid #CCC;">Rs. ${t.amount}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    await Share.share({ url: uri, title: `Khata_${party.name}` });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.txRow}>
      <View style={[styles.txIcon, { backgroundColor: item.transaction_type === 'credit' ? '#1a2e25' : '#2e1a1a' }]}>
        <Ionicons 
          name={item.transaction_type === 'credit' ? 'arrow-up' : 'arrow-down'} 
          size={16} 
          color={item.transaction_type === 'credit' ? GREEN : RED} 
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txTitle}>{item.category.toUpperCase()}</Text>
        <Text style={styles.txDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
      </View>
      <Text style={[styles.txAmount, { color: item.transaction_type === 'credit' ? GREEN : RED }]}>
        {item.transaction_type === 'credit' ? '+' : '-'} Rs. {item.amount.toLocaleString()}
      </Text>
    </View>
  );

  if (partyLoading) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <Text style={styles.partyName}>{party?.name}</Text>
          <Text style={styles.partyType}>{party?.type.toUpperCase()}</Text>
        </View>
        <TouchableOpacity onPress={handleExport} style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={22} color={GOLD} />
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>CURRENT BALANCE</Text>
        <Text style={[styles.heroBalance, { color: party?.balance >= 0 ? GOLD : RED }]}>
          Rs. {Math.abs(party?.balance || 0).toLocaleString()}
        </Text>
        <PartyActions
          name={party?.name || ''}
          phone={party?.phone || ''}
          balance={Math.abs(party?.balance || 0)}
          type={party?.type as 'customer' | 'supplier'}
        />
        <TouchableOpacity style={styles.invoiceBtn}>
          <Text style={styles.invoiceText}>NEW INVOICE</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timeline}>
        <Text style={styles.timelineTitle}>TRANSACTION TIMELINE</Text>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { height: 110, paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#1F1F1F' },
  backBtn: { padding: 4 },
  titleArea: { alignItems: 'center' },
  partyName: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: -0.5 },
  partyType: { color: GOLD, fontSize: 8, fontWeight: '900', marginTop: 2, letterSpacing: 2 },
  actionBtn: { padding: 4 },
  
  hero: { backgroundColor: CARD, padding: 40, alignItems: 'center', borderBottomWidth: 1, borderColor: '#1F1F1F' },
  heroLabel: { color: '#888', fontSize: 9, fontWeight: '900', letterSpacing: 3, marginBottom: 12 },
  heroBalance: { fontSize: 44, fontWeight: '900', letterSpacing: -2, fontFamily: 'JetBrains Mono' },
  invoiceBtn: { marginTop: 32, paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#1F1F1F', borderRadius: 12, borderWidth: 1, borderColor: GOLD },
  invoiceText: { color: GOLD, fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  
  timeline: { flex: 1, padding: 24 },
  timelineTitle: { color: '#888', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 24 },
  list: { paddingBottom: 40 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, borderBottomWidth: 1, borderColor: '#1F1F1F' },
  txIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  txInfo: { flex: 1 },
  txTitle: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  txDate: { color: '#444', fontSize: 9, fontWeight: '800', marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '900', fontFamily: 'JetBrains Mono' },
});
