/**
 * ══════════════════════════════════════════════════════════
 * FILE LOCATION:  app/(mesh)/pair.tsx
 * ACTION:         NEW — create this file
 * ROUTE:          /pair  (modal)
 * ══════════════════════════════════════════════════════════
 *
 * Pairing Screen — two modes:
 *   1. QR Scanner: uses expo-camera to scan the QR from the PC screen
 *   2. Manual:     user types the GSG-XXXX-XXXX code + hub IP
 *
 * On success: navigates to /messenger
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useMesh } from '@/hooks/useMesh';
import { decodePairingQR, MESH_WS_PATH } from '@/lib/mesh/mesh-protocol';
import { getOfflineQueue } from '@/lib/mesh/offline-queue';

// ─── Palette ──────────────────────────────────────────────────

const C = {
  bg:          '#0D1117',
  surface:     '#161B22',
  border:      '#30363D',
  accent:      '#388BFD',
  success:     '#3FB950',
  danger:      '#F85149',
  text:        '#E6EDF3',
  textMuted:   '#8B949E',
  textDim:     '#484F58',
};

// ─────────────────────────────────────────────────────────────

export default function PairScreen() {
  const [mode,        setMode]        = useState<'qr' | 'manual'>('qr');
  const [permission,  requestPerm]    = useCameraPermissions();
  const [scanning,    setScanning]    = useState(false);
  const [manualCode,  setManualCode]  = useState('');
  const [manualIp,    setManualIp]    = useState('');
  const [deviceName,  setDeviceName]  = useState('');
  const [busy,        setBusy]        = useState(false);
  const [error,       setError]       = useState('');

  const scannedRef  = useRef(false);   // prevent double-scan
  const { pairWithCode } = useMesh();

  // ── QR Scan handler ─────────────────────────────────────

  const onQRScanned = useCallback(async ({ data }: { type: string; data: string }) => {
    if (scannedRef.current || busy) return;
    scannedRef.current = true;
    setScanning(false);

    let payload: ReturnType<typeof decodePairingQR>;
    try {
      payload = decodePairingQR(data);
    } catch {
      setError('Invalid QR code — scan the QR from the Gold She PC hub.');
      scannedRef.current = false;
      return;
    }

    if (Date.now() > payload.expiresAt) {
      setError('This QR code has expired. Generate a new one on the PC.');
      scannedRef.current = false;
      return;
    }

    if (!deviceName.trim()) {
      Alert.alert(
        'Set Device Name',
        'What should this device be called on the hub?',
        [{ text: 'OK' }]
      );
      scannedRef.current = false;
      return;
    }

    await pair(
      `ws://${payload.hubIp}:${payload.hubPort}${MESH_WS_PATH}`,
      payload.code,
      deviceName.trim()
    );
  }, [busy, deviceName, pairWithCode]);

  // ── Manual pair ──────────────────────────────────────────

  const onManualPair = useCallback(async () => {
    const code = manualCode.trim().replace(/-/g, '').toUpperCase();
    const ip   = manualIp.trim();

    if (code.length !== 8) {
      setError('Enter the full 8-character code (e.g. GSG-ABCD-1234)');
      return;
    }
    if (!ip) {
      setError('Enter the PC\'s IP address (shown on the PC pairing screen)');
      return;
    }
    if (!deviceName.trim()) {
      setError('Enter a name for this device');
      return;
    }

    const port = 3000;
    await pair(`ws://${ip}:${port}${MESH_WS_PATH}`, code, deviceName.trim());
  }, [manualCode, manualIp, deviceName]);

  // ── Shared pair fn ───────────────────────────────────────

  const pair = async (hubUrl: string, code: string, name: string) => {
    setBusy(true);
    setError('');
    try {
      await pairWithCode(hubUrl, code, name);
      router.replace('/(mesh)/messenger');
    } catch (err) {
      setError((err as Error).message ?? 'Pairing failed. Check the code and try again.');
      scannedRef.current = false;
    } finally {
      setBusy(false);
    }
  };

  // ── Camera permission ────────────────────────────────────

  const handleScanPress = async () => {
    if (!permission?.granted) {
      const result = await requestPerm();
      if (!result.granted) {
        setError('Camera permission is required to scan the QR code.');
        return;
      }
    }
    scannedRef.current = false;
    setScanning(true);
  };

  // ─── Render ───────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Connect to Hub</Text>
          <Text style={styles.headerSub}>
            Make sure your phone and the PC are on the{'\n'}same WiFi or network.
          </Text>
        </View>

        {/* Device name (always visible) */}
        <View style={styles.card}>
          <Text style={styles.label}>This Device's Name</Text>
          <TextInput
            style={styles.input}
            value={deviceName}
            onChangeText={setDeviceName}
            placeholder='e.g. "Floor-01" or "Manager Phone"'
            placeholderTextColor={C.textDim}
            autoCapitalize="words"
            maxLength={30}
          />
        </View>

        {/* Mode toggle */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'qr' && styles.modeBtnActive]}
            onPress={() => { setMode('qr'); setError(''); }}
          >
            <Text style={[styles.modeBtnText, mode === 'qr' && styles.modeBtnTextActive]}>
              📷 Scan QR
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, mode === 'manual' && styles.modeBtnActive]}
            onPress={() => { setMode('manual'); setScanning(false); setError(''); }}
          >
            <Text style={[styles.modeBtnText, mode === 'manual' && styles.modeBtnTextActive]}>
              ⌨️ Type Code
            </Text>
          </TouchableOpacity>
        </View>

        {/* QR mode */}
        {mode === 'qr' && (
          <View style={styles.card}>
            {scanning ? (
              <View style={styles.cameraBox}>
                <CameraView
                  style={StyleSheet.absoluteFill}
                  facing="back"
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                  onBarcodeScanned={onQRScanned}
                />
                <View style={styles.cameraOverlay}>
                  <View style={styles.scanFrame} />
                  <Text style={styles.scanHint}>Point camera at the QR on the PC screen</Text>
                </View>
                <TouchableOpacity
                  style={styles.cancelScan}
                  onPress={() => { setScanning(false); scannedRef.current = false; }}
                >
                  <Text style={styles.cancelScanText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.scanBtn} onPress={handleScanPress} disabled={busy}>
                <Text style={styles.scanBtnIcon}>📷</Text>
                <Text style={styles.scanBtnText}>Tap to Scan QR Code</Text>
                <Text style={styles.scanBtnSub}>Open the PC app → Pair Device → scan the QR</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Manual mode */}
        {mode === 'manual' && (
          <View style={styles.card}>
            <Text style={styles.label}>Pairing Code</Text>
            <TextInput
              style={styles.input}
              value={manualCode}
              onChangeText={setManualCode}
              placeholder="GSG-XXXX-XXXX"
              placeholderTextColor={C.textDim}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={14}
            />
            <Text style={[styles.label, { marginTop: 12 }]}>Hub IP Address</Text>
            <TextInput
              style={styles.input}
              value={manualIp}
              onChangeText={setManualIp}
              placeholder="192.168.1.X"
              placeholderTextColor={C.textDim}
              keyboardType="numeric"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={[styles.primaryBtn, busy && styles.primaryBtnDisabled]}
              onPress={onManualPair}
              disabled={busy}
            >
              {busy
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.primaryBtnText}>Connect</Text>
              }
            </TouchableOpacity>
          </View>
        )}

        {/* Error */}
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Busy overlay */}
        {busy && !scanning && (
          <View style={styles.busyBox}>
            <ActivityIndicator color={C.accent} size="large" />
            <Text style={styles.busyText}>Connecting & securing channel…</Text>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────

const styles = StyleSheet.create({
  root:   { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 16, paddingBottom: 40 },

  header: { marginBottom: 20, alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 6 },
  headerSub:   { fontSize: 13, color: C.textMuted, textAlign: 'center', lineHeight: 20 },

  card: {
    backgroundColor: C.surface, borderRadius: 14,
    padding: 16, marginBottom: 14,
    borderWidth: 1, borderColor: C.border,
  },

  label: { fontSize: 12, fontWeight: '700', color: C.textMuted, marginBottom: 6, letterSpacing: 0.5 },

  input: {
    backgroundColor: '#0D1117', borderWidth: 1, borderColor: C.border,
    borderRadius: 10, padding: 12, color: C.text, fontSize: 14,
  },

  modeRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  modeBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1, borderColor: C.border, alignItems: 'center',
    backgroundColor: C.surface,
  },
  modeBtnActive:     { backgroundColor: `${C.accent}22`, borderColor: C.accent },
  modeBtnText:       { fontSize: 13, color: C.textMuted, fontWeight: '600' },
  modeBtnTextActive: { color: C.accent },

  scanBtn: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  scanBtnIcon: { fontSize: 48 },
  scanBtnText: { fontSize: 16, fontWeight: '700', color: C.text },
  scanBtnSub:  { fontSize: 12, color: C.textMuted, textAlign: 'center' },

  cameraBox: { height: 300, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  scanFrame: {
    width: 200, height: 200, borderWidth: 3, borderColor: C.accent,
    borderRadius: 12, backgroundColor: 'transparent',
  },
  scanHint: { color: '#fff', fontSize: 12, textAlign: 'center', paddingHorizontal: 20 },
  cancelScan: {
    position: 'absolute', bottom: 12, alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20,
  },
  cancelScanText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  primaryBtn: {
    marginTop: 16, backgroundColor: C.accent, borderRadius: 12,
    paddingVertical: 14, alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  errorBox: {
    backgroundColor: `${C.danger}18`, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: `${C.danger}44`, marginBottom: 14,
  },
  errorText: { color: C.danger, fontSize: 13, lineHeight: 20 },

  busyBox: { alignItems: 'center', paddingVertical: 24, gap: 12 },
  busyText: { color: C.textMuted, fontSize: 13 },
});
