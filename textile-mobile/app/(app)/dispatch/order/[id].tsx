import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { THEME, COMMON_STYLES } from '../../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../../src/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { SyncEngine } from '../../../../src/lib/SyncEngine';
import { useAuthStore } from '../../../../src/store/AuthStore';

/**
 * SOVEREIGN ORDER PICK LIST (v2.0)
 * Interactive fulfillment screen for dispatch nodes.
 */

export default function OrderPickList() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [pickedItems, setPickedItems] = useState<string[]>([]); // Store IDs of picked batch codes
  const PROGRESS_KEY = `dispatch_progress_${id}`;

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-pick-list', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, code, parties(name),
          order_items(id, batch_id, quantity, batches(id, code, version, articles(name)))
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Restore Persistence
  useEffect(() => {
    const restore = async () => {
      const saved = await AsyncStorage.getItem(PROGRESS_KEY);
      if (saved) {
        setPickedItems(JSON.parse(saved));
      }
    };
    restore();
  }, [id]);

  const saveProgress = async (items: string[]) => {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(items));
  };

  const completeMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('orders')
        .update({ status: 'PACKED' })
        .eq('id', id);
      if (error) throw error;
      await AsyncStorage.removeItem(PROGRESS_KEY);
    },
    onSuccess: () => {
      Alert.alert('ORDER PACKED', 'Dispatched to loading bay.');
      queryClient.invalidateQueries({ queryKey: ['dispatch-orders'] });
      router.replace('/(app)/dispatch/');
    }
  });

  const nodeId = useAuthStore(s => s.nodeId);

  const handlePick = async (batchItem: any) => {
    if (pickedItems.includes(batchItem.batches.id)) return;
    
    const netState = await NetInfo.fetch();
    const payload = {
      batch_id: batchItem.batch_id,
      quantity: batchItem.quantity,
      expected_version: batchItem.batches.version,
      order_id: id,
      performed_by: nodeId
    };

    if (!netState.isConnected) {
      await SyncEngine.enqueue('PICK_BATCH', payload);
      const newItems = [...pickedItems, batchItem.batches.id];
      setPickedItems(newItems);
      saveProgress(newItems);
      Alert.alert('OFFLINE', 'Pick saved locally. Version check will occur on sync.');
      return;
    }

    const { data: result, error } = await supabase.rpc('pick_batch_stock', {
      p_batch_id: payload.batch_id,
      p_quantity: payload.quantity,
      p_expected_version: payload.expected_version,
      p_order_id: payload.order_id,
      p_performed_by: payload.performed_by
    });

    if (error) {
      Alert.alert('ERROR', error.message);
      return;
    }

    if (!result.success) {
      if (result.error === 'VERSION_CONFLICT') {
        Alert.alert('CONFLICT', 'Stock was updated by another node. Refreshing...');
        queryClient.invalidateQueries({ queryKey: ['order-pick-list', id] });
      } else {
        Alert.alert('ERROR', result.error);
      }
      return;
    }

    const newItems = [...pickedItems, batchItem.batches.id];
    setPickedItems(newItems);
    saveProgress(newItems);
  };

  const allPicked = order?.order_items && order.order_items.length > 0 && order.order_items.every((item: any) => 
    pickedItems.includes(item.batches?.id)
  );

  if (isLoading || !order) return (
    <View style={[COMMON_STYLES.container, styles.centered]}>
       <ActivityIndicator color={THEME.colors.gold} size="large" />
    </View>
  );

  const renderPickItem = ({ item }: { item: any }) => {
    const isPicked = pickedItems.includes(item.batches.id);
    return (
      <TouchableOpacity 
        style={[styles.itemCard, isPicked && styles.pickedCard]}
        onPress={() => handlePick(item)}
      >
        <View style={styles.itemHeader}>
          <Text style={styles.batchCode}>{item.batches.code}</Text>
          {isPicked && <Ionicons name="checkmark-circle" size={20} color={THEME.colors.status.success} />}
        </View>
        
        <Text style={styles.itemName}>{item.batches.articles.name}</Text>
        <Text style={styles.itemQty}>{item.quantity} SETS</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={COMMON_STYLES.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.gold} />
        </TouchableOpacity>
        <View style={styles.headerTitle}>
          <Text style={styles.sub}>PICK LIST FOR</Text>
          <Text style={styles.title}>{order.code}</Text>
        </View>
        <TouchableOpacity style={styles.scanBtn} onPress={() => router.push('/(app)/scanner')}>
          <Ionicons name="scan" size={20} color={THEME.colors.background} />
        </TouchableOpacity>
      </View>

      <View style={styles.partyInfo}>
        <Ionicons name="person-outline" size={16} color={THEME.colors.text.muted} />
        <Text style={styles.partyName}>{(order.parties as any)?.name || 'Unknown'}</Text>
      </View>

      <FlatList
        data={order.order_items}
        keyExtractor={React.useCallback((item: any) => item.id, [])}
        renderItem={renderPickItem}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
        ListEmptyComponent={() => (
           <View style={styles.empty}>
             <Text style={styles.emptyText}>No items found in this order</Text>
           </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.completeBtn, !allPicked && styles.disabledBtn]}
          onPress={() => completeMutation.mutate()}
          disabled={!allPicked || completeMutation.isPending}
        >
          {completeMutation.isPending ? (
            <ActivityIndicator color={THEME.colors.background} />
          ) : (
            <Text style={styles.completeText}>
              {allPicked ? 'COMPLETE PICK & PACK' : 'SCAN ALL ITEMS TO FINISH'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyText: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.mono },
  header: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 24, paddingTop: 60, backgroundColor: THEME.colors.surface },
  headerTitle: { flex: 1 },
  sub: { color: THEME.colors.text.muted, fontSize: 10, fontFamily: THEME.fonts.mono },
  title: { color: 'white', fontSize: 18, fontFamily: THEME.fonts.monoBold },
  scanBtn: { backgroundColor: THEME.colors.gold, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  partyInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  partyName: { color: THEME.colors.text.muted, fontSize: 12, fontFamily: THEME.fonts.interBold },
  listContent: { padding: 24, paddingBottom: 100, gap: 16 },
  itemCard: { backgroundColor: THEME.colors.surface, padding: 16, borderRadius: 4, borderWidth: 1, borderColor: THEME.colors.border },
  pickedCard: { borderColor: THEME.colors.status.success, borderLeftWidth: 4 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  batchCode: { color: THEME.colors.gold, fontFamily: THEME.fonts.mono, fontSize: 10 },
  itemName: { color: 'white', fontFamily: THEME.fonts.interBold, fontSize: 16, marginBottom: 4 },
  itemQty: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: THEME.colors.background, borderTopWidth: 1, borderTopColor: THEME.colors.border },
  completeBtn: { height: 56, backgroundColor: THEME.colors.gold, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { backgroundColor: THEME.colors.border },
  completeText: { color: THEME.colors.background, fontFamily: THEME.fonts.monoBold, fontSize: 14, letterSpacing: 1 }
});
