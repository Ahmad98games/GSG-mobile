import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { THEME, COMMON_STYLES } from '../../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../../src/lib/supabase';
import { useAuthStore } from '../../../../src/store/AuthStore';
import { Decimal } from 'decimal.js';
import NetInfo from '@react-native-community/netinfo';
import { SyncEngine } from '../../../../src/lib/SyncEngine';
import * as Crypto from 'expo-crypto';

/**
 * SOVEREIGN BATCH ACTION (v2.0)
 * Role-adaptive stock movement interface (IN/OUT).
 */

export default function BatchDetail() {
  const { code } = useLocalSearchParams();
  const { nodeRole, nodeId } = useAuthStore();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [quantity, setQuantity] = useState('');

  const { data: batch, isLoading } = useQuery({
    queryKey: ['batch', code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('batches')
        .select('*, articles(*)')
        .eq('code', code)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const movementMutation = useMutation({
    mutationFn: async (type: 'IN' | 'OUT') => {
      const netState = await NetInfo.fetch();
      const qty = parseInt(quantity);
      const note = `Mobile ${type} via ${nodeRole}`;

      if (!netState.isConnected) {
        await SyncEngine.enqueue('STOCK_DELTA', {
          action: type === 'IN' ? 'ADD' : 'SUBTRACT',
          amount: qty,
          timestamp: new Date().toISOString(),
          uuid: Crypto.randomUUID(),
          batchId: batch.id,
        });
        return { offline: true };
      }

      if (type === 'IN') {
        const { error } = await supabase.rpc('invoke_inward_protocol', {
          p_batch_id: batch.id,
          p_quantity: qty,
          p_performed_by: nodeId,
          p_note: note
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('stock_movements')
          .insert({
            batch_id: batch.id,
            movement_type: 'OUT',
            quantity: qty,
            performed_by: nodeId,
            note
          });
        if (error) throw error;
      }
      return { offline: false };
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['batch', code] });
      if (data?.offline) {
        Alert.alert('OFFLINE', 'Saved offline — will sync when connected.');
      } else {
        Alert.alert('SUCCESS', `Stock updated successfully.`);
      }
      router.back();
    }
  });

  if (isLoading) return <View style={COMMON_STYLES.container} />;

  const isDispatch = nodeRole === 'DISPATCH_BAY';
  const actionLabel = isDispatch ? 'OUTWARD DISPATCH' : 'INWARD RECEIPT';
  const actionColor = isDispatch ? THEME.colors.status.danger : THEME.colors.status.success;

  return (
    <ScrollView style={COMMON_STYLES.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.codeLabel}>BATCH {code}</Text>
        <Text style={styles.title}>{batch.articles.name}</Text>
        <Text style={styles.subTitle}>{batch.location || 'WAREHOUSE FLOOR'}</Text>
      </View>

      <View style={styles.stockCard}>
        <Text style={styles.stockLabel}>CURRENT STOCK</Text>
        <Text style={styles.stockValue}>{batch.suits_count} SETS</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{actionLabel} QUANTITY</Text>
        <TextInput
          style={[styles.largeInput, { color: actionColor }]}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={THEME.colors.border}
        />
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.mainAction, { backgroundColor: actionColor }]}
          onPress={() => movementMutation.mutate(isDispatch ? 'OUT' : 'IN')}
          disabled={movementMutation.isPending}
        >
          {movementMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.actionText}>CONFIRM {isDispatch ? 'OUT' : 'IN'}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.printBtn}>
          <Ionicons name="print" size={24} color={THEME.colors.gold} />
        </TouchableOpacity>
      </View>

      <View style={styles.footerInfo}>
        <Ionicons name="shield-checkmark" size={16} color={THEME.colors.text.muted} />
        <Text style={styles.footerText}>INDUSTRIAL AUDIT LOGGED ON CONFIRM</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 60 },
  header: { marginBottom: 32, paddingTop: 20 },
  codeLabel: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  title: { color: 'white', fontFamily: THEME.fonts.interBold, fontSize: 24 },
  subTitle: { color: THEME.colors.text.muted, fontSize: 14, marginTop: 4 },
  stockCard: { backgroundColor: THEME.colors.surface, padding: 20, borderRadius: 8, borderWidth: 1, borderColor: THEME.colors.border, marginBottom: 40 },
  stockLabel: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.mono, fontSize: 10, marginBottom: 4 },
  stockValue: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 24 },
  inputContainer: { marginBottom: 48 },
  inputLabel: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.mono, fontSize: 10, marginBottom: 8 },
  largeInput: { 
    fontFamily: THEME.fonts.monoBold, 
    fontSize: 64, 
    borderBottomWidth: 2, 
    borderBottomColor: THEME.colors.border,
    paddingBottom: 8,
  },
  actionRow: { flexDirection: 'row', gap: 16 },
  mainAction: { flex: 1, height: 64, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  actionText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 16, letterSpacing: 1 },
  printBtn: { width: 64, height: 64, backgroundColor: THEME.colors.surface, borderRadius: 4, borderWidth: 1, borderColor: THEME.colors.border, justifyContent: 'center', alignItems: 'center' },
  footerInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 32, justifyContent: 'center' },
  footerText: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.mono, fontSize: 10 }
});
