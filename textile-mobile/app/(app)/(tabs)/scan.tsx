import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  Dimensions,
  FlatList,
  Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Stack, useRouter } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { 
  Barcode, 
  History, 
  Settings2, 
  ShoppingCart, 
  Info, 
  X,
  PlusCircle,
  Clock
} from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  FadeIn, 
  SlideInDown 
} from 'react-native-reanimated';
import { ScannerService } from '../../../src/services/ScannerService';
import { useScannerStore } from '../../../src/store/ScannerStore';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StockLookupScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const { history, addToHistory, loadHistory } = useScannerStore();
  
  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [lastScan, setLastScan] = useState<string | null>(null);

  const sheetY = useSharedValue(SCREEN_HEIGHT);

  useEffect(() => {
    loadHistory();
  }, []);

  const onScan = async ({ data }: { data: string }) => {
    if (!isScanning || loading || data === lastScan) return;
    
    setLastScan(data);
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const sku = await ScannerService.lookupBarcode(data);
        if (sku) {
          setResult(sku);
          addToHistory({
            barcode: data,
            sku_code: (sku as any).sku_code || (sku as any).skuCode || 'N/A',
            name: sku.name || 'UNKNOWN_ITEM',
            qty: (sku as any).qty_on_hand || (sku as any).qtyOnHand || 0
          });
        setIsScanning(false);
        openBottomSheet();
      } else {
        setResult({ barcode: data, notFound: true });
        setIsScanning(false);
        openBottomSheet();
      }
    } catch (e) {
      console.error('Scan lookup failed:', e);
      Alert.alert('Error', 'Failed to communicate with Hub.');
    } finally {
      setLoading(false);
    }
  };

  const openBottomSheet = () => {
    sheetY.value = withSpring(SCREEN_HEIGHT * 0.45, { damping: 20, stiffness: 100 });
  };

  const closeBottomSheet = () => {
    sheetY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 100 });
    setTimeout(() => {
      setResult(null);
      setIsScanning(true);
      setLastScan(null);
    }, 300);
  };

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }]
  }));

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Barcode size={64} color={THEME.colors.surface} />
        <Text style={styles.permissionText}>CAMERA_ACCESS_REQUIRED_FOR_INDUSTRIAL_SCANNING</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>GRANT_PERMISSION</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'STOCK_LOOKUP', 
        headerStyle: { backgroundColor: THEME.colors.bg }, 
        headerTintColor: 'white',
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 12 }
      }} />

      <View style={styles.cameraFrame}>
        {isScanning && (
          <CameraView
            style={styles.camera}
            onBarcodeScanned={onScan}
            barcodeScannerSettings={{ barcodeTypes: ['ean13', 'code128', 'qr'] }}
          />
        )}
        <View style={styles.overlay}>
          <View style={styles.reticle} />
          <Text style={styles.hint}>ALIGN_BARCODE_WITHIN_GUIDES</Text>
        </View>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={THEME.colors.blue} />
            <Text style={styles.loadingText}>HUB_QUERY_IN_PROGRESS...</Text>
          </View>
        )}
      </View>

      <View style={styles.historySection}>
        <View style={styles.sectionHeader}>
          <History size={16} color={THEME.colors.textSecondary} />
          <Text style={styles.sectionTitle}>SCAN_HISTORY</Text>
        </View>
        
        <FlatList 
          data={history}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.historyItem} onPress={() => {
               setResult(item);
               openBottomSheet();
               setIsScanning(false);
            }}>
              <View style={styles.historyIcon}>
                <Clock size={14} color={THEME.colors.textSecondary} />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyName}>{item.name}</Text>
                <Text style={styles.historyMeta}>{item.sku_code} • {new Date(item.timestamp).toLocaleTimeString()}</Text>
              </View>
              <Text style={styles.historyQty}>{item.qty}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyHistory}>NO_RECENT_SCANS</Text>
          }
        />
      </View>

      {/* BOTTOM SHEET */}
      <Animated.View style={[styles.bottomSheet, sheetStyle]}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetContent}>
          {result?.notFound ? (
            <View style={styles.notFoundBox}>
               <Text style={styles.notFoundTitle}>SKU_NOT_FOUND</Text>
               <Text style={styles.notFoundSub}>Barcode: {result.barcode}</Text>
               <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => Alert.alert('Add SKU', 'Redirecting to Add SKU form...')}
               >
                 <PlusCircle size={20} color="white" />
                 <Text style={styles.addBtnText}>ADD_TO_INVENTORY</Text>
               </TouchableOpacity>
            </View>
          ) : result && (
            <>
              <View style={styles.resultHeader}>
                <View>
                  <Text style={styles.resultName}>{result.name}</Text>
                  <Text style={styles.resultCode}>{result.sku_code}</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={closeBottomSheet}>
                  <X size={20} color={THEME.colors.textSecondary} />
                </TouchableOpacity>
              </View>

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

              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.qActionBtn} onPress={() => Alert.alert('Adjust', 'Adjusting stock...')}>
                   <Settings2 size={24} color={THEME.colors.gold} />
                   <Text style={styles.qActionText}>ADJUST</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.qActionBtn} onPress={() => router.push('/(app)/invoices/new')}>
                   <ShoppingCart size={24} color={THEME.colors.blue} />
                   <Text style={styles.qActionText}>INVOICE</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.qActionBtn} onPress={() => Alert.alert('Details', 'Showing full details...')}>
                   <Info size={24} color={THEME.colors.textPrimary} />
                   <Text style={styles.qActionText}>DETAILS</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  permissionText: { color: THEME.colors.textSecondary, textAlign: 'center', marginTop: 20, fontFamily: THEME.fonts.mono, fontSize: 10 },
  permissionBtn: { backgroundColor: THEME.colors.blue, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 24 },
  permissionBtnText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 12 },
  cameraFrame: { height: SCREEN_HEIGHT * 0.45, backgroundColor: 'black', position: 'relative' },
  camera: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  reticle: { width: 280, height: 160, borderWidth: 2, borderColor: THEME.colors.blue, borderRadius: 20 },
  hint: { color: 'white', fontSize: 10, fontFamily: THEME.fonts.monoBold, marginTop: 20, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: 'white', fontFamily: THEME.fonts.mono, fontSize: 10, marginTop: 12 },
  historySection: { flex: 1, padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { color: THEME.colors.textSecondary, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 1 },
  historyItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: THEME.colors.border },
  historyIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: THEME.colors.bg, justifyContent: 'center', alignItems: 'center' },
  historyInfo: { flex: 1, marginLeft: 12 },
  historyName: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  historyMeta: { color: THEME.colors.textMuted, fontSize: 10, marginTop: 2, fontFamily: THEME.fonts.mono },
  historyQty: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  emptyHistory: { color: THEME.colors.textMuted, textAlign: 'center', marginTop: 40, fontFamily: THEME.fonts.mono, fontSize: 10 },
  bottomSheet: { 
    position: 'absolute', 
    bottom: 0, left: 0, right: 0, 
    height: SCREEN_HEIGHT, 
    backgroundColor: THEME.colors.surface, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 20,
    zIndex: 1000
  },
  sheetHandle: { width: 40, height: 4, backgroundColor: THEME.colors.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetContent: { },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  resultName: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  resultCode: { color: THEME.colors.textSecondary, fontSize: 12, fontFamily: THEME.fonts.mono, marginTop: 4 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: THEME.colors.bg, justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 30 },
  statBox: { flex: 1, backgroundColor: THEME.colors.bg, padding: 16, borderRadius: 16, alignItems: 'center' },
  statLabel: { color: THEME.colors.textMuted, fontSize: 8, fontFamily: THEME.fonts.monoBold, marginBottom: 8 },
  statValue: { color: THEME.colors.blue, fontSize: 24, fontFamily: THEME.fonts.monoExtraBold },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between' },
  qActionBtn: { flex: 0.31, backgroundColor: THEME.colors.bg, borderRadius: 16, height: 80, justifyContent: 'center', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: THEME.colors.border },
  qActionText: { color: THEME.colors.textSecondary, fontSize: 9, fontFamily: THEME.fonts.monoBold },
  notFoundBox: { alignItems: 'center', paddingVertical: 20 },
  notFoundTitle: { color: THEME.colors.critical, fontSize: 20, fontFamily: THEME.fonts.monoExtraBold },
  notFoundSub: { color: THEME.colors.textSecondary, fontSize: 12, marginTop: 8, marginBottom: 30 },
  addBtn: { backgroundColor: THEME.colors.gold, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12, gap: 12 },
  addBtnText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 12 }
});
