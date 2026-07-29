/**
 * (tabs)/scan.web.tsx — Web variant of /(app)/(tabs)/scan
 * Full stock lookup: camera → ScannerService.lookupBarcode → bottom-sheet result.
 * Identical business logic to the native screen.
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
import { THEME } from '../../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';

export default function StockLookupWebScreen() {
  const router = useRouter();
  const { history, addToHistory, loadHistory } = useScannerStore();

  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [lastScan, setLastScan] = useState<string | null>(null);

  useEffect(() => { loadHistory(); }, []);

  // Exact same logic as native onScan handler in (tabs)/scan.tsx
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
          sku_code: (sku as any).sku_code || (sku as any).skuCode || 'N/A',
          name: sku.name || 'UNKNOWN_ITEM',
          qty: (sku as any).qty_on_hand || (sku as any).qtyOnHand || 0,
        });
      } else {
        setResult({ barcode: data, notFound: true });
      }
      setIsScanning(false);
    } catch (e) {
      console.error('Scan lookup failed:', e);
      Alert.alert('Error', 'Failed to communicate with Hub.');
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setIsScanning(true);
    setLastScan(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{
        headerShown: false, title: 'STOCK_LOOKUP',
        headerStyle: { backgroundColor: THEME.colors.bg },
        headerTintColor: 'white',
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 12 },
      }} />
      <ScreenHeader title="STOCK_LOOKUP" showBack={true} />

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
        </View>
      ) : (
        <ScrollView style={styles.resultArea} contentContainerStyle={{ padding: 20 }}>
          {result?.notFound ? (
            <View style={styles.notFoundBox}>
              <Text style={styles.notFoundTitle}>SKU_NOT_FOUND</Text>
              <Text style={styles.notFoundSub}>Barcode: {result.barcode}</Text>
            </View>
          ) : result ? (
            <View style={styles.card}>
              <Text style={styles.resultName}>{result.name}</Text>
              <Text style={styles.resultCode}>{result.sku_code}</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>STOCK_LEVEL</Text>
                  <Text style={styles.statValue}>{result.qty_on_hand || result.qty}</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>LOCATION</Text>
                  <Text style={styles.statValue}>{result.location || 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => router.push({ pathname: '/(app)/invoices/new', params: { barcode: result.barcode } })}
                >
                  <Ionicons name="cart-outline" size={18} color={THEME.colors.blue} />
                  <Text style={[styles.actionText, { color: THEME.colors.blue }]}>CREATE INVOICE</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          <TouchableOpacity style={styles.rescanBtn} onPress={resetScan}>
            <Text style={styles.rescanText}>SCAN ANOTHER</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Scan history */}
      {isScanning && history.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>SCAN_HISTORY</Text>
          <FlatList
            data={history.slice(0, 5)}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.historyItem} onPress={() => {
                setResult(item);
                setIsScanning(false);
              }}>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyQty}>{item.qty}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  scanArea: { flex: 1, position: 'relative' },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center',
  },
  loadingText: { color: 'white', fontFamily: THEME.fonts.mono, fontSize: 10, marginTop: 12 },
  resultArea: { flex: 1 },
  card: { backgroundColor: THEME.colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: THEME.colors.border },
  resultName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  resultCode: { color: THEME.colors.textSecondary, fontSize: 12, fontFamily: THEME.fonts.mono, marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginVertical: 16 },
  statBox: { flex: 1, backgroundColor: THEME.colors.bg, padding: 16, borderRadius: 12, alignItems: 'center' },
  statLabel: { color: THEME.colors.textMuted, fontSize: 9, fontFamily: THEME.fonts.monoBold, marginBottom: 8 },
  statValue: { color: THEME.colors.blue, fontSize: 22, fontFamily: THEME.fonts.monoExtraBold },
  actions: { gap: 10 },
  actionBtn: {
    height: 52, borderRadius: 12, borderWidth: 1, borderColor: THEME.colors.blue,
    backgroundColor: 'rgba(96,165,250,0.1)', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  actionText: { fontFamily: THEME.fonts.monoBold, fontSize: 13 },
  notFoundBox: { alignItems: 'center', paddingVertical: 40 },
  notFoundTitle: { color: THEME.colors.critical, fontSize: 20, fontFamily: THEME.fonts.monoExtraBold },
  notFoundSub: { color: THEME.colors.textSecondary, fontSize: 12, marginTop: 8 },
  rescanBtn: {
    backgroundColor: THEME.colors.blue, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 20,
  },
  rescanText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 13 },
  historySection: { padding: 16, maxHeight: 200 },
  sectionTitle: { color: THEME.colors.textSecondary, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 1, marginBottom: 8 },
  historyItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: THEME.colors.surface, padding: 12, borderRadius: 10,
    marginBottom: 6, borderWidth: 1, borderColor: THEME.colors.border,
  },
  historyName: { color: 'white', fontSize: 13, fontWeight: 'bold' },
  historyQty: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold },
});
