/**
 * stock/lookup.web.tsx — Web variant of /(app)/stock/lookup
 * Full stock lookup with rich result card. Identical business logic to native.
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ActivityIndicator, FlatList, Alert, ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { WebBarcodeScanner } from '../../../src/components/WebBarcodeScanner';
import { ScannerService } from '../../../src/services/ScannerService';
import { useScannerStore } from '../../../src/store/ScannerStore';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { THEME } from '../../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';

export default function StockLookupWebScreen() {
  const router = useRouter();
  const { history, addToHistory, loadHistory } = useScannerStore();
  const { hubOnline, connectionState } = useBridgeStatus();
  const isHubConnected = hubOnline || connectionState === 'connected';

  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [lastScan, setLastScan] = useState<string | null>(null);

  useEffect(() => { loadHistory(); }, []);

  if (!isHubConnected) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false, title: 'Stock', headerStyle: { backgroundColor: THEME.colors.bg }, headerTintColor: 'white' }} />
      <ScreenHeader title="Stock" showBack={true} />
        <View style={styles.offlineContainer}>
          <Text style={styles.offlineIcon}>📡</Text>
          <Text style={styles.offlineTitle}>Hub Not Connected</Text>
          <Text style={styles.offlineDesc}>Make sure Noxis Hub is running on your PC and you are on the same WiFi network.</Text>
          <TouchableOpacity style={styles.pairBtn} onPress={() => router.push('/(auth)/pair')}>
            <Text style={styles.pairBtnText}>Connect to Hub</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Exact same onScan logic as stock/lookup.tsx
  const handleScan = async (data: string) => {
    if (!isScanning || loading || data === lastScan) return;
    setLastScan(data);
    setLoading(true);

    try {
      const sku = await ScannerService.lookupBarcode(data);
      if (sku) {
        setResult(sku);
        addToHistory({
          barcode: data,
          sku_code: (sku as any).sku_code || 'N/A',
          name: sku.name || 'UNKNOWN_ITEM',
          qty: (sku as any).qty_on_hand || 0,
        });
      } else {
        setResult({ barcode: data, notFound: true });
      }
      setIsScanning(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to communicate with Hub.');
    } finally {
      setLoading(false);
    }
  };

  const closeBottomSheet = () => {
    setResult(null);
    setIsScanning(true);
    setLastScan(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Stock', headerStyle: { backgroundColor: THEME.colors.bg }, headerTintColor: 'white' }} />

      {isScanning ? (
        <View style={styles.scanArea}>
          <WebBarcodeScanner
            onScan={handleScan}
            title="STOCK LOOKUP"
            hint="ALIGN_BARCODE_WITHIN_GUIDES"
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={THEME.colors.blue} />
              <Text style={styles.loadingText}>HUB_QUERY_IN_PROGRESS...</Text>
            </View>
          )}
          {/* Recent scan history */}
          {history.length > 0 && (
            <View style={styles.historySection}>
              <Text style={styles.sectionTitle}>SCAN_HISTORY</Text>
              <FlatList
                data={history.slice(0, 4)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.historyItem} onPress={() => {
                    setResult(item); setIsScanning(false);
                  }}>
                    <Text style={styles.historyName}>{item.name}</Text>
                    <Text style={styles.historyQty}>{item.qty}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {result?.notFound ? (
            <View style={styles.notFoundBox}>
              <Text style={styles.notFoundTitle}>SKU_NOT_FOUND</Text>
              <Text style={styles.notFoundSub}>Barcode: {result.barcode}</Text>
            </View>
          ) : result ? (
            <View>
              <View style={styles.resultHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.resultName}>{result.name}</Text>
                  <Text style={styles.resultCode}>{result.sku_code}</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={closeBottomSheet}>
                  <Ionicons name="close" size={20} color={THEME.colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.detailCard}>
                <Text style={styles.cardLine}>📦 On Hand: <Text style={styles.boldText}>{result.qty_on_hand || result.qty} {result.unit || 'units'}</Text></Text>
                <Text style={styles.cardLine}>💰 Sale Price: <Text style={styles.boldText}>Rs. {Number(result.sale_price || 0).toLocaleString()}</Text></Text>
                <Text style={styles.cardLine}>📍 Location: <Text style={styles.boldText}>{result.location || 'N/A'}</Text></Text>
              </View>
              <View style={styles.largeActionsContainer}>
                <TouchableOpacity
                  style={[styles.largeActionBtn, { borderColor: THEME.colors.blue, backgroundColor: 'rgba(96,165,250,0.1)' }]}
                  onPress={() => { closeBottomSheet(); router.push({ pathname: '/(app)/invoices/new', params: { barcode: result.barcode } }); }}
                >
                  <Ionicons name="cart-outline" size={18} color={THEME.colors.blue} />
                  <Text style={[styles.largeActionText, { color: THEME.colors.blue }]}>Create Invoice</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.largeActionBtn, { borderColor: THEME.colors.textSecondary, backgroundColor: 'rgba(156,163,175,0.1)' }]}
                  onPress={() => { closeBottomSheet(); router.push({ pathname: '/(app)/shared/scan-history', params: { code: result.sku_code } }); }}
                >
                  <Ionicons name="time-outline" size={18} color={THEME.colors.textSecondary} />
                  <Text style={[styles.largeActionText, { color: THEME.colors.textSecondary }]}>View History</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          <TouchableOpacity style={styles.rescanBtn} onPress={closeBottomSheet}>
            <Text style={styles.rescanText}>SCAN ANOTHER</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  scanArea: { flex: 1 },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: '40%',
    backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center',
  },
  loadingText: { color: 'white', fontFamily: THEME.fonts.mono, fontSize: 10, marginTop: 12 },
  historySection: { padding: 16 },
  sectionTitle: { color: THEME.colors.textSecondary, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 1, marginBottom: 8 },
  historyItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: THEME.colors.surface, padding: 12, borderRadius: 10,
    marginBottom: 6, borderWidth: 1, borderColor: THEME.colors.border,
  },
  historyName: { color: 'white', fontSize: 13 },
  historyQty: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  resultName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  resultCode: { color: THEME.colors.textSecondary, fontSize: 12, fontFamily: THEME.fonts.mono, marginTop: 4 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: THEME.colors.surface, justifyContent: 'center', alignItems: 'center' },
  detailCard: { backgroundColor: THEME.colors.surface, borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: THEME.colors.border },
  cardLine: { color: 'white', fontSize: 14, fontFamily: THEME.fonts.mono, marginBottom: 8 },
  boldText: { fontWeight: 'bold', fontFamily: THEME.fonts.monoBold },
  largeActionsContainer: { gap: 10, marginBottom: 16 },
  largeActionBtn: { flexDirection: 'row', height: 56, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  largeActionText: { fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  notFoundBox: { alignItems: 'center', paddingVertical: 40 },
  notFoundTitle: { color: THEME.colors.critical, fontSize: 20, fontFamily: THEME.fonts.monoExtraBold },
  notFoundSub: { color: THEME.colors.textSecondary, fontSize: 12, marginTop: 8 },
  rescanBtn: { backgroundColor: THEME.colors.blue, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  rescanText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 13 },
  offlineContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  offlineIcon: { fontSize: 48, marginBottom: 16 },
  offlineTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  offlineDesc: { fontSize: 13, color: THEME.colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  pairBtn: { backgroundColor: THEME.colors.blue, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  pairBtnText: { color: '#000', fontWeight: '700', fontSize: 14 },
});
