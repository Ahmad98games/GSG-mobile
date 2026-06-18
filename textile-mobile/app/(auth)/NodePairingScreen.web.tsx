/**
 * (auth)/NodePairingScreen.web.tsx — Web variant of /(auth)/NodePairingScreen
 * QR scan → decodePairingQR → meshTCPClient.connect. Identical handleBarCodeScanned logic.
 */
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { WebBarcodeScanner } from '../../src/components/WebBarcodeScanner';
import { THEME, COMMON_STYLES } from '../../src/constants/DesignSystem';
import { meshTCPClient } from '../../src/lib/mesh/tcp-client';
import { decodePairingQR } from '../../src/lib/mesh/mesh-protocol';

export default function NodePairingWebScreen() {
  const [mode, setMode] = useState<'IDLE' | 'SCAN' | 'IP_ENTRY'>('IDLE');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('5000');
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'PAIRING' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const initiatePairing = (targetIp: string, targetPort: number, code?: string) => {
    setStatus('CONNECTING');
    setError(null);
    meshTCPClient.connect(targetIp, targetPort, code);

    const onStateChange = (state: string) => {
      if (state === 'CONNECTED') setStatus('SYNCING');
      if (state === 'DISCONNECTED') { setStatus('ERROR'); setError('HUB_UNREACHABLE'); }
    };
    const onConfig = () => {
      setStatus('SUCCESS');
      setTimeout(() => router.replace('/(app)'), 1500);
    };

    meshTCPClient.on('state-change', onStateChange);
    meshTCPClient.on('config-downloaded', onConfig);
  };

  // Exact same handleBarCodeScanned as NodePairingScreen.tsx
  const handleBarCodeScanned = (data: string) => {
    try {
      const payload = decodePairingQR(data);
      if (payload.hubIp) {
        initiatePairing(payload.hubIp, payload.hubPort, payload.code);
        setMode('IDLE');
      }
    } catch {
      Alert.alert('SCAN ERROR', 'Invalid pairing QR format.');
    }
  };

  if (status !== 'IDLE' && status !== 'ERROR') {
    return (
      <View style={[COMMON_STYLES.container, styles.statusContainer]}>
        <ActivityIndicator size="large" color={THEME.colors.blue} />
        <Text style={styles.statusText}>{status.toUpperCase()}...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={COMMON_STYLES.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>GOLD SHE MESH</Text>
        <Text style={styles.title}>NODE PAIRING</Text>
      </View>

      <View style={styles.content}>
        {mode === 'SCAN' ? (
          <View style={{ flex: 1 }}>
            <WebBarcodeScanner
              onScan={handleBarCodeScanned}
              title="SCAN HUB QR"
              hint="Scan the QR code shown on the Hub PC screen"
              qrOnly={true}
            />
            <TouchableOpacity style={styles.backBtn} onPress={() => setMode('IDLE')}>
              <Text style={styles.backBtnText}>← GO BACK</Text>
            </TouchableOpacity>
          </View>
        ) : mode === 'IP_ENTRY' ? (
          <View style={styles.form}>
            <Text style={styles.label}>HUB IP ADDRESS</Text>
            <TextInput
              style={styles.input}
              value={ip}
              onChangeText={setIp}
              placeholder="192.168.1.10"
              placeholderTextColor={THEME.colors.muted}
              keyboardType="numeric"
              autoFocus
            />
            <Text style={styles.label}>PORT</Text>
            <TextInput
              style={styles.input}
              value={port}
              onChangeText={setPort}
              placeholder="5000"
              placeholderTextColor={THEME.colors.muted}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.connectBtn} onPress={() => initiatePairing(ip, parseInt(port))}>
              <Text style={styles.connectBtnText}>ESTABLISH CONNECTION</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 16 }} onPress={() => setMode('IDLE')}>
              <Text style={{ color: THEME.colors.slate, textAlign: 'center' }}>GO BACK</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.options}>
            <TouchableOpacity style={styles.optionBtn} onPress={() => setMode('SCAN')}>
              <Text style={styles.optionIcon}>📷</Text>
              <Text style={styles.optionTitle}>SCAN HUB QR</Text>
              <Text style={styles.optionSub}>Fastest industrial bonding</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionBtn} onPress={() => setMode('IP_ENTRY')}>
              <Text style={styles.optionIcon}>⌨️</Text>
              <Text style={styles.optionTitle}>ENTER HUB IP</Text>
              <Text style={styles.optionSub}>Manual static configuration</Text>
            </TouchableOpacity>
            {status === 'ERROR' && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>SYSTEM v4.0.2 // SECURE MESH</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 80, paddingHorizontal: 24 },
  brand: { color: THEME.colors.blue, fontFamily: THEME.fonts.monoBold, fontSize: 12, letterSpacing: 4 },
  title: { color: THEME.colors.text.primary, fontSize: 32, marginTop: 8, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  options: { gap: 16 },
  optionBtn: {
    backgroundColor: THEME.colors.surface, padding: 28, borderRadius: 16,
    borderWidth: 1, borderColor: THEME.colors.border, alignItems: 'center',
  },
  optionIcon: { fontSize: 40 },
  optionTitle: { color: THEME.colors.text.primary, fontSize: 18, fontWeight: '800', marginTop: 12 },
  optionSub: { color: THEME.colors.text.secondary, fontSize: 13, marginTop: 4 },
  form: { backgroundColor: THEME.colors.surface, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: THEME.colors.border },
  label: { color: THEME.colors.text.secondary, fontFamily: THEME.fonts.monoBold, fontSize: 10, marginBottom: 8, letterSpacing: 1 },
  input: {
    backgroundColor: THEME.colors.background, color: THEME.colors.text.primary,
    padding: 16, borderRadius: 8, fontSize: 18, marginBottom: 24, borderWidth: 1, borderColor: THEME.colors.border,
  },
  connectBtn: { backgroundColor: THEME.colors.blue, padding: 20, borderRadius: 8, alignItems: 'center' },
  connectBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  backBtn: { marginTop: 16, alignItems: 'center' },
  backBtnText: { color: THEME.colors.blue, fontWeight: '700' },
  statusContainer: { justifyContent: 'center', alignItems: 'center', gap: 24 },
  statusText: { color: THEME.colors.blue, fontFamily: THEME.fonts.monoBold, fontSize: 14, letterSpacing: 2 },
  errorBox: { backgroundColor: 'rgba(248,113,113,0.1)', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#F87171' },
  errorText: { color: '#F87171', fontFamily: THEME.fonts.mono, fontSize: 12, textAlign: 'center' },
  footer: { paddingBottom: 40, alignItems: 'center' },
  version: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, fontSize: 10, letterSpacing: 1 },
});
