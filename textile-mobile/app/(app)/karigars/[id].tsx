import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { FinanceDataService } from '@/services/FinanceDataService';
import { PartyActions } from '@/components/ui/PartyActions';
import { formatCurrency } from '@/lib/currency/formatCurrency';

const GOLD = '#C6A756';
const RED = '#C44B4B';
const BG = '#0A0A0A';
const CARD = '#111111';
const BORDER = '#1F1F1F';

export default function KarigarDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const { data: karigar, isLoading } = useQuery({
    queryKey: ['karigar-detail', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('karigars')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        const res = await FinanceDataService.fetchKarigars();
        const match = (res.karigars || []).find((k: any) => k.id === id);
        if (!match) throw new Error('Karigar not found');
        return {
          id: match.id,
          name: match.name,
          code: match.code,
          balance: match.balance,
          phone: '' // Fallback if no phone in registry
        };
      }
      return data;
    }
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={GOLD} size="large" />
      </View>
    );
  }

  if (!karigar) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Karigar Profile Not Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'KARIGAR PROFILE', 
        headerStyle: { backgroundColor: BG }, 
        headerTintColor: 'white',
        headerTitleStyle: { fontFamily: 'JetBrains Mono', fontSize: 12 }
      }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.titleArea}>
          <Text style={styles.karigarName}>{karigar.name}</Text>
          <Text style={styles.karigarCode}>{karigar.code || `K-${karigar.id.slice(0, 4).toUpperCase()}`}</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroLabel}>PESHGI BALANCE (OUTSTANDING)</Text>
        <Text style={[styles.heroBalance, { color: karigar.balance > 0 ? GOLD : '#10B981' }]}>
          {formatCurrency(Math.abs(karigar.balance || 0))}
        </Text>
        
        <PartyActions
          name={karigar.name}
          phone={karigar.phone || ''}
          balance={karigar.balance}
          type="karigar"
        />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>FLOOR telemetry</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>STATUS</Text>
            <Text style={styles.infoValue}>ACTIVE ON FLOOR</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>PHONE</Text>
            <Text style={styles.infoValue}>{karigar.phone || 'NOT SET'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  centered: { justifyContent: 'center', alignItems: 'center' },
  errorText: { color: RED, fontFamily: 'JetBrains Mono', fontSize: 14 },
  header: { height: 110, paddingTop: 60, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: BORDER },
  backBtn: { padding: 4 },
  titleArea: { alignItems: 'center' },
  karigarName: { color: '#FFF', fontSize: 16, fontWeight: '900', letterSpacing: -0.5 },
  karigarCode: { color: GOLD, fontSize: 8, fontWeight: '900', marginTop: 2, letterSpacing: 2 },
  hero: { backgroundColor: CARD, padding: 32, alignItems: 'center', borderBottomWidth: 1, borderColor: BORDER },
  heroLabel: { color: '#888', fontSize: 9, fontWeight: '900', letterSpacing: 3, marginBottom: 12 },
  heroBalance: { fontSize: 44, fontWeight: '900', letterSpacing: -2, fontFamily: 'JetBrains Mono', marginBottom: 8 },
  infoSection: { padding: 24 },
  sectionTitle: { color: '#888', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' },
  infoCard: { backgroundColor: CARD, borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 20 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  infoLabel: { color: '#666', fontSize: 10, fontWeight: 'bold' },
  infoValue: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: BORDER, marginVertical: 8 }
});
