/**
 * scan/index.web.tsx — Web variant of /(app)/scan/index
 * Sends stock_lookup_req to Hub via WebSocket bridge (same as native tcpService.sendEvent).
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  SafeAreaView, ActivityIndicator,
} from 'react-native';
import { WebBarcodeScanner } from '../../../src/components/WebBarcodeScanner';
import { tcpService } from '../../../src/services/TCPClientService';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { formatCurrency } from '../../../src/lib/currency/formatCurrency';

export default function ScanIndexWebScreen() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(true);

  const handleScan = async (data: string) => {
    if (!isScanning || loading) return;
    setLoading(true);
    setIsScanning(false);

    try {
      // Exact same logic as native onScan
      await tcpService.sendEvent('NspEnvelope', {
        stock_lookup_req: {
          barcode: data,
          node_id: 'MOBILE_CLIENT',
        },
      });
      // Result comes back via WS listener in a real setup
      // Show loading state until Hub responds
    } catch (e) {
      console.error('Scan lookup failed:', e);
      setResult({ error: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{
        title: 'Stock Scanner',
        headerStyle: { backgroundColor: '#121417' },
        headerTintColor: 'white',
      }} />

      {isScanning ? (
        <View style={styles.scanArea}>
          <WebBarcodeScanner
            onScan={handleScan}
            title="STOCK LOOKUP SCANNER"
            hint="Align barcode — EAN13, Code128, QR supported"
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text style={styles.loadingText}>Looking up SKU...</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.resultContainer}>
          {result?.error ? (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorText}>Lookup failed — Hub may not be connected</Text>
            </View>
          ) : (
            <View style={styles.waitCard}>
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text style={styles.waitText}>Waiting for Hub response...</Text>
            </View>
          )}
          <TouchableOpacity style={styles.rescanBtn} onPress={() => setIsScanning(true)}>
            <Text style={styles.rescanText}>Scan Another</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121417' },
  scanArea: { flex: 1 },
  loadingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(18,20,23,0.85)', justifyContent: 'center', alignItems: 'center',
  },
  loadingText: { color: 'white', marginTop: 12, fontSize: 16 },
  resultContainer: { padding: 24, alignItems: 'center', flex: 1, justifyContent: 'center' },
  waitCard: { alignItems: 'center', gap: 16, marginBottom: 32 },
  waitText: { color: '#9CA3AF', fontSize: 14 },
  errorCard: { alignItems: 'center', gap: 12, marginBottom: 32 },
  errorText: { color: 'white', fontSize: 15, textAlign: 'center' },
  rescanBtn: { backgroundColor: '#60A5FA', borderRadius: 12, paddingVertical: 16, paddingHorizontal: 32 },
  rescanText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
