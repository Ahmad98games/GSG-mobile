import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  ScrollView, 
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { 
  Users, 
  Search, 
  Package, 
  Barcode, 
  Plus, 
  Minus, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight,
  ChevronLeft,
  X
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  FadeIn, 
  FadeInRight,
  FadeInLeft,
  Layout
} from 'react-native-reanimated';
import { Decimal } from 'decimal.js';
import { FinanceDataService } from '../../../src/services/FinanceDataService';
import { ScannerService } from '../../../src/services/ScannerService';
import { queueManager } from '../../../src/services/OfflineQueueManager';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { formatCurrency } from '../../../src/lib/currency/formatCurrency';
import * as Haptics from 'expo-haptics';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Party = {
  id: string;
  name: string;
  balance: number;
  credit_limit: number;
  is_over_limit?: boolean;
};

type InvoiceItem = {
  sku_id: string;
  sku_code: string;
  name: string;
  qty: number;
  price: number;
};

export default function NewInvoiceScreen() {
  const router = useRouter();
  const { connectionState } = useBridgeStatus();
  const { barcode } = useLocalSearchParams<{ barcode?: string }>();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Step 1 State
  const [searchQuery, setSearchQuery] = useState('');
  const [parties, setParties] = useState<Party[]>([]);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  
  // Step 2 State
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  // Step 3 State
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank' | 'JazzCash' | 'EasyPaisa'>('Cash');
  const [amountReceived, setAmountReceived] = useState('');

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc.plus(new Decimal(item.price).times(item.qty)), new Decimal(0));
  }, [items]);

  const changeDue = useMemo(() => {
    if (!amountReceived) return new Decimal(0);
    const received = new Decimal(amountReceived || 0);
    return received.minus(subtotal).clamp(0, Infinity);
  }, [amountReceived, subtotal]);

  // Actions
  const handlePartySearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) return;
    
    setLoading(true);
    try {
      // In a real app, we'd debounce this and call a search API.
      const res = await FinanceDataService.fetchParties('customer');
      const filtered = (res.parties || []).filter((p: any) => 
        p.name.toLowerCase().includes(query.toLowerCase())
      ).map((p: any) => ({
        ...p,
        is_over_limit: p.balance > p.credit_limit
      }));
      setParties(filtered);
    } catch (e) {
      console.error('[Invoice] Party fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (barcode: string) => {
    setLoading(true);
    try {
      const sku = await ScannerService.lookupBarcode(barcode);
      if (sku) {
        const skuId = (sku as any).sku_id || (sku as any).skuId;
        const existing = items.find(i => i.sku_id === skuId);
        if (existing) {
          setItems(items.map(i => i.sku_id === skuId ? { ...i, qty: i.qty + 1 } : i));
        } else {
          setItems([...items, {
            sku_id: (sku as any).sku_id || (sku as any).skuId || '',
            sku_code: (sku as any).sku_code || (sku as any).skuCode || '',
            name: sku.name || 'UNKNOWN_ITEM',
            qty: 1,
            price: (sku as any).sale_price || (sku as any).salePrice || 0
          }]);
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Alert.alert('Not Found', `SKU with barcode ${barcode} not found.`);
      }
    } catch (e) {
      console.error('[Invoice] SKU lookup failed', e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (barcode) {
      addItem(barcode);
    }
  }, [barcode]);

  const updateQty = (id: string, delta: number) => {
    setItems(items.map(i => {
      if (i.sku_id === id) {
        const newQty = Math.max(0, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }).filter(i => i.qty > 0));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSubmit = async () => {
    if (!selectedParty || items.length === 0) return;
    
    const request = {
      party_id: selectedParty.id,
      items: items.map(i => ({ sku_id: i.sku_id, qty: i.qty, price: i.price })),
      payment_method: paymentMethod,
      amount_received: parseFloat(amountReceived || '0'),
      total: subtotal.toNumber(),
      timestamp: Date.now()
    };

    setLoading(true);
    try {
      if (connectionState === 'connected') {
        // Mocking NSP send for InvoiceCreateRequest
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Invoice created successfully: #INV-9902');
        router.back();
      } else {
        await queueManager.enqueueNspEvent({ invoice_create_req: request });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Queued', 'Invoice queued — will post when connected to Hub');
        router.back();
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false, title: step === 1 ? 'SELECT PARTY' : step === 2 ? 'ADD ITEMS' : 'PAYMENT',
        headerStyle: { backgroundColor: THEME.colors.bg },
        headerTintColor: THEME.colors.textPrimary,
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 14 },
      }} />
      <ScreenHeader title="New" showBack={true} />

      {/* STEP INDICATOR */}
      <View style={styles.stepIndicator}>
        {[1, 2, 3].map(s => (
          <View 
            key={s} 
            style={[
              styles.stepDot, 
              step === s && styles.stepDotActive,
              step > s && styles.stepDotDone
            ]} 
          />
        ))}
      </View>

      <View style={styles.content}>
        {step === 1 && (
          <Animated.View entering={FadeInRight} style={styles.stepContainer}>
            <View style={styles.searchBox}>
              <Search size={20} color={THEME.colors.textSecondary} />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search parties..."
                placeholderTextColor={THEME.colors.textMuted}
                value={searchQuery}
                onChangeText={handlePartySearch}
                autoFocus
              />
              {loading && <ActivityIndicator size="small" color={THEME.colors.gold} />}
            </View>

            <Text style={styles.sectionTitle}>RECENT_PARTIES</Text>
            <View style={styles.chipRow}>
              {['Ahmad Electronics', 'Bilal Traders', 'Crescent Mill'].map(p => (
                <TouchableOpacity key={p} style={styles.chip} onPress={() => {
                  setSelectedParty({ id: Math.random().toString(), name: p, balance: 12500, credit_limit: 50000 });
                  setStep(2);
                }}>
                  <Text style={styles.chipText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList 
              data={parties}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.partyCard, selectedParty?.id === item.id && styles.selectedCard]}
                  onPress={() => setSelectedParty(item)}
                >
                  <View style={styles.partyInfo}>
                    <Text style={styles.partyName}>{item.name}</Text>
                    <Text style={[styles.partyBalance, item.is_over_limit && { color: THEME.colors.critical }]}>
                      Balance: {formatCurrency(item.balance)}
                    </Text>
                  </View>
                  {item.is_over_limit && (
                    <View style={styles.limitBadge}>
                      <Text style={styles.limitText}>OVER LIMIT</Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            />

            {selectedParty && (
              <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(2)}>
                <Text style={styles.nextBtnText}>PROCEED_TO_ITEMS</Text>
                <ChevronRight size={20} color="white" />
              </TouchableOpacity>
            )}
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInRight} style={styles.stepContainer}>
             <View style={styles.actionRow}>
                <TouchableOpacity style={styles.scanBtn} onPress={() => addItem('8901234567890')}>
                  <Barcode size={24} color={THEME.colors.blue} />
                  <Text style={styles.scanBtnText}>SCAN_BARCODE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.manualBtn}>
                  <Search size={20} color={THEME.colors.textSecondary} />
                </TouchableOpacity>
             </View>

             <Text style={styles.sectionTitle}>CART_ITEMS ({items.length})</Text>
             <FlatList 
               data={items}
               keyExtractor={item => item.sku_id}
               renderItem={({ item }) => (
                 <View style={styles.itemCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemSub}>{item.sku_code} • {formatCurrency(item.price)}</Text>
                    </View>
                    <View style={styles.stepper}>
                       <TouchableOpacity style={styles.stepIcon} onPress={() => updateQty(item.sku_id, -1)}>
                          <Minus size={16} color="white" />
                       </TouchableOpacity>
                       <Text style={styles.qtyText}>{item.qty}</Text>
                       <TouchableOpacity style={styles.stepIcon} onPress={() => updateQty(item.sku_id, 1)}>
                          <Plus size={16} color="white" />
                       </TouchableOpacity>
                    </View>
                 </View>
               )}
               ListEmptyComponent={
                 <View style={styles.emptyCart}>
                   <Package size={48} color={THEME.colors.surface} />
                   <Text style={styles.emptyText}>CART_IS_EMPTY</Text>
                 </View>
               }
             />

             <View style={styles.footer}>
                <View style={styles.totalRow}>
                   <Text style={styles.totalLabel}>RUNNING_TOTAL</Text>
                   <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
                </View>
                <View style={styles.navRow}>
                   <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                      <ChevronLeft size={20} color={THEME.colors.textSecondary} />
                   </TouchableOpacity>
                   <TouchableOpacity 
                    style={[styles.nextBtn, { flex: 1, marginLeft: 12 }, items.length === 0 && styles.disabledBtn]} 
                    disabled={items.length === 0}
                    onPress={() => setStep(3)}
                   >
                      <Text style={styles.nextBtnText}>CHECKOUT</Text>
                      <ChevronRight size={20} color="white" />
                   </TouchableOpacity>
                </View>
             </View>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeInRight} style={styles.stepContainer}>
             <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>TOTAL_DUE</Text>
                <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
                <Text style={styles.partySummary}>{selectedParty?.name}</Text>
             </View>

             <Text style={styles.sectionTitle}>PAYMENT_METHOD</Text>
             <View style={styles.methodGrid}>
                {['Cash', 'Bank', 'JazzCash', 'EasyPaisa'].map(m => (
                  <TouchableOpacity 
                    key={m} 
                    style={[styles.methodBtn, paymentMethod === m && styles.selectedMethod]}
                    onPress={() => setPaymentMethod(m as any)}
                  >
                    <CreditCard size={20} color={paymentMethod === m ? 'white' : THEME.colors.textSecondary} />
                    <Text style={[styles.methodText, paymentMethod === m && { color: 'white' }]}>{m.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
             </View>

             <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>AMOUNT_RECEIVED</Text>
                <TextInput 
                  style={styles.largeInput}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={THEME.colors.surface}
                  value={amountReceived}
                  onChangeText={setAmountReceived}
                />
             </View>

             <View style={styles.changeBox}>
                <Text style={styles.changeLabel}>CHANGE_DUE</Text>
                <Text style={styles.changeValue}>{formatCurrency(changeDue)}</Text>
             </View>

             <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : (
                  <>
                    <CheckCircle2 size={24} color="white" />
                    <Text style={styles.submitBtnText}>CREATE_INVOICE</Text>
                  </>
                )}
             </TouchableOpacity>

             <TouchableOpacity style={styles.backBtnFull} onPress={() => setStep(2)}>
                <Text style={styles.backBtnText}>BACK_TO_ITEMS</Text>
             </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  stepIndicator: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingVertical: 12 },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME.colors.surface },
  stepDotActive: { backgroundColor: THEME.colors.gold, width: 24 },
  stepDotDone: { backgroundColor: THEME.colors.blue },
  content: { flex: 1, padding: 20 },
  stepContainer: { flex: 1 },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: THEME.colors.surface, 
    borderRadius: 12, 
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 20
  },
  searchInput: { flex: 1, marginLeft: 10, color: 'white', fontFamily: THEME.fonts.monoBold },
  sectionTitle: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold, marginBottom: 12, letterSpacing: 1 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chip: { backgroundColor: THEME.colors.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: THEME.colors.border },
  chipText: { color: THEME.colors.textPrimary, fontSize: 12, fontWeight: '600' },
  partyCard: { 
    backgroundColor: THEME.colors.surface, 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 10, 
    flexDirection: 'row', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  selectedCard: { borderColor: THEME.colors.gold, backgroundColor: 'rgba(197, 160, 89, 0.05)' },
  partyInfo: { flex: 1 },
  partyName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  partyBalance: { color: THEME.colors.textSecondary, fontSize: 12, marginTop: 4 },
  limitBadge: { backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  limitText: { color: THEME.colors.critical, fontSize: 8, fontWeight: 'bold' },
  nextBtn: { 
    backgroundColor: THEME.colors.gold, 
    height: 60, 
    borderRadius: 16, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    gap: 10
  },
  nextBtnText: { color: 'white', fontSize: 14, fontFamily: THEME.fonts.monoExtraBold },
  disabledBtn: { opacity: 0.5 },
  
  // Step 2 Styles
  actionRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  scanBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(96, 165, 250, 0.1)', 
    height: 60, 
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.blue,
    gap: 12
  },
  scanBtnText: { color: THEME.colors.blue, fontFamily: THEME.fonts.monoBold, fontSize: 12 },
  manualBtn: { 
    width: 60, 
    height: 60, 
    backgroundColor: THEME.colors.surface, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  itemCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: THEME.colors.surface, 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  itemName: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  itemSub: { color: THEME.colors.textSecondary, fontSize: 11, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: THEME.colors.border, justifyContent: 'center', alignItems: 'center' },
  qtyText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 16 },
  emptyCart: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 40, opacity: 0.5 },
  emptyText: { color: THEME.colors.textMuted, fontFamily: THEME.fonts.monoBold, fontSize: 12, marginTop: 12 },
  footer: { marginTop: 'auto', borderTopWidth: 1, borderTopColor: THEME.colors.border, paddingTop: 20, marginBottom: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  totalLabel: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  totalValue: { color: THEME.colors.gold, fontSize: 24, fontFamily: THEME.fonts.monoExtraBold },
  navRow: { flexDirection: 'row' },
  backBtn: { width: 60, height: 60, borderRadius: 16, borderWidth: 1, borderColor: THEME.colors.border, justifyContent: 'center', alignItems: 'center' },

  // Step 3 Styles
  summaryCard: { backgroundColor: THEME.colors.surface, padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 30, borderWidth: 1, borderColor: THEME.colors.gold },
  summaryLabel: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold, marginBottom: 8 },
  summaryValue: { color: THEME.colors.gold, fontSize: 32, fontFamily: THEME.fonts.monoExtraBold },
  partySummary: { color: 'white', marginTop: 12, fontSize: 14, fontWeight: '600' },
  methodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 30 },
  methodBtn: { 
    width: (SCREEN_WIDTH - 50) / 2, 
    height: 60, 
    backgroundColor: THEME.colors.surface, 
    borderRadius: 12, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 16, 
    gap: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  selectedMethod: { backgroundColor: THEME.colors.blue, borderColor: THEME.colors.blue },
  methodText: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  inputGroup: { marginBottom: 24 },
  inputLabel: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold, marginBottom: 12 },
  largeInput: { 
    fontSize: 48, 
    color: 'white', 
    fontFamily: THEME.fonts.monoExtraBold, 
    textAlign: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 20
  },
  changeBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: 16, borderRadius: 12, marginBottom: 30 },
  changeLabel: { color: '#10B981', fontSize: 10, fontFamily: THEME.fonts.monoBold },
  changeValue: { color: '#10B981', fontSize: 18, fontFamily: THEME.fonts.monoExtraBold },
  submitBtn: { 
    backgroundColor: '#10B981', 
    height: 70, 
    borderRadius: 20, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10
  },
  submitBtnText: { color: 'white', fontSize: 16, fontFamily: THEME.fonts.monoExtraBold },
  backBtnFull: { marginTop: 20, alignItems: 'center', padding: 16 },
  backBtnText: { color: THEME.colors.textSecondary, fontSize: 12, fontFamily: THEME.fonts.monoBold }
});
