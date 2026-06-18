/**
 * (auth)/pairing.web.tsx — Web variant of /(auth)/pairing
 * Handles QR-based pairing: parses {ip, secret} or "ip|secret" from QR code.
 * Identical handleBarCodeScanned + initiatePairing logic to native.
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { WebBarcodeScanner } from '../../src/components/WebBarcodeScanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { tcpService } from '../../src/services/TCPClientService';

const GOLD = '#D4AF37';
const BG = '#09090b';
const CARD = '#18181b';
const BORDER = '#27272a';

export default function PairingWebScreen() {
  const [mode, setMode] = useState<'QR' | 'CODE'>('QR');
  const [status, setStatus] = useState<'IDLE' | 'VALIDATING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [manualIp, setManualIp] = useState('');
  const [manualSecret, setManualSecret] = useState('');
  const router = useRouter();

  // Exact same initiatePairing logic as native pairing.tsx
  const initiatePairing = async (ip: string, secret: string) => {
    setStatus('VALIDATING');
    setError(null);
    try {
      await Promise.all([
        AsyncStorage.setItem('gs_hub_ip', ip),
        AsyncStorage.setItem('gs_mesh_key', secret),
        SecureStore.setItemAsync('gs_node_id', `node-${Math.random().toString(36).substring(7)}`),
      ]);
      await tcpService.connect(ip, 7447);
      // Monitor connection result
      const checkInterval = setInterval(() => {
        if (tcpService.getStatus()) {
          clearInterval(checkInterval);
          setStatus('SUCCESS');
          SecureStore.setItemAsync('gs_paired', 'true');
          setTimeout(() => router.replace('/(app)'), 1000);
        }
      }, 500);
      setTimeout(() => {
        clearInterval(checkInterval);
        if (status === 'VALIDATING') {
          setStatus('ERROR');
          setError('HUB UNREACHABLE — check IP and port');
        }
      }, 8000);
    } catch {
      setStatus('ERROR');
      setError('BONDING FAILED');
    }
  };

  // Exact same handleBarCodeScanned logic as native pairing.tsx
  const handleBarCodeScanned = (data: string) => {
    if (status !== 'IDLE') return;
    try {
      const payload = JSON.parse(data);
      if (payload.ip && payload.secret) {
        initiatePairing(payload.ip, payload.secret);
      } else {
        throw new Error('Invalid Schema');
      }
    } catch {
      if (data.includes('|')) {
        const [ip, secret] = data.split('|');
        initiatePairing(ip, secret);
      } else {
        setError('Invalid QR code — generate a new one on the Hub PC');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Pair with Hub', headerStyle: { backgroundColor: BG }, headerTintColor: 'white' }} />
      <View style={styles.header}>
        <Text style={styles.brand}>OMNORA OS / TACTICAL BRIDGE</Text>
        <Text style={styles.title}>NODE BONDING</Text>
        <Text style={styles.subtitle}>ESTABLISH SECURE INDUSTRIAL LINK</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, mode === 'QR' && styles.activeTab]}
          onPress={() => setMode('QR')}
        >
          <Text style={[styles.tabText, mode === 'QR' && styles.activeTabText]}>📷 SCAN QR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, mode === 'CODE' && styles.activeTab]}
          onPress={() => setMode('CODE')}
        >
          <Text style={[styles.tabText, mode === 'CODE' && styles.activeTabText]}>⌨️ MANUAL</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {status === 'VALIDATING' ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={GOLD} />
            <Text style={styles.loadingText}>BONDING...</Text>
          </View>
        ) : status === 'SUCCESS' ? (
          <View style={styles.loadingOverlay}>
            <Text style={{ fontSize: 48 }}>✅</Text>
            <Text style={styles.successText}>CONNECTED — entering dashboard...</Text>
          </View>
        ) : mode === 'QR' ? (
          <WebBarcodeScanner
            onScan={handleBarCodeScanned}
            title="SCAN HUB QR CODE"
            hint="Open Noxis Hub on your PC → Pair Device → scan the QR"
            qrOnly={true}
          />
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>HUB IP ADDRESS</Text>
            <TextInput
              style={styles.input}
              value={manualIp}
              onChangeText={setManualIp}
              placeholder="192.168.1.10"
              placeholderTextColor="#52525b"
            />
            <Text style={styles.label}>SECRET / MESH KEY</Text>
            <TextInput
              style={styles.input}
              value={manualSecret}
              onChangeText={setManualSecret}
              placeholder="tactical-bridge-default"
              placeholderTextColor="#52525b"
            />
            <TouchableOpacity
              style={styles.connectBtn}
              onPress={() => initiatePairing(manualIp, manualSecret || 'tactical-bridge-default')}
            >
              <Text style={styles.connectBtnText}>ESTABLISH CONNECTION</Text>
            </TouchableOpacity>
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SECURE ENCRYPTION: AES-256-GCM ACTIVE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { paddingTop: 60, paddingHorizontal: 32, alignItems: 'center' },
  brand: { color: GOLD, fontWeight: '900', fontSize: 10, letterSpacing: 4 },
  title: { color: 'white', fontWeight: '900', fontSize: 26, marginTop: 8 },
  subtitle: { color: '#71717a', fontSize: 12, fontWeight: '700', marginTop: 8, letterSpacing: 1 },
  tabContainer: { flexDirection: 'row', backgroundColor: CARD, marginHorizontal: 24, padding: 4, borderRadius: 12, marginTop: 24 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 10 },
  activeTab: { backgroundColor: GOLD },
  tabText: { fontSize: 12, fontWeight: '900', color: '#a1a1aa' },
  activeTabText: { color: 'black' },
  content: { flex: 1, paddingHorizontal: 24, marginTop: 16 },
  loadingOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  loadingText: { color: GOLD, fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  successText: { color: '#4ade80', fontSize: 14, fontWeight: '900', textAlign: 'center' },
  form: { backgroundColor: CARD, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: BORDER },
  label: { color: '#71717a', fontSize: 10, fontWeight: '900', marginBottom: 8, letterSpacing: 1 },
  input: {
    backgroundColor: '#09090b', color: 'white', padding: 16,
    borderRadius: 10, fontWeight: '600', fontSize: 16,
    marginBottom: 20, borderWidth: 1, borderColor: BORDER,
  },
  connectBtn: { backgroundColor: GOLD, padding: 18, borderRadius: 12, alignItems: 'center' },
  connectBtnText: { color: 'black', fontWeight: '900', fontSize: 14 },
  errorText: { color: '#ef4444', textAlign: 'center', fontWeight: '900', marginTop: 16 },
  footer: { paddingBottom: 40, alignItems: 'center' },
  footerText: { color: '#3f3f46', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
});
