import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { queueManager } from '../../src/services/OfflineQueueManager';
import { useVocabulary } from '../../src/store/VocabularyContext';
import { useStatsStore } from '../../src/store/StatsStore';

const COLORS = {
  bg: '#09090b',
  blue: '#60a5fa', // Electric Blue
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#27272a',
};

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [torch, setTorch] = useState(false);
  const router = useRouter();
  const { getLabel } = useVocabulary();
  
  const { scanCount, efficiency, incrementScan } = useStatsStore();
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setIsIdle(false);
    idleTimer.current = setTimeout(() => setIsIdle(true), 1200000); // 20 mins
  }, []);

  useEffect(() => {
    resetIdleTimer();
    return () => { if (idleTimer.current) clearTimeout(idleTimer.current); };
  }, [resetIdleTimer]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const triggerGlow = () => {
    Animated.sequence([
      Animated.timing(glowAnim, { toValue: 1, duration: 150, useNativeDriver: false }),
      Animated.timing(glowAnim, { toValue: 0, duration: 500, useNativeDriver: false }),
    ]).start();
  };

  if (!permission) return <View style={{ flex: 1, backgroundColor: COLORS.bg }} />;

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>CAMERA RESTRICTED</Text>
        <TouchableOpacity style={styles.grantBtn} onPress={requestPermission}>
          <Text style={styles.grantText}>ENABLE SCANNER</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onScan = ({ data }: { data: string }) => {
    if (scanned || isIdle) return;
    resetIdleTimer();
    setScanned(true);
    
    // Increment Stats
    incrementScan();
    triggerGlow();

    // PILLAR 1: Log action immediately to queue
    queueManager.enqueueTier2(1, {
      code: data,
      ts: Date.now()
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    setTimeout(() => {
      setScanned(false);
      router.back(); 
    }, 800);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        enableTorch={torch}
        onBarcodeScanned={scanned || isIdle ? undefined : onScan}
      >
        <Animated.View 
          style={[
            styles.glowBorder, 
            { opacity: glowAnim }
          ]} 
        />
        
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.label}>INDUSTRIAL DECODER ACTIVE</Text>
            <Text style={styles.subLabel}>TARGETING {getLabel('batch').toUpperCase()} / {getLabel('unit').toUpperCase()}</Text>
          </View>

          {/* Tactical Reticle */}
          <Animated.View style={[styles.reticle, { transform: [{ scale: pulseAnim }] }]}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </Animated.View>

          {/* Worker Stats Bar */}
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

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.largeIconBtn} onPress={() => setTorch(!torch)}>
              <Ionicons name={torch ? "flash" : "flash-off"} size={32} color={torch ? COLORS.blue : "white"} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.largeIconBtn} onPress={() => router.back()}>
              <Ionicons name="close" size={32} color="white" />
            </TouchableOpacity>
          </View>

          {isIdle && (
            <View style={styles.idleOverlay}>
              <Ionicons name="moon-outline" size={64} color={COLORS.blue} />
              <Text style={styles.idleTitle}>SCANNER IDLE</Text>
              <Text style={styles.idleSub}>TO CONSERVE BATTERY</Text>
              <TouchableOpacity style={styles.wakeBtn} onPress={resetIdleTimer}>
                <Text style={styles.wakeText}>WAKE UP SCANNER</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  centered: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' },
  errorTitle: { color: '#ef4444', fontWeight: '900', marginBottom: 20 },
  grantBtn: { backgroundColor: COLORS.blue, paddingVertical: 20, paddingHorizontal: 40, borderRadius: 12 },
  grantText: { color: 'white', fontWeight: '900' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  header: { position: 'absolute', top: 60, alignItems: 'center', gap: 8 },
  label: { color: COLORS.blue, fontWeight: '900', fontSize: 18, letterSpacing: 2 },
  subLabel: { color: 'white', fontSize: 12, fontWeight: '600', marginTop: 4 },
  reticle: { width: 250, height: 250, position: 'relative' },
  corner: { position: 'absolute', width: 50, height: 50, borderColor: COLORS.blue },
  tl: { top: 0, left: 0, borderTopWidth: 6, borderLeftWidth: 6 },
  tr: { top: 0, right: 0, borderTopWidth: 6, borderRightWidth: 6 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 6, borderLeftWidth: 6 },
  br: { bottom: 0, right: 0, borderBottomWidth: 6, borderRightWidth: 6 },
  controls: { position: 'absolute', bottom: 60, flexDirection: 'row', gap: 60 },
  // PILLAR 5: 80px touch target
  largeIconBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(0,0,0,0.7)', borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  glowBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 10,
    borderColor: '#4ade80',
    zIndex: 10,
  },
  statsBar: {
    position: 'absolute',
    bottom: 160,
    backgroundColor: 'rgba(24,24,27,0.9)',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    color: '#f8fafc',
    fontSize: 24,
    fontWeight: '900',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: COLORS.border,
  },
  idleOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(9,9,11,0.98)', justifyContent: 'center', alignItems: 'center', zIndex: 110 },
  idleTitle: { color: COLORS.blue, fontSize: 24, fontWeight: '900', letterSpacing: 4, marginTop: 24 },
  idleSub: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '700', marginTop: 8 },
  wakeBtn: { marginTop: 40, backgroundColor: COLORS.blue, paddingVertical: 24, paddingHorizontal: 50, borderRadius: 16 },
  wakeText: { color: 'white', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
