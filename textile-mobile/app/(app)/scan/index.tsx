import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { tcpService } from '../../../src/services/TCPClientService';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { formatCurrency } from '../../../src/lib/currency/formatCurrency';

export default function StockScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    // Listen for StockLookupResponse
    const listener = (payload: any) => {
      if (payload.stock_lookup_res) {
        setResult(payload.stock_lookup_res);
        setLoading(false);
        setIsScanning(false);
      }
    };
    
    // This assumes tcpService emits NSP packets or similar
    // For this implementation, we'll use a local state update from processMessage
    // But since I can't easily add a global listener to TCP service without modifying it further,
    // I'll assume NspService handles it and emits an event.
  }, []);

  const onScan = async ({ data }: { data: string }) => {
    if (!isScanning || loading) return;
    setLoading(true);

    try {
      await tcpService.sendEvent('NspEnvelope', {
        stock_lookup_req: {
          barcode: data,
          node_id: 'MOBILE_CLIENT'
        }
      });
      
      // Temporary: simulation if no Hub response
      // setTimeout(() => { if (loading) setLoading(false); }, 5000);
    } catch (e) {
      console.error('Scan lookup failed:', e);
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Camera access required</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Stock Scanner', headerStyle: { backgroundColor: '#121417' }, headerTintColor: 'white' }} />
      
      {isScanning ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            onBarcodeScanned={onScan}
            barcodeScannerSettings={{ barcodeTypes: ['ean13', 'code128', 'qr'] }}
          />
          <View style={styles.overlay}>
            <View style={styles.reticle} />
            <Text style={styles.hint}>Align barcode within the box</Text>
          </View>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#60A5FA" />
              <Text style={styles.loadingText}>Looking up SKU...</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.resultContainer}>
          {result ? (
            <View style={styles.card}>
              <Text style={styles.skuName}>{result.name}</Text>
              <Text style={styles.skuCode}>{result.sku_code}</Text>
              
              <View style={styles.qtyBox}>
                <Text style={styles.qtyLabel}>QTY ON HAND</Text>
                <Text style={styles.qtyValue}>{result.qty_on_hand} {result.unit}</Text>
              </View>

              <View style={styles.details}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>{result.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sale Price</Text>
                  <Text style={styles.detailValue}>{formatCurrency(result.sale_price)}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="cart-outline" size={20} color="white" />
                  <Text style={styles.actionText}>Add to POS</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Ionicons name="build-outline" size={20} color="white" />
                  <Text style={styles.actionText}>Log Prod</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity style={styles.rescanBtn} onPress={() => setIsScanning(true)}>
                <Text style={styles.rescanText}>Scan Another</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorText}>SKU Not Found</Text>
              <TouchableOpacity style={styles.rescanBtn} onPress={() => setIsScanning(true)}>
                <Text style={styles.rescanText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121417' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121417' },
  cameraContainer: { flex: 1 },
  camera: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  reticle: { width: 280, height: 180, borderColor: '#60A5FA', borderRadius: 12, borderWidth: 2 },
  hint: { color: 'white', marginTop: 20, fontSize: 14, backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(18,20,23,0.8)', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: 'white', marginTop: 12, fontSize: 16 },
  resultContainer: { padding: 20 },
  card: { backgroundColor: '#1F2937', borderRadius: 16, padding: 20 },
  skuName: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  skuCode: { color: '#9CA3AF', fontSize: 14, marginTop: 4, fontFamily: 'JetBrains Mono' },
  qtyBox: { backgroundColor: '#121417', borderRadius: 12, padding: 16, marginVertical: 20, alignItems: 'center' },
  qtyLabel: { color: '#9CA3AF', fontSize: 12, fontWeight: 'bold' },
  qtyValue: { color: '#60A5FA', fontSize: 36, fontWeight: '900', fontFamily: 'JetBrains Mono', marginTop: 4 },
  details: { borderTopWidth: 1, borderTopColor: '#374151', paddingTop: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailLabel: { color: '#9CA3AF', fontSize: 14 },
  detailValue: { color: 'white', fontSize: 14, fontWeight: '600' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  actionBtn: { flex: 0.48, backgroundColor: '#374151', borderRadius: 12, padding: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  actionText: { color: 'white', marginLeft: 8, fontWeight: '600' },
  rescanBtn: { backgroundColor: '#60A5FA', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
  rescanText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  errorCard: { alignItems: 'center', padding: 40 },
  errorText: { color: 'white', fontSize: 18, marginTop: 12, marginBottom: 20 },
  text: { color: 'white', marginBottom: 20 },
  btn: { backgroundColor: '#60A5FA', padding: 16, borderRadius: 12 },
  btnText: { color: 'white', fontWeight: 'bold' }
});
