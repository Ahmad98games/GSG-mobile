import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
  FlatList,
  Animated
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tcpService } from '../../src/services/TCPClientService';
import { discoveryService } from '../../src/services/NoxisDiscoveryService';
import { useConnection } from '../../src/store/ConnectionContext';
import { useAuthStore } from '../../src/store/AuthStore';

const { width } = Dimensions.get('window');
const GOLD = '#D4AF37';
const BG = '#09090b';
const CARD = '#18181b';
const BORDER = '#27272a';

export default function PairingScreen() {
  const [method, setMethod] = useState<'CODE' | 'QR' | 'DISCOVER'>('DISCOVER');
  const [status, setStatus] = useState<'IDLE' | 'VALIDATING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [hubs, setHubs] = useState<{ name: string; ip: string }[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();
  const { status: connStatus } = useConnection();
  const isOnline = connStatus === 'CONNECTED';

  // Discovery Management
  useEffect(() => {
    const handleHubFound = (hub: { name: string; ip: string }) => {
      setHubs(prev => prev.find(h => h.ip === hub.ip) ? prev : [...prev, hub]);
    };
    const handleScanState = (scanning: boolean) => setIsScanning(scanning);

    discoveryService.on('hubFound', handleHubFound);
    discoveryService.on('scanStateChange', handleScanState);
    
    if (method === 'DISCOVER') discoveryService.startScan();

    return () => {
      discoveryService.off('hubFound', handleHubFound);
      discoveryService.off('scanStateChange', handleScanState);
      discoveryService.stopScan();
    };
  }, [method]);



  const [scanStatus, setScanStatus] = useState<'NEUTRAL' | 'SUCCESS' | 'ERROR'>('NEUTRAL');
  const glowAnim = useRef(new Animated.Value(0)).current;

  // Connection Monitoring
  useEffect(() => {
    if (status === 'VALIDATING' && isOnline) {
      setStatus('SUCCESS');
      setScanStatus('SUCCESS');
      triggerGlow();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      SecureStore.setItemAsync('gs_paired', 'true');
      setTimeout(() => router.replace('/(app)'), 1500);
    }
  }, [isOnline, status]);

  const triggerGlow = () => {
    Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 0, duration: 800, useNativeDriver: false }),
    ]).start();
  };

  const initiatePairing = async (ip: string, secret: string) => {
    setStatus('VALIDATING');
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      // Generate nodeId
      const nodeId = `node-${Math.random().toString(36).substring(7)}`;

      // ZERO-TOUCH: Immediate persistence
      await Promise.all([
        AsyncStorage.setItem('gs_mesh_key', secret),
      ]);

      // Update Zustand Auth Store (sets isAuthenticated: true and saves to AsyncStorage/SecureStore)
      useAuthStore.getState().setCredentials(ip, 7447, nodeId, 'LITE', 'MANAGER_ROVING');

      // TRIGGER BINARY HANDSHAKE
      console.log(`[Pairing] Initiating handshake with ${ip}`);
      await tcpService.connect(ip, 7447);

      // Timeout safety
      setTimeout(() => {
        if (status === 'VALIDATING' && !tcpService.getStatus()) {
          setStatus('ERROR');
          setScanStatus('ERROR');
          triggerGlow();
          setError('HUB UNREACHABLE');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      }, 8000);

    } catch (err) {
      setStatus('ERROR');
      setScanStatus('ERROR');
      triggerGlow();
      setError('BONDING FAILED');
    }
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (status !== 'IDLE' || scanStatus !== 'NEUTRAL') return;
    
    try {
      const payload = JSON.parse(data);
      if (payload.ip && payload.secret) {
        initiatePairing(payload.ip, payload.secret);
      } else {
        throw new Error('Invalid Schema');
      }
    } catch (e) {
      if (data.includes('|')) {
        const [ip, secret] = data.split('|');
        initiatePairing(ip, secret);
      } else {
        setScanStatus('ERROR');
        triggerGlow();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(() => setScanStatus('NEUTRAL'), 2000);
      }
    }
  };

  const renderHubItem = ({ item }: { item: { name: string, ip: string } }) => (
    <TouchableOpacity 
      style={styles.hubCard}
      onPress={() => initiatePairing(item.ip, 'tactical-bridge-default')}
    >
      <View style={styles.hubIcon}>
        <Ionicons name="wifi" size={20} color={GOLD} />
      </View>
      <View style={styles.hubInfo}>
        <Text style={styles.hubName}>{item.name}</Text>
        <Text style={styles.hubIp}>{item.ip}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#52525b" />
    </TouchableOpacity>
  );

  return (
    <ScreenContainer style={styles.container}>
      <Stack.Screen options={{ title: 'Pair with Hub' }} />
      <View style={styles.header}>
        <Text style={styles.brand}>OMNORA OS / TACTICAL BRIDGE</Text>
        <Text style={styles.title}>NODE BONDING</Text>
        <Text style={styles.subtitle}>ESTABLISH SECURE INDUSTRIAL LINK</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, method === 'DISCOVER' && styles.activeTab]}
          onPress={() => setMethod('DISCOVER')}
        >
          <Ionicons name="search" size={16} color={method === 'DISCOVER' ? 'black' : '#a1a1aa'} />
          <Text style={[styles.tabText, method === 'DISCOVER' && styles.activeTabText]}>DISCOVER</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, method === 'QR' && styles.activeTab]}
          onPress={() => setMethod('QR')}
        >
          <Ionicons name="qr-code" size={16} color={method === 'QR' ? 'black' : '#a1a1aa'} />
          <Text style={[styles.tabText, method === 'QR' && styles.activeTabText]}>SCAN QR</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {method === 'DISCOVER' ? (
          <View style={styles.discoverWrapper}>
            <View style={styles.statusRow}>
              <Text style={styles.statusText}>
                {isScanning ? 'SCANNING NETWORK...' : 'SCAN COMPLETE'}
              </Text>
              {isScanning && <ActivityIndicator size="small" color={GOLD} />}
            </View>

            <FlatList
              data={hubs}
              renderItem={renderHubItem}
              keyExtractor={item => item.ip}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="refresh" size={40} color="#27272a" />
                  <Text style={styles.emptyText}>NO HUBS DETECTED</Text>
                </View>
              }
            />
          </View>
        ) : (
          <View style={styles.qrContainer}>
            {!permission?.granted ? (
              <TouchableOpacity style={styles.largeBtn} onPress={requestPermission}>
                <Text style={styles.largeBtnText}>GRANT CAMERA ACCESS</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.cameraWrapper}>
                <CameraView
                  style={styles.camera}
                  onBarcodeScanned={handleBarCodeScanned}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                />
                <Animated.View 
                  style={[
                    styles.glowBorder, 
                    { 
                      borderColor: scanStatus === 'SUCCESS' ? '#4ade80' : 
                                  scanStatus === 'ERROR' ? '#ef4444' : GOLD,
                      opacity: glowAnim
                    }
                  ]} 
                />
                <View style={styles.scanOverlay}>
                  <View style={styles.reticle}>
                    <View style={[styles.corner, styles.tl]} />
                    <View style={[styles.corner, styles.tr]} />
                    <View style={[styles.corner, styles.bl]} />
                    <View style={[styles.corner, styles.br]} />
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {status === 'VALIDATING' && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={GOLD} />
            <Text style={styles.loadingText}>BONDING...</Text>
          </View>
        )}

        {status === 'ERROR' && (
          <TouchableOpacity onPress={() => setStatus('IDLE')}>
            <Text style={styles.errorText}>{error} - RETRY</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SECURE ENCRYPTION: AES-256-GCM ACTIVE</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { paddingTop: 80, paddingHorizontal: 32, alignItems: 'center' },
  brand: { color: GOLD, fontWeight: '900', fontSize: 10, letterSpacing: 4 },
  title: { color: 'white', fontWeight: '900', fontSize: 28, marginTop: 8 },
  subtitle: { color: '#71717a', fontSize: 12, fontWeight: '700', marginTop: 12, letterSpacing: 1 },
  tabContainer: { flexDirection: 'row', backgroundColor: CARD, marginHorizontal: 24, padding: 4, borderRadius: 12, marginTop: 32 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, gap: 8 },
  activeTab: { backgroundColor: GOLD },
  tabText: { fontSize: 11, fontWeight: '900', color: '#a1a1aa' },
  activeTabText: { color: 'black' },
  content: { flex: 1, paddingHorizontal: 24, marginTop: 24 },
  discoverWrapper: { flex: 1 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  statusText: { color: '#52525b', fontSize: 10, fontWeight: '900' },
  hubCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: CARD, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: BORDER, marginBottom: 12 },
  hubIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(212, 175, 55, 0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  hubInfo: { flex: 1 },
  hubName: { color: 'white', fontSize: 14, fontWeight: '800' },
  hubIp: { color: '#71717a', fontSize: 12 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { color: '#27272a', fontSize: 12, fontWeight: '900', marginTop: 16 },
  qrContainer: { height: width - 48, borderRadius: 24, overflow: 'hidden', backgroundColor: '#000' },
  cameraWrapper: { flex: 1, position: 'relative' },
  camera: { flex: 1 },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 8,
    borderRadius: 24,
    zIndex: 10,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  reticle: {
    width: 200,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: GOLD,
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  loadingOverlay: { alignItems: 'center', marginTop: 40 },
  loadingText: { color: GOLD, fontSize: 10, fontWeight: '900', marginTop: 16 },
  errorText: { color: '#ef4444', textAlign: 'center', fontWeight: '900', marginTop: 20 },
  footer: { paddingBottom: 40, alignItems: 'center' },
  footerText: { color: '#3f3f46', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  largeBtn: {
    backgroundColor: GOLD,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  largeBtnText: {
    color: 'black',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1,
  },
});
