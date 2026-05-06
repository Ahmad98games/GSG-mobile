import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { tcpService } from '../../src/services/TCPClientService';
import { THEME } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useBridgeStatus } from '../../src/store/BridgeStatusStore';

const { width } = Dimensions.get('window');

/**
 * ZERO-TOUCH QR PAIRING SCREEN
 * Implements auto-bonding, deep-link parsing, and tactical feedback.
 */
export default function PairScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [status, setStatus] = useState<'IDLE' | 'BONDING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const glowAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    if (status === 'SUCCESS') {
      triggerGlow(THEME.colors.blue);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => router.replace('/(app)/dashboard'), 1500);
    } else if (status === 'ERROR') {
      triggerGlow(THEME.colors.critical);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setTimeout(() => setStatus('IDLE'), 2000);
    }
  }, [status]);

  const triggerGlow = (color: string) => {
    Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 300, useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: false }),
    ]).start();
  };

  const onScan = async ({ data }: { data: string }) => {
    if (status !== 'IDLE') return;
    setStatus('BONDING');

    try {
      // Expected Format: { ip, port, meshKey, hubName, tier }
      let parsed;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        // Fallback for older formats if needed, or throw
        throw new Error('MALFORMED_JSON');
      }

      const { ip, port, meshKey, hubName, tier } = parsed;

      if (!ip || !meshKey) throw new Error('MISSING_CRITICAL_FIELDS');

      // SENSITIVE: Store mesh key in SecureStore
      await SecureStore.setItemAsync('gs_mesh_key', meshKey);
      
      // NON-SENSITIVE: Store config in AsyncStorage
      await AsyncStorage.setItem('gs_hub_ip', ip);
      await AsyncStorage.setItem('gs_hub_port', port?.toString() || '7447');
      await AsyncStorage.setItem('gs_hub_name', hubName || 'Omnora Hub');

      // Store Tier in BridgeStatusStore
      const bridgeStore = useBridgeStatus.getState();
      const tierKey = (tier?.toLowerCase() || 'lite') as any;
      bridgeStore.setTierLimit(tierKey);

      await tcpService.connect(ip, parseInt(port?.toString() || '7447'));
      
      // Verification logic: wait for isConnected
      setTimeout(() => {
        if (tcpService.getStatus()) setStatus('SUCCESS');
        else setStatus('ERROR');
      }, 3000);

    } catch (e) {
      console.error('[Pairing] Bond Failure:', e);
      setStatus('ERROR');
    }
  };

  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CAMERA ACCESS REQUIRED</Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>GRANT PERMISSION</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>OMNORA / INDUSTRIAL BORDER</Text>
        <Text style={styles.mainTitle}>NODE BONDING</Text>
      </View>

      <View style={styles.scanContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={status === 'IDLE' ? onScan : undefined}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
        <Animated.View style={[
          styles.glowBorder,
          { 
            borderColor: status === 'SUCCESS' ? THEME.colors.blue : 
                         status === 'ERROR' ? THEME.colors.critical : THEME.colors.blue,
            opacity: glowAnim
          }
        ]} />
        <View style={styles.overlay}>
          <View style={styles.reticle} />
          {status === 'BONDING' && (
            <View style={styles.statusBox}>
              <Text style={styles.statusText}>BONDING...</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SECURE HANDSHAKE: AES-256-GCM + P-256</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg, justifyContent: 'center', alignItems: 'center' },
  header: { position: 'absolute', top: 100, alignItems: 'center' },
  brand: { color: THEME.colors.gold, fontWeight: '900', fontSize: 10, letterSpacing: 3 },
  title: { color: 'white', fontWeight: '900', fontSize: 24, marginBottom: 20 },
  mainTitle: { color: 'white', fontWeight: '900', fontSize: 32, marginTop: 8 },
  scanContainer: { width: width - 64, height: width - 64, borderRadius: 32, overflow: 'hidden', position: 'relative' },
  camera: { flex: 1 },
  glowBorder: { ...StyleSheet.absoluteFillObject, borderWidth: 10, borderRadius: 32, zIndex: 10 },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  reticle: { width: 200, height: 200, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 20 },
  statusBox: { backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  statusText: { color: THEME.colors.gold, fontWeight: '900' },
  footer: { position: 'absolute', bottom: 60 },
  footerText: { color: '#3f3f46', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  btn: { backgroundColor: THEME.colors.blue, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, marginTop: 20 },
  btnText: { color: 'white', fontWeight: '900' }
});
