/**
 * scanner.web.tsx — Web variant of /(app)/scanner
 * Expo Router auto-selects this on web instead of scanner.tsx.
 * Business logic: identical to native onScan handler.
 */
import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WebBarcodeScanner } from '../../src/components/WebBarcodeScanner';
import { queueManager } from '../../src/services/OfflineQueueManager';
import { useStatsStore } from '../../src/store/StatsStore';

const COLORS = {
  bg: '#09090b',
  blue: '#60a5fa',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#27272a',
  green: '#4ade80',
};

export default function ScannerWebScreen() {
  const router = useRouter();
  const { scanCount, efficiency, incrementScan } = useStatsStore();
  const [scanned, setScanned] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const glowAnim = useRef(new Animated.Value(0)).current;

  const triggerGlow = () => {
    Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
    ]).start();
  };

  const handleScan = useCallback((data: string) => {
    if (scanned || data === lastCode) return;
    setScanned(true);
    setLastCode(data);

    // Exact same logic as native onScan handler
    incrementScan();
    triggerGlow();

    queueManager.enqueueTier2(1, {
      code: data,
      ts: Date.now(),
    });

    setTimeout(() => {
      setScanned(false);
      router.back();
    }, 800);
  }, [scanned, lastCode]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.glowBorder, { opacity: glowAnim, borderColor: COLORS.green }]}
        pointerEvents="none"
      />

      <View style={styles.header}>
        <Text style={styles.label}>INDUSTRIAL DECODER ACTIVE</Text>
      </View>

      <WebBarcodeScanner
        onScan={handleScan}
        title="INDUSTRIAL DECODER ACTIVE"
        hint="Align barcode or QR within guides"
      />

      {/* Stats bar */}
      <View style={styles.statsBar}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{scanCount}</Text>
          <Text style={styles.statLabel}>SCANS TODAY</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{efficiency}</Text>
          <Text style={styles.statLabel}>UNITS / MIN</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>

      {scanned && (
        <View style={styles.scannedBadge}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.green} />
          <Text style={styles.scannedText}>SCAN LOGGED</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  glowBorder: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    borderWidth: 10, zIndex: 10, pointerEvents: 'none',
  },
  header: { paddingTop: 60, paddingHorizontal: 24, alignItems: 'center', marginBottom: 8 },
  label: { color: COLORS.blue, fontWeight: '900', fontSize: 16, letterSpacing: 2 },
  statsBar: {
    flexDirection: 'row', backgroundColor: 'rgba(24,24,27,0.9)',
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.border,
    alignItems: 'center', gap: 20, margin: 16,
  },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { color: '#f8fafc', fontSize: 22, fontWeight: '900' },
  statLabel: { color: '#94a3b8', fontSize: 10, fontWeight: '700', marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: COLORS.border },
  closeBtn: {
    position: 'absolute', top: 60, right: 20,
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center',
  },
  scannedBadge: {
    position: 'absolute', bottom: 120, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(74,222,128,0.15)', borderWidth: 1,
    borderColor: '#4ade80', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20,
  },
  scannedText: { color: '#4ade80', fontWeight: '900', fontSize: 13, letterSpacing: 1 },
});
