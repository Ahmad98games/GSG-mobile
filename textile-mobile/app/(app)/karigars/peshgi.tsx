import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  FlatList, 
  ActivityIndicator, 
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { 
  User, 
  Search, 
  Banknote, 
  HeartPulse, 
  Music, 
  AlertTriangle, 
  MoreHorizontal,
  CheckCircle2
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';
import { FinanceDataService } from '../../../src/services/FinanceDataService';
import { queueManager } from '../../../src/services/OfflineQueueManager';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { PersonaEngine } from '../../../src/lib/persona/PersonaEngine';
import * as Haptics from 'expo-haptics';
import { useIndustryConfig } from '../../../src/hooks/useIndustryConfig';
import { writeWithSync } from '../../../src/services/OfflineSyncService';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';
import { useAuthStore } from '../../../src/store/AuthStore';
import { getSafeStorage } from '../../../src/utils/storage';

type Karigar = {
  id: string;
  name: string;
  code: string;
  balance: number;
};

export default function PeshgiScreen() {
  const router = useRouter();
  const { canGivePeshgi } = useBridgeStatus();
  const tConfig = useIndustryConfig();
  const workerTerm = tConfig.worker;
  const workerTermPlural = tConfig.workers;
  const advanceTerm = tConfig.advance;
  const currency = tConfig.currency;

  if (!canGivePeshgi) {
    return (
      <View style={{ flex: 1, backgroundColor: THEME.colors.bg }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScreenHeader title={`Give ${tConfig.advance}`} showBack={true} />
        <EmptyState
          icon="🔒"
          title="Access Denied"
          description={`You do not have permission to give ${tConfig.advance.toLowerCase()}. Please contact your factory administrator.`}
        />
      </View>
    );
  }
  
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [karigars, setKarigars] = useState<Karigar[]>([]);
  const [selectedKarigar, setSelectedKarigar] = useState<Karigar | null>(null);
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState<string>('');

  const reasons = [
    { label: 'Medical', icon: HeartPulse, color: THEME.colors.critical },
    { label: 'Festival', icon: Music, color: THEME.colors.gold },
    { label: 'Emergency', icon: AlertTriangle, color: '#F59E0B' },
    { label: 'Other', icon: MoreHorizontal, color: THEME.colors.textSecondary },
  ];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) return;
    
    setLoading(true);
    try {
      const res = await FinanceDataService.fetchKarigars();
      const filtered = (res.karigars || []).filter((k: any) => 
        k.name.toLowerCase().includes(query.toLowerCase()) || 
        k.code.toLowerCase().includes(query.toLowerCase())
      );
      setKarigars(filtered);
    } catch (e) {
      console.error(`[${advanceTerm}] Search failed`, e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedKarigar || !amount || !reason) {
      Alert.alert('Missing Info', `Please select a ${workerTerm.toLowerCase()}, amount, and reason.`);
      return;
    }

    setLoading(true);
    try {
      const session = useAuthStore.getState().session;
      let businessId = session?.user?.id;
      if (!businessId) {
        const profile = await getSafeStorage('noxis_profile', null);
        if (profile) {
          const parsed = JSON.parse(profile);
          businessId = parsed?.id;
        }
      }
      if (!businessId) throw new Error('No business profile found');

      const today = new Date().toISOString().split('T')[0];

      const result = await writeWithSync(
        'peshgi_transactions',
        {
          business_id: businessId,
          karigar_id: selectedKarigar.id,
          amount: parseFloat(amount),
          reason: reason || 'Advance given',
          given_date: today,
          given_by: 'mobile',
        },
        {
          notifyHub: 'ADVANCE_GIVEN',
        }
      );

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const newTotal = selectedKarigar.balance + parseFloat(amount);
        Alert.alert(
          `${advanceTerm} Given`, 
          `${currency} ${parseFloat(amount).toLocaleString()} advance given to ${selectedKarigar.name}.\nTotal outstanding: ${currency} ${newTotal.toLocaleString()}`
        );
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert('Queued', `${advanceTerm} queued — will post when connected to Hub`);
      }
      router.back();
    } catch (e: any) {
      console.error('[Peshgi] Save failed:', e.message);
      Alert.alert('Error', `Failed to submit ${advanceTerm.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen options={{ 
        title: `Give ${advanceTerm}`,
        headerStyle: { backgroundColor: THEME.colors.bg },
        headerTintColor: 'white',
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 12 }
      }} />

      <View style={styles.content}>
        {!selectedKarigar ? (
          <Animated.View entering={FadeIn} style={styles.section}>
            <View style={styles.searchBox}>
              <Search size={20} color={THEME.colors.textSecondary} />
              <TextInput 
                style={styles.searchInput}
                placeholder={`Search ${workerTerm} (Name or Code)...`}
                placeholderTextColor={THEME.colors.textMuted}
                value={searchQuery}
                onChangeText={handleSearch}
                autoFocus
              />
              {loading && <ActivityIndicator size="small" color={THEME.colors.gold} />}
            </View>

            <Text style={styles.label}>{`RECENT_${workerTermPlural.toUpperCase()}`}</Text>
            <View style={styles.chipRow}>
              {['K-102', 'K-205', 'K-098'].map(c => (
                <TouchableOpacity key={c} style={styles.chip} onPress={() => handleSearch(c)}>
                  <Text style={styles.chipText}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList 
              data={karigars}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.karigarCard} onPress={() => setSelectedKarigar(item)}>
                  <View style={styles.karigarIcon}>
                    <User size={20} color="white" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.karigarName}>{item.name}</Text>
                    <Text style={styles.karigarCode}>{item.code}</Text>
                  </View>
                  <Text style={styles.karigarBalance}>{PersonaEngine.fmt(item.balance)}</Text>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp} style={styles.form}>
            <TouchableOpacity style={styles.selectedHeader} onPress={() => setSelectedKarigar(null)}>
               <User size={24} color={THEME.colors.gold} />
               <View style={{ flex: 1, marginLeft: 12 }}>
                 <Text style={styles.selectedName}>{selectedKarigar.name}</Text>
                 <Text style={styles.selectedCode}>{selectedKarigar.code}</Text>
               </View>
               <Text style={styles.changeBtn}>CHANGE</Text>
            </TouchableOpacity>

            <View style={styles.inputGroup}>
               <Text style={styles.label}>{`${advanceTerm.toUpperCase()}_AMOUNT`}</Text>
               <TextInput 
                 style={styles.amountInput}
                 keyboardType="numeric"
                 placeholder="0.00"
                 placeholderTextColor={THEME.colors.surface}
                 value={amount}
                 onChangeText={setAmount}
                 autoFocus
               />
            </View>

            <Text style={styles.label}>SELECT_REASON</Text>
            <View style={styles.reasonGrid}>
               {reasons.map(r => (
                 <TouchableOpacity 
                   key={r.label} 
                   style={[styles.reasonBtn, reason === r.label && { borderColor: r.color, backgroundColor: r.color + '10' }]}
                   onPress={() => {
                     setReason(r.label);
                     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                   }}
                 >
                   <r.icon size={24} color={reason === r.label ? r.color : THEME.colors.textSecondary} />
                   <Text style={[styles.reasonText, reason === r.label && { color: r.color }]}>{r.label.toUpperCase()}</Text>
                 </TouchableOpacity>
               ))}
            </View>

            <TouchableOpacity 
              style={[styles.submitBtn, (!amount || !reason) && styles.disabledBtn]} 
              onPress={handleSubmit}
              disabled={loading || !amount || !reason}
            >
              {loading ? <ActivityIndicator color="white" /> : (
                <>
                  <Banknote size={24} color="white" />
                  <Text style={styles.submitBtnText}>{`DISBURSE_${advanceTerm.toUpperCase()}`}</Text>
                </>
              )}
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  content: { flex: 1, padding: 20 },
  section: { flex: 1 },
  searchBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: THEME.colors.surface, 
    borderRadius: 12, 
    paddingHorizontal: 12,
    height: 54,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 20
  },
  searchInput: { flex: 1, marginLeft: 10, color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  label: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold, marginBottom: 12, letterSpacing: 1 },
  chipRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  chip: { backgroundColor: THEME.colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: THEME.colors.border },
  chipText: { color: THEME.colors.textPrimary, fontSize: 12, fontFamily: THEME.fonts.monoBold },
  karigarCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: THEME.colors.surface, 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  karigarIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.colors.bg, justifyContent: 'center', alignItems: 'center' },
  karigarName: { color: 'white', fontSize: 15, fontWeight: 'bold', marginLeft: 12 },
  karigarCode: { color: THEME.colors.textSecondary, fontSize: 11, marginLeft: 12, fontFamily: THEME.fonts.mono },
  karigarBalance: { color: THEME.colors.gold, fontSize: 14, fontFamily: THEME.fonts.monoBold },
  form: { flex: 1 },
  selectedHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(197, 160, 89, 0.1)', 
    padding: 16, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: THEME.colors.gold,
    marginBottom: 30
  },
  selectedName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  selectedCode: { color: THEME.colors.gold, fontSize: 12, fontFamily: THEME.fonts.monoBold },
  changeBtn: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  inputGroup: { marginBottom: 30 },
  amountInput: { 
    fontSize: 48, 
    color: 'white', 
    fontFamily: THEME.fonts.monoExtraBold, 
    textAlign: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 24,
    borderRadius: 20
  },
  reasonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 40 },
  reasonBtn: { 
    width: (Dimensions.get('window').width - 50) / 2, 
    height: 80, 
    backgroundColor: THEME.colors.surface, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  reasonText: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  submitBtn: { 
    backgroundColor: THEME.colors.gold, 
    height: 70, 
    borderRadius: 20, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 12,
    marginTop: 'auto',
    marginBottom: 20
  },
  submitBtnText: { color: 'white', fontSize: 16, fontFamily: THEME.fonts.monoExtraBold },
  disabledBtn: { opacity: 0.5 }
});
