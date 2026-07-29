import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { Stack, Redirect } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { 
  TrendingUp, 
  TrendingDown, 
  Wheat, 
  MapPin, 
  Calendar,
  AlertCircle
} from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { NspService } from '../../../src/services/NspService';
import { useProfileStore } from '../../../src/store/ProfileStore';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { formatCurrency } from '../../../src/lib/currency/formatCurrency';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';

type MandiRate = {
  id: string;
  commodity: string;
  market: string;
  rate: number;
  change: number;
  unit: string;
};

export default function MandiRateScreen() {
  const { activeProfile } = useProfileStore();
  const { connectionState } = useBridgeStatus();
  
  const [loading, setLoading] = useState(true);
  const [rates, setRates] = useState<MandiRate[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

  // Persona Gate
  const allowedPersonas = ['AGRICULTURE', 'WHOLESALE', 'RICE_MILL'];
  if (!allowedPersonas.includes(activeProfile)) {
    return <Redirect href="/(app)/dashboard" />;
  }

  const fetchRates = async () => {
    setLoading(true);
    try {
      const response = await NspService.send({
        mandi_rates_req: {
          timestamp: Date.now()
        }
      });
      
      if (response?.nsp?.mandi_rates_res) {
        setRates(response.nsp.mandi_rates_res.rates);
        setLastUpdated(Date.now());
      } else {
        // Fallback/Mock for demo
        setRates([
          { id: '1', commodity: 'Basmati Rice', market: 'Gujranwala', rate: 12500, change: 150, unit: '40kg' },
          { id: '2', commodity: 'Wheat', market: 'Sargodha', rate: 4200, change: -50, unit: '40kg' },
          { id: '3', commodity: 'Cotton', market: 'Multan', rate: 8500, change: 0, unit: '40kg' },
          { id: '4', commodity: 'Maize', market: 'Sahiwal', rate: 2800, change: 20, unit: '40kg' },
        ]);
      }
    } catch (e) {
      console.error('[Mandi] Fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const renderItem = ({ item, index }: { item: MandiRate, index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)} style={styles.rateCard}>
      <View style={styles.headerRow}>
        <View style={styles.commodityBox}>
           <Wheat size={18} color={THEME.colors.gold} />
           <Text style={styles.commodityName}>{item.commodity}</Text>
        </View>
        <View style={[styles.changeTag, { backgroundColor: item.change >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }]}>
           {item.change !== 0 && (
             item.change > 0 ? <TrendingUp size={12} color="#10B981" /> : <TrendingDown size={12} color="#EF4444" />
           )}
           <Text style={[styles.changeText, { color: item.change >= 0 ? '#10B981' : '#EF4444' }]}>
             {item.change === 0 ? 'STABLE' : `${item.change > 0 ? '+' : ''}${item.change}`}
           </Text>
        </View>
      </View>

      <View style={styles.marketRow}>
        <MapPin size={12} color={THEME.colors.textSecondary} />
        <Text style={styles.marketName}>{item.market}</Text>
      </View>

      <View style={styles.priceRow}>
        <View>
          <Text style={styles.priceLabel}>TODAY'S_RATE</Text>
          <Text style={styles.priceValue}>{formatCurrency(item.rate)}</Text>
        </View>
        <Text style={styles.unitText}>per {item.unit}</Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false, title: 'MANDI_RATES',
        headerStyle: { backgroundColor: THEME.colors.bg },
        headerTintColor: 'white',
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 12 }
      }} />
      <ScreenHeader title="MANDI_RATES" showBack={true} />

      <View style={styles.statusHeader}>
        <Calendar size={14} color={THEME.colors.textMuted} />
        <Text style={styles.statusText}>LAST_UPDATED: {new Date(lastUpdated).toLocaleTimeString()}</Text>
        <View style={[styles.connDot, { backgroundColor: connectionState === 'connected' ? THEME.colors.blue : THEME.colors.textMuted }]} />
      </View>

      <FlatList 
        data={rates}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchRates} tintColor={THEME.colors.gold} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <AlertCircle size={48} color={THEME.colors.surface} />
              <Text style={styles.emptyText}>NO_RATES_AVAILABLE</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  statusHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 8, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  statusText: { color: THEME.colors.textMuted, fontSize: 10, fontFamily: THEME.fonts.monoBold, flex: 1 },
  connDot: { width: 6, height: 6, borderRadius: 3 },
  list: { padding: 20 },
  rateCard: { 
    backgroundColor: THEME.colors.surface, 
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  commodityBox: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  commodityName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  changeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  changeText: { fontSize: 10, fontFamily: THEME.fonts.monoExtraBold },
  marketRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  marketName: { color: THEME.colors.textSecondary, fontSize: 12, fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  priceLabel: { color: THEME.colors.textMuted, fontSize: 8, fontFamily: THEME.fonts.monoBold, marginBottom: 4 },
  priceValue: { color: THEME.colors.gold, fontSize: 24, fontFamily: THEME.fonts.monoExtraBold },
  unitText: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold, marginBottom: 4 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, opacity: 0.5 },
  emptyText: { color: THEME.colors.textMuted, fontFamily: THEME.fonts.monoBold, fontSize: 12, marginTop: 12 }
});
