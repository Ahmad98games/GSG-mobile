import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { THEME, COMMON_STYLES } from '../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../src/lib/supabase';
import { useAuthStore } from '../../../src/store/AuthStore';
import { Decimal } from 'decimal.js';
import { SyncEngine } from '../../../src/lib/SyncEngine';
import { useTierStore } from '../../../src/stores/TierStore';
import { useBridgeStatusStore } from '../../../src/store/BridgeStatusStore';
import { openWhatsApp } from '../../../src/utils/whatsapp';

/**
 * SOVEREIGN MOBILE ORDER INTAKE (v2.0)
 * Industrial multi-step flow for Managers and Accountants.
 */

export default function NewOrder() {
  const router = useRouter();
  const { ownerWhatsApp } = useBridgeStatusStore();
  const { nodeRole } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // State
  const [party, setParty] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [amountPaid, setAmountPaid] = useState('0');
  const [searchQuery, setSearchQuery] = useState('');
  const [parties, setParties] = useState<any[]>([]);

  if (nodeRole !== 'MANAGER_ROVING' && nodeRole !== 'ACCOUNTANT') {
    return <View style={COMMON_STYLES.container}><Text style={{color: 'white'}}>UNAUTHORIZED</Text></View>;
  }

  const handleCreateOrder = async () => {
    setIsLoading(true);
    try {
        const subtotal = items.reduce((acc, item) => acc.add(new Decimal(item.quantity).mul(item.unit_price)), new Decimal(0));
        const setsCount = items.reduce((acc, item) => acc + Number(item.quantity), 0);
        const discount = setsCount > 50 ? subtotal.mul(0.05) : new Decimal(0);
        const total = subtotal.sub(discount);
        const balance = total.sub(new Decimal(amountPaid));

        // 1. Create Order
        const { data: order, error: orderErr } = await supabase.from('orders').insert({
            party_id: party.id,
            total_amount: total.toNumber(),
            discount_amount: discount.toNumber(),
            balance_due: balance.toNumber(),
            status: 'CONFIRMED'
        }).select().single();

        if (orderErr) throw orderErr;

        // 2. Create Line Items
        await supabase.from('order_items').insert(
            items.map(item => ({
                order_id: order.id,
                article_id: item.article_id,
                batch_id: item.batch_id,
                quantity: item.quantity,
                unit_price: item.unit_price
            }))
        );

        // 3. Create Khata Entry
        await SyncEngine.enqueue('LOG_KHATA_TRANSACTION', {
            party_id: party.id,
            entry_type: 'DEBIT',
            amount: total.toNumber(),
            reference_id: order.id,
            description: `Order ${order.id} Confirmation`,
            approvalStatus: 'PENDING'
        });

        Alert.alert('SUCCESS', 'Order synchronized with Vault and Khata.');
        router.back();
    } catch (e) {
        Alert.alert('SYNC FAILED', 'Check network connectivity.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <View style={COMMON_STYLES.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={THEME.colors.gold} />
        </TouchableOpacity>
        <Text style={styles.title}>NEW ORDER • STEP {step}/4</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>SELECT PARTY</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Search or quick-add party..." 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={THEME.colors.text.muted}
            />
            {/* Quick Party Search Results Placeholder */}
            <TouchableOpacity 
                style={styles.partyItem} 
                onPress={() => { setParty({ id: 'P-001', name: 'Al-Madina Fabrics' }); setStep(2); }}
            >
              <Text style={styles.partyName}>Al-Madina Fabrics</Text>
              <Ionicons name="add-circle" size={20} color={THEME.colors.gold} />
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>ADD ITEMS</Text>
            <View style={styles.scanAction}>
                <Ionicons name="scan" size={24} color={THEME.colors.background} />
                <Text style={styles.scanActionText}>SCAN BATCH QR</Text>
            </View>
            
            {items.map((item, i) => (
                <View key={i} style={styles.lineItem}>
                    <Text style={styles.lineName}>ART-805 Soft Silk</Text>
                    <TextInput style={styles.lineQty} value="10" keyboardType="numeric" />
                    <Text style={styles.linePrice}>Rs. 2,450</Text>
                </View>
            ))}
            
            <TouchableOpacity 
                style={styles.nextBtn} 
                onPress={() => {
                    setItems([{ article_id: '1', batch_id: '1', quantity: 60, unit_price: 2450 }]);
                    setStep(3);
                }}
            >
                <Text style={styles.nextBtnText}>PROCEED TO PAYMENT</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
            <View>
                <Text style={styles.stepTitle}>PAYMENT</Text>
                {items.reduce((acc, i) => acc + i.quantity, 0) > 50 && (
                    <View style={styles.wholesaleBanner}>
                        <Ionicons name="flash" size={16} color="black" />
                        <Text style={styles.wholesaleText}>5% WHOLESALE DISCOUNT APPLIED</Text>
                    </View>
                )}
                
                <View style={styles.summaryBox}>
                    <Text style={styles.subtotal}>Total: Rs. 147,000</Text>
                    <Text style={styles.discount}>Discount: -Rs. 7,350</Text>
                    <Text style={styles.finalTotal}>Payable: Rs. 139,650</Text>
                </View>

                <TextInput 
                    style={[styles.input, { fontSize: 24, height: 80 }]}
                    placeholder="Amount Paid..."
                    value={amountPaid}
                    onChangeText={setAmountPaid}
                    keyboardType="numeric"
                />

                <TouchableOpacity style={styles.confirmBtn} onPress={() => setStep(4)}>
                    <Text style={styles.confirmBtnText}>CONFIRM ORDER</Text>
                </TouchableOpacity>
            </View>
        )}

        {step === 4 && (
            <View style={styles.finalStep}>
                <Ionicons name="checkmark-circle" size={80} color={THEME.colors.gold} />
                <Text style={styles.confirmTitle}>VERIFY & SYNC</Text>
                <Text style={styles.confirmSub}>Order for {party.name} totaling Rs. 139,650</Text>
                
                <TouchableOpacity 
                    style={styles.syncBtn} 
                    onPress={handleCreateOrder}
                    disabled={isLoading}
                >
                    {isLoading ? <ActivityIndicator color="black" /> : <Text style={styles.syncBtnText}>SYNC TO INDUSTRIAL VAULT</Text>}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.syncBtn, { backgroundColor: '#25D366', marginTop: 12 }]}
                    onPress={() => {
                        if (!useTierStore.getState().hasFeature('whatsappAutoAlerts')) {
                            Alert.alert(
                                'Pro Feature',
                                'Automatic WhatsApp alerts require Pro plan.',
                                [{ text: 'OK' }]
                            );
                            return;
                        }
                        const BRAND_FOOTER = '\n\n─────────────────\n🔒 Noxis Hub | Omnora Labs\nnoxishub.app';
                        const msg = `Order Confirmed: ${party?.name || 'Customer'}. Total: Rs. 139,650.` + BRAND_FOOTER;
                        const targetPhone = party?.phone || ownerWhatsApp;
                        openWhatsApp(targetPhone, msg);
                    }}
                >
                    <Ionicons name="logo-whatsapp" size={20} color="white" />
                    <Text style={[styles.syncBtnText, { color: 'white' }]}>SHARE VIA WHATSAPP</Text>
                </TouchableOpacity>
            </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 20, padding: 24, paddingTop: 60, backgroundColor: THEME.colors.surface },
  title: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 16 },
  content: { padding: 24 },
  stepTitle: { color: THEME.colors.text.muted, fontSize: 10, fontFamily: THEME.fonts.monoBold, letterSpacing: 2, marginBottom: 20 },
  input: { backgroundColor: THEME.colors.surface, color: 'white', padding: 16, borderRadius: 4, borderWidth: 1, borderColor: THEME.colors.border, fontFamily: THEME.fonts.inter, marginBottom: 12 },
  partyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: 20, borderRadius: 4, marginBottom: 8 },
  partyName: { color: 'white', fontFamily: THEME.fonts.interBold },
  scanAction: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: THEME.colors.gold, padding: 16, borderRadius: 4, marginBottom: 24 },
  scanActionText: { color: THEME.colors.background, fontFamily: THEME.fonts.monoBold },
  lineItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: THEME.colors.surface, padding: 16, borderRadius: 4, marginBottom: 8 },
  lineName: { flex: 1, color: 'white', fontSize: 14 },
  lineQty: { width: 60, backgroundColor: THEME.colors.background, color: THEME.colors.gold, textAlign: 'center', borderRadius: 4, padding: 4 },
  linePrice: { color: THEME.colors.text.muted, fontSize: 12 },
  nextBtn: { backgroundColor: THEME.colors.gold, padding: 16, borderRadius: 4, alignItems: 'center', marginTop: 24 },
  nextBtnText: { color: THEME.colors.background, fontFamily: THEME.fonts.monoBold },
  wholesaleBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: THEME.colors.gold, padding: 8, borderRadius: 4, marginBottom: 20 },
  wholesaleText: { color: 'black', fontSize: 10, fontFamily: THEME.fonts.monoBold },
  summaryBox: { backgroundColor: THEME.colors.surface, padding: 20, borderRadius: 8, marginBottom: 24 },
  subtotal: { color: THEME.colors.text.muted, fontSize: 12 },
  discount: { color: THEME.colors.status.danger, fontSize: 12, marginTop: 4 },
  finalTotal: { color: 'white', fontSize: 20, fontFamily: THEME.fonts.monoBold, marginTop: 12 },
  confirmBtn: { backgroundColor: THEME.colors.gold, padding: 16, borderRadius: 4, alignItems: 'center' },
  confirmBtnText: { color: THEME.colors.background, fontFamily: THEME.fonts.monoBold },
  finalStep: { alignItems: 'center', paddingVertical: 40 },
  confirmTitle: { color: 'white', fontSize: 24, fontFamily: THEME.fonts.monoBold, marginTop: 20 },
  confirmSub: { color: THEME.colors.text.muted, textAlign: 'center', marginTop: 8 },
  syncBtn: { backgroundColor: THEME.colors.gold, paddingHorizontal: 32, paddingVertical: 16, borderRadius: 4, marginTop: 40 },
  syncBtnText: { color: THEME.colors.background, fontFamily: THEME.fonts.monoBold }
});