'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, Stack } from 'expo-router';
import { safeHaptics as Haptics } from '../../src/utils/safeHaptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../../src/store/AuthStore';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { NoxisLogo } from '../../src/components/ui/NoxisLogo';
import { smartConnect } from '../../src/services/ConnectionManager';
import { connectViaWebSocket, pairWithHub } from '../../src/services/TCPClientService';
import { useBridgeStatusStore } from '../../src/stores/BridgeStatusStore';
import { useBridgeStatus } from '../../src/store/BridgeStatusStore';
import { useTierStore } from '../../src/stores/TierStore';
import {
  RealtimeMeshSyncEngine,
  PRIMARY_PRODUCTION_BUSINESS_ID,
  PRIMARY_BUSINESS_NAME,
} from '../../src/services/RealtimeMeshSyncEngine';
import { LocalDataManager } from '../../src/services/LocalDataManager';
import { NOXIS_CLIENT_VERSION } from '../../src/services/UpdateService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BG = '#080A0E';
const SURFACE = '#0F131D';
const SURFACE_HOVER = '#161B29';
const BORDER = '#1F273B';
const CYAN = '#00E5FF';
const GREEN = '#10B981';
const GOLD = '#F59E0B';
const DANGER = '#EF4444';
const TEXT_MAIN = '#FFFFFF';
const TEXT_MUTED = '#94A3B8';

const KNOWN_PC_IP = '192.168.0.102';
const KNOWN_PC_IP_ALT = '192.168.0.103';
const KNOWN_PC_IP_ALT2 = '192.168.0.110';
const KNOWN_PC_IP_ALT3 = '192.168.0.105';
const KNOWN_PORT = '7447';

interface DiscoveredHub {
  ip: string;
  port: string;
  url: string;
  latencyMs: number;
  online: boolean;
}

export default function PairScreen() {
  const router = useRouter();
  const { setCredentials } = useAuthStore();
  const [permission, requestPermission] = useCameraPermissions();

  // Mode: INSTANT (default) vs MANUAL vs SCANNER
  const [activeTab, setActiveTab] = useState<'INSTANT' | 'MANUAL' | 'SCANNER'>('INSTANT');

  // Manual IP state
  const [ip, setIp] = useState(KNOWN_PC_IP);
  const [port, setPort] = useState(KNOWN_PORT);
  const [pastePayload, setPastePayload] = useState('');

  // Auto-discovery state
  const [isProbing, setIsProbing] = useState(true);
  const [discoveredHub, setDiscoveredHub] = useState<DiscoveredHub | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scanner state
  const [torchOn, setTorchOn] = useState(false);
  const [pairingStatus, setPairingStatus] = useState<'idle' | 'connecting' | 'connected' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const isScanningRef = useRef(false);
  const barcodeSettings = useRef({ barcodeTypes: ['qr' as const] }).current;

  // Animations
  const scanAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Load last used IP if available
  useEffect(() => {
    AsyncStorage.getItem('noxis_last_ip')
      .then((cachedIp) => {
        if (cachedIp && cachedIp.trim()) {
          setIp(cachedIp.trim());
        }
      })
      .catch(() => {});
  }, []);

  // Radar Pulse Animation
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Scanline animation for camera
  useEffect(() => {
    if (activeTab === 'SCANNER') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [activeTab]);

  /**
   * Fast probe helper: tests a WebSocket endpoint
   */
  const probeEndpoint = async (url: string, timeoutMs = 2000): Promise<{ ok: boolean; latency: number }> => {
    const startMs = Date.now();
    const cleanIpMatch = url.match(/^(?:https?|wss?):\/\/([^:/]+)/);
    const targetIp = cleanIpMatch ? cleanIpMatch[1] : null;

    if (targetIp) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), Math.min(timeoutMs, 1000));
        const res = await Promise.any([
          fetch(`http://${targetIp}:7447/api/hub/info`, { signal: controller.signal }),
          fetch(`http://${targetIp}:3000/api/hub/info`, { signal: controller.signal }),
        ]);
        clearTimeout(timer);
        if (res.ok) {
          return { ok: true, latency: Date.now() - startMs };
        }
      } catch {}
    }

    return new Promise((resolve) => {
      let settled = false;
      let ws: WebSocket | null = null;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          try { ws?.close(); } catch {}
          resolve({ ok: false, latency: 999 });
        }
      }, timeoutMs);

      try {
        ws = new WebSocket(url);
        ws.onopen = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            const latency = Date.now() - startMs;
            try { ws?.close(); } catch {}
            resolve({ ok: true, latency });
          }
        };
        ws.onerror = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve({ ok: false, latency: 999 });
          }
        };
        ws.onclose = () => {
          if (!settled) {
            settled = true;
            clearTimeout(timer);
            resolve({ ok: false, latency: 999 });
          }
        };
      } catch {
        if (!settled) {
          settled = true;
          clearTimeout(timer);
          resolve({ ok: false, latency: 999 });
        }
      }
    });
  };

  /**
   * Background Auto-Discovery: Probes known LAN endpoints on mount and sweeps subnet
   */
  const runAutoDiscovery = async () => {
    setIsProbing(true);
    const candidateIps = [
      KNOWN_PC_IP,
      ip.trim(),
      KNOWN_PC_IP_ALT,
      KNOWN_PC_IP_ALT2,
      KNOWN_PC_IP_ALT3,
    ].filter(Boolean);
    const uniqueIps = Array.from(new Set(candidateIps));

    for (const testIp of uniqueIps) {
      const targetUrl = `ws://${testIp}:${KNOWN_PORT}`;
      const probeRes = await probeEndpoint(targetUrl, 1200);
      if (probeRes.ok) {
        setDiscoveredHub({
          ip: testIp,
          port: KNOWN_PORT,
          url: targetUrl,
          latencyMs: probeRes.latency,
          online: true,
        });
        setIsProbing(false);
        setCountdown(3);
        return;
      }
    }

    // Secondary parallel sweep across 192.168.0.100 to 192.168.0.125
    const subnetPool: string[] = [];
    for (let i = 100; i <= 125; i++) {
      const cand = `192.168.0.${i}`;
      if (!uniqueIps.includes(cand)) subnetPool.push(cand);
    }
    const BATCH_SIZE = 6;
    for (let i = 0; i < subnetPool.length; i += BATCH_SIZE) {
      const batch = subnetPool.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        batch.map(async (testIp) => {
          const targetUrl = `ws://${testIp}:${KNOWN_PORT}`;
          const res = await probeEndpoint(targetUrl, 800);
          return { testIp, targetUrl, ...res };
        })
      );
      const found = results.find((r) => r.ok);
      if (found) {
        setDiscoveredHub({
          ip: found.testIp,
          port: KNOWN_PORT,
          url: found.targetUrl,
          latencyMs: found.latency,
          online: true,
        });
        setIsProbing(false);
        setCountdown(3);
        return;
      }
    }

    setIsProbing(false);
  };

  useEffect(() => {
    runAutoDiscovery();
  }, []);

  // Handle Auto-Connect countdown
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      if (discoveredHub && pairingStatus === 'idle') {
        connectToDiscoveredHub();
      }
      return;
    }

    countdownTimerRef.current = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [countdown, discoveredHub, pairingStatus]);

  const cancelCountdown = () => {
    if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    setCountdown(null);
  };

  /**
   * Finalizes pairing handshake, saves credentials, and navigates to dashboard.
   */
  const finalizeConnection = async (
    bridgeUrl: string, 
    method: 'local' | 'tunnel' | 'supabase' | 'none' = 'local',
    initialTier?: string
  ) => {
    try {
      const methodLabel = method === 'local' ? 'Local LAN' : method === 'supabase' ? 'Cloud Mesh' : 'Secure Tunnel';
      setStatusMessage(`Bonding via ${methodLabel}...`);
      setPairingStatus('connecting');

      // 1. Establish persistent live WebSocket bridge connection immediately
      try {
        await connectViaWebSocket(bridgeUrl);
      } catch (wsErr) {
        console.warn('[PairScreen] WebSocket connection notice:', wsErr);
      }

      // Connect and trigger 2-way sync: push offline work to PC Hub & pull latest PC data
      setTimeout(async () => {
        try {
          const { drainQueue } = require('../../src/services/OfflineSyncService');
          await drainQueue();
          await LocalDataManager.hydrateFromCloud('ffa84a41-941e-4e4e-87c3-9580271db2bd');
          await LocalDataManager.forcePullFromHub();
        } catch (e) {
          console.warn('[PairScreen] Background sync on pair error:', e);
        }
      }, 100);

      const targetIp = (bridgeUrl.startsWith('ws://') || bridgeUrl.startsWith('wss://'))
        ? (bridgeUrl.replace(/^wss?:\/\//, '').split(/[:/]/)[0] || KNOWN_PC_IP)
        : KNOWN_PC_IP;
      const targetPort = parseInt(bridgeUrl.replace(/.*:(\d+).*/, '$1'), 10) || 7447;

      await AsyncStorage.setItem('noxis_welcome_seen', 'true').catch(() => {});
      await AsyncStorage.setItem('noxis_last_ip', targetIp).catch(() => {});

      // Synchronize exact PC tier with mobile credentials and stores
      const activeTier = (initialTier || (useBridgeStatusStore.getState() as any).tierLimit || (useBridgeStatusStore.getState() as any).tier || useTierStore.getState().tier || 'LITE').toString().toUpperCase();
      const nodeTier: 'LITE' | 'ELITE' = activeTier.includes('ELITE') ? 'ELITE' : 'LITE';

      setCredentials(
        targetIp,
        targetPort,
        `MOBILE_${Date.now().toString(36).toUpperCase()}`,
        nodeTier,
        'MANAGER_ROVING'
      );

      const normalizedTier: 'lite' | 'pro' | 'elite' = activeTier.includes('ELITE') ? 'elite' : activeTier.includes('PRO') ? 'pro' : 'lite';
      useBridgeStatus.getState().setTierLimit(normalizedTier);
      useTierStore.getState().setTierFromHub({
        tier: normalizedTier,
        expiresAt: '',
        limits: {},
      });

      useBridgeStatusStore.getState().setStatus({
        hubOnline: true,
        syncStatus: 'synced',
        connectionStatus: 'connected',
        connectionMethod: method === 'supabase' ? 'supabase' : method === 'tunnel' ? 'tunnel' : 'local',
        businessId: 'ffa84a41-941e-4e4e-87c3-9580271db2bd',
        businessName: 'Noxis Textile Mills',
        hubIp: targetIp,
      });

      setPairingStatus('connected');
      setStatusMessage(`Paired with PC Hub via ${methodLabel}! Opening Dashboard...`);
      try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {}

      setTimeout(() => {
        try {
          router.replace('/(app)/dashboard');
        } catch {
          router.push('/(app)/dashboard');
        }
      }, 400);
    } catch (err: any) {
      console.error('[PairScreen] Finalize error:', err);
      setPairingStatus('failed');
      setStatusMessage('Connection failed');
      setErrorDetails(err?.message || 'Error initializing connection');
    }
  };

  /**
   * 1-Tap Connect to Discovered Hub
   */
  const connectToDiscoveredHub = async () => {
    cancelCountdown();
    if (!discoveredHub) return;
    setPairingStatus('connecting');
    setStatusMessage(`Connecting to ${discoveredHub.ip}:${discoveredHub.port}...`);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const pairRes = await pairWithHub(discoveredHub.url, 6000);
    if (pairRes.success) {
      await finalizeConnection(discoveredHub.url, 'local');
    } else {
      setPairingStatus('failed');
      setStatusMessage('Connection failed');
      setErrorDetails(pairRes.error || `Could not connect to ${discoveredHub.url}`);
    }
  };

  /**
   * Manual Connect Button Handler
   */
  const handleManualConnect = async () => {
    cancelCountdown();
    const trimmedIp = ip.trim() || KNOWN_PC_IP;
    const portNum = parseInt(port.trim() || KNOWN_PORT, 10);
    const targetWs = `ws://${trimmedIp}:${portNum}`;

    setPairingStatus('connecting');
    setStatusMessage(`Connecting to ${trimmedIp}:${portNum}...`);
    setErrorDetails(null);

    const pairRes = await pairWithHub(targetWs, 6000);
    if (pairRes.success) {
      await finalizeConnection(targetWs, 'local');
      return;
    }

    setPairingStatus('failed');
    setStatusMessage(`Cannot connect to ${trimmedIp}`);
    setErrorDetails(
      pairRes.error || `Checked ${trimmedIp}:${portNum}. Verify PC Hub is running and Phone is on the same Wi-Fi.`
    );
  };

  /**
   * Universal parser for QR code / clipboard / manual string
   */
  const parsePayloadTarget = (raw: string): { wsUrl: string; tunnelUrl?: string; tier?: string } => {
    const text = raw.trim();
    if (text.startsWith('{')) {
      try {
        const parsed = JSON.parse(text);
        const tier = parsed.tier || parsed.nodeTier || parsed.activeProfile || parsed.tierLimit;
        if (parsed.bridgeUrl && typeof parsed.bridgeUrl === 'string' && parsed.bridgeUrl.startsWith('ws')) {
          return { wsUrl: parsed.bridgeUrl, tunnelUrl: parsed.tunnelUrl, tier };
        }
        if (parsed.ip) {
          return { wsUrl: `ws://${parsed.ip}:${parsed.port || KNOWN_PORT}`, tunnelUrl: parsed.tunnelUrl, tier };
        }
        if (parsed.url) {
          return { wsUrl: parsed.url, tunnelUrl: parsed.tunnelUrl, tier };
        }
      } catch {}
    }

    // Key-value pairs (v:2,ip:192.168.0.110,port:7447,tier:PRO,...)
    if (text.includes('ip:') || text.includes('port:') || text.includes('bridgeUrl:')) {
      const bridgeMatch = text.match(/(?:^|[,;\s])bridgeUrl[:=]([^\s,]+)/i);
      const tierMatch = text.match(/(?:^|[,;\s])tier[:=]([^\s,]+)/i);
      if (bridgeMatch && bridgeMatch[1]) {
        return { wsUrl: bridgeMatch[1], tier: tierMatch ? tierMatch[1] : undefined };
      }
      const ipMatch = text.match(/(?:^|[,;\s])ip[:=]([0-9.]+)/i);
      const portMatch = text.match(/(?:^|[,;\s])port[:=](\d+)/i);
      const tunnelMatch = text.match(/(?:^|[,;\s])tunnelUrl[:=]([^\s,]+)/i);
      if (ipMatch && ipMatch[1]) {
        const p = portMatch ? portMatch[1] : KNOWN_PORT;
        return { 
          wsUrl: `ws://${ipMatch[1]}:${p}`, 
          tunnelUrl: tunnelMatch ? tunnelMatch[1] : undefined,
          tier: tierMatch ? tierMatch[1] : undefined 
        };
      }
    }

    if (text.startsWith('ws://') || text.startsWith('wss://')) {
      return { wsUrl: text };
    }
    if (text.startsWith('http://') || text.startsWith('https://')) {
      return { wsUrl: text.replace(/^http/, 'ws'), tunnelUrl: text.includes('trycloudflare.com') ? text : undefined };
    }

    const ipPortMatch = text.match(/^([0-9.]+)(?::(\d+))?$/);
    if (ipPortMatch && ipPortMatch[1]) {
      return { wsUrl: `ws://${ipPortMatch[1]}:${ipPortMatch[2] || KNOWN_PORT}` };
    }

    return { wsUrl: `ws://${KNOWN_PC_IP}:${KNOWN_PORT}` };
  };

  /**
   * Barcode Scanned Callback from CameraView
   */
  const handleBarcodeScanned = async (event: any) => {
    if (isScanningRef.current) return;
    const data = typeof event === 'string' ? event : event?.data;
    if (!data || !data.trim()) return;
    isScanningRef.current = true;

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}

    const target = parsePayloadTarget(data);
    setStatusMessage(`Pairing with PC at ${target.wsUrl}...`);
    setPairingStatus('connecting');
    setErrorDetails(null);

    // 1. Direct authoritative handshake with PC Hub via WebSocket
    const pairRes = await pairWithHub(target.wsUrl, 6000);
    if (pairRes.success) {
      await finalizeConnection(target.wsUrl, 'local', target.tier);
      return;
    }

    // 2. If direct LAN failed and tunnelUrl is present, try Tunnel
    if (target.tunnelUrl) {
      setStatusMessage(`Trying Secure Tunnel...`);
      const tunnelRes = await pairWithHub(target.tunnelUrl, 6000);
      if (tunnelRes.success) {
        await finalizeConnection(target.tunnelUrl, 'tunnel', target.tier);
        return;
      }
    }

    // 3. Failed: report clear explanation to user
    setPairingStatus('failed');
    setStatusMessage('Pairing Failed');
    setErrorDetails(
      `Could not connect to PC Hub at ${target.wsUrl}.\n\n` +
      `1. Make sure your Phone and PC are connected to the same Wi-Fi.\n` +
      `2. Verify Noxis Hub is running on your PC.\n` +
      `3. Verify PC IP address matches the QR code.`
    );
    setTimeout(() => {
      isScanningRef.current = false;
    }, 4000);
  };

  /**
   * Parse and connect via pasted payload or QR text
   */
  const handleConnectPasted = async () => {
    cancelCountdown();
    const raw = pastePayload.trim();
    if (!raw) return;

    setPairingStatus('connecting');
    setStatusMessage('Connecting from input...');
    setErrorDetails(null);

    const target = parsePayloadTarget(raw);
    const pairRes = await pairWithHub(target.wsUrl, 6000);
    if (pairRes.success) {
      await finalizeConnection(target.wsUrl, 'local', target.tier);
      return;
    }

    if (target.tunnelUrl) {
      const tunnelRes = await pairWithHub(target.tunnelUrl, 6000);
      if (tunnelRes.success) {
        await finalizeConnection(target.tunnelUrl, 'tunnel', target.tier);
        return;
      }
    }

    setPairingStatus('failed');
    setStatusMessage('Connection failed');
    setErrorDetails(pairRes.error || `Could not connect to ${target.wsUrl}`);
  };

  const handleContinueOffline = async () => {
    cancelCountdown();
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    await AsyncStorage.setItem('noxis_welcome_seen', 'true').catch(() => {});
    useBridgeStatusStore.getState().setStatus({
      businessId: 'ffa84a41-941e-4e4e-87c3-9580271db2bd',
      businessName: 'Noxis Textile Mills',
      role: 'owner',
    });
    LocalDataManager.hydrateFromCloud('ffa84a41-941e-4e4e-87c3-9580271db2bd').catch(() => {});
    setCredentials(
      ip.trim() || KNOWN_PC_IP,
      parseInt(port.trim() || KNOWN_PORT, 10),
      `OFFLINE_NODE_${Date.now().toString(36)}`,
      'LITE',
      'EXECUTIVE_ADMIN'
    );
    router.replace('/(app)/dashboard');
  };

  const scanlineTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  return (
    <View style={styles.rootContainer}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* TOP HEADER & SEGMENTED TABS */}
      <SafeAreaView style={styles.topSafeArea}>
        <View style={styles.topBar}>
          <View style={styles.brandGroup}>
            <NoxisLogo size={36} variant="badge" glow />
            <View>
              <Text style={styles.brandTitle}>NOXIS HUB MESH</Text>
              <Text style={styles.brandSubtitle}>v{NOXIS_CLIENT_VERSION} · Enterprise Terminal Link</Text>
            </View>
          </View>

          {discoveredHub?.online && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>HUB LIVE</Text>
            </View>
          )}
        </View>

        {/* 3-Way Tab Switcher */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'INSTANT' && styles.segmentBtnActive]}
            onPress={() => {
              setActiveTab('INSTANT');
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="flash"
              size={15}
              color={activeTab === 'INSTANT' ? '#000000' : CYAN}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.segmentText, activeTab === 'INSTANT' && styles.segmentTextActive]}>
              INSTANT CONNECT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'MANUAL' && styles.segmentBtnActive]}
            onPress={() => {
              cancelCountdown();
              setActiveTab('MANUAL');
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="terminal-outline"
              size={15}
              color={activeTab === 'MANUAL' ? '#000000' : TEXT_MUTED}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.segmentText, activeTab === 'MANUAL' && styles.segmentTextActive]}>
              MANUAL IP
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'SCANNER' && styles.segmentBtnActive]}
            onPress={() => {
              cancelCountdown();
              setActiveTab('SCANNER');
            }}
            activeOpacity={0.8}
          >
            <Ionicons
              name="scan-outline"
              size={15}
              color={activeTab === 'SCANNER' ? '#000000' : TEXT_MUTED}
              style={{ marginRight: 6 }}
            />
            <Text style={[styles.segmentText, activeTab === 'SCANNER' && styles.segmentTextActive]}>
              VIEWFINDER
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ──────────────── TAB 1: INSTANT CONNECT (HERO AUTO-DISCOVERY) ──────────────── */}
      {activeTab === 'INSTANT' && (
        <ScreenContainer style={styles.instantContainer}>
          <ScrollView contentContainerStyle={styles.instantScroll} keyboardShouldPersistTaps="handled">
            
            {/* Radar / Scanner Visual Card */}
            <View style={styles.radarCard}>
              <Animated.View style={[styles.radarOuterCircle, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.radarInnerCircle}>
                  <Ionicons
                    name={discoveredHub?.online ? 'wifi' : 'radio-outline'}
                    size={40}
                    color={discoveredHub?.online ? GREEN : CYAN}
                  />
                </View>
              </Animated.View>

              <Text style={styles.radarTitle}>
                {discoveredHub?.online ? 'PC NOXIS HUB DETECTED!' : isProbing ? 'SCANNING LOCAL WI-FI...' : 'NOXIS MESH READY'}
              </Text>
              <Text style={styles.radarSubtitle}>
                {discoveredHub?.online
                  ? `Active on LAN · Response time: ${discoveredHub.latencyMs}ms`
                  : isProbing
                  ? 'Searching for desktop software on port 7447...'
                  : `Target: ${KNOWN_PC_IP}:7447`}
              </Text>
            </View>

            {/* Discovered Hub Card */}
            {discoveredHub?.online ? (
              <View style={styles.foundHubCard}>
                <View style={styles.foundHubTop}>
                  <View style={styles.foundHubIconBox}>
                    <Ionicons name="desktop-outline" size={24} color="#000000" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.foundHubTitle}>Ahmad Textile Mills (PC Hub)</Text>
                    <Text style={styles.foundHubEndpoint}>
                      ws://{discoveredHub.ip}:{discoveredHub.port} · Ping: {discoveredHub.latencyMs}ms
                    </Text>
                  </View>
                  <View style={styles.latencyBadge}>
                    <Text style={styles.latencyText}>FAST</Text>
                  </View>
                </View>

                {countdown !== null && countdown > 0 && (
                  <View style={styles.countdownRow}>
                    <ActivityIndicator size="small" color={CYAN} style={{ marginRight: 8 }} />
                    <Text style={styles.countdownText}>
                      Auto-connecting in {countdown}s...
                    </Text>
                    <TouchableOpacity onPress={cancelCountdown} style={styles.cancelCountdownBtn}>
                      <Text style={styles.cancelCountdownText}>CANCEL</Text>
                    </TouchableOpacity>
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.primaryConnectBtn,
                    pairingStatus === 'connecting' && styles.primaryConnectBtnConnecting,
                  ]}
                  onPress={connectToDiscoveredHub}
                  disabled={pairingStatus === 'connecting'}
                  activeOpacity={0.85}
                >
                  {pairingStatus === 'connecting' ? (
                    <>
                      <ActivityIndicator size="small" color="#000000" style={{ marginRight: 10 }} />
                      <Text style={styles.primaryConnectBtnText}>BONDING IN PROGRESS...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="flash" size={20} color="#000000" style={{ marginRight: 10 }} />
                      <Text style={styles.primaryConnectBtnText}>⚡ CONNECT NOW (1-TAP)</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              /* Fallback Direct Connect Card if auto-discovery is still searching */
              <View style={styles.directHubCard}>
                <View style={styles.directHubHeader}>
                  <Ionicons name="hardware-chip" size={20} color={CYAN} />
                  <Text style={styles.directHubTitle}>FAST-TRACK WI-FI BOND</Text>
                </View>
                <Text style={styles.directHubSub}>
                  Direct connection pre-configured for your PC ({KNOWN_PC_IP}:7447).
                </Text>

                <TouchableOpacity
                  style={[
                    styles.primaryConnectBtn,
                    pairingStatus === 'connecting' && styles.primaryConnectBtnConnecting,
                  ]}
                  onPress={() => {
                    finalizeConnection(`ws://${KNOWN_PC_IP}:7447`, 'local');
                  }}
                  disabled={pairingStatus === 'connecting'}
                  activeOpacity={0.85}
                >
                  {pairingStatus === 'connecting' ? (
                    <ActivityIndicator size="small" color="#000000" />
                  ) : (
                    <>
                      <Ionicons name="link" size={18} color="#000000" style={{ marginRight: 8 }} />
                      <Text style={styles.primaryConnectBtnText}>CONNECT TO {KNOWN_PC_IP}</Text>
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rescanBtn}
                  onPress={runAutoDiscovery}
                  activeOpacity={0.8}
                >
                  <Ionicons name="refresh" size={16} color={CYAN} style={{ marginRight: 6 }} />
                  <Text style={styles.rescanBtnText}>RE-SCAN WI-FI NETWORK</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Offline Standalone Bypass */}
            <TouchableOpacity
              style={styles.offlineBypassCard}
              onPress={handleContinueOffline}
              activeOpacity={0.85}
            >
              <View style={styles.offlineBypassLeft}>
                <View style={styles.offlineBypassIcon}>
                  <Ionicons name="cloud-offline" size={20} color="#000000" />
                </View>
                <View>
                  <Text style={styles.offlineBypassTitle}>USE OFFLINE LOCAL CACHE</Text>
                  <Text style={styles.offlineBypassSub}>17 Parties · 14 SKUs · 6 Karigars · Smart Khata active</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#000000" />
            </TouchableOpacity>

            {pairingStatus === 'failed' && errorDetails && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={DANGER} style={{ marginTop: 2 }} />
                <Text style={styles.errorBoxText}>{errorDetails}</Text>
              </View>
            )}
          </ScrollView>
        </ScreenContainer>
      )}

      {/* ──────────────── TAB 2: MANUAL IP & PASTE ──────────────── */}
      {activeTab === 'MANUAL' && (
        <ScreenContainer style={styles.manualContainer}>
          <ScrollView contentContainerStyle={styles.manualScroll} keyboardShouldPersistTaps="handled">
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="wifi-outline" size={18} color={CYAN} />
                <Text style={styles.cardHeaderTitle}>DIRECT TERMINAL IP</Text>
              </View>
              <Text style={styles.cardHeaderSub}>
                Enter the Wi-Fi IP address shown on your PC Hub screen.
              </Text>

              <Text style={styles.inputLabel}>PC HUB IP ADDRESS</Text>
              <TextInput
                style={styles.input}
                placeholder={KNOWN_PC_IP}
                placeholderTextColor={TEXT_MUTED}
                value={ip}
                onChangeText={(t) => setIp(t)}
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* Quick IP presets */}
              <View style={styles.presetRow}>
                <TouchableOpacity style={styles.presetBtn} onPress={() => setIp(KNOWN_PC_IP)}>
                  <Text style={styles.presetBtnText}>{KNOWN_PC_IP} (Active PC)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetBtn} onPress={() => setIp(KNOWN_PC_IP_ALT)}>
                  <Text style={styles.presetBtnText}>{KNOWN_PC_IP_ALT}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.presetBtn} onPress={() => setIp(KNOWN_PC_IP_ALT2)}>
                  <Text style={styles.presetBtnText}>{KNOWN_PC_IP_ALT2}</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>PORT</Text>
              <TextInput
                style={styles.input}
                placeholder="7447"
                placeholderTextColor={TEXT_MUTED}
                value={port}
                onChangeText={(t) => setPort(t)}
                keyboardType="number-pad"
              />

              <TouchableOpacity
                style={[
                  styles.primaryConnectBtn,
                  pairingStatus === 'connecting' && styles.primaryConnectBtnConnecting,
                ]}
                onPress={handleManualConnect}
                disabled={pairingStatus === 'connecting'}
                activeOpacity={0.85}
              >
                {pairingStatus === 'connecting' ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <>
                    <Ionicons name="link" size={18} color="#000000" style={{ marginRight: 8 }} />
                    <Text style={styles.primaryConnectBtnText}>ESTABLISH LINK</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Paste QR / Tunnel payload card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <Ionicons name="clipboard-outline" size={18} color={CYAN} />
                <Text style={styles.cardHeaderTitle}>PASTE QR CODE / TUNNEL URL</Text>
              </View>
              <Text style={styles.cardHeaderSub}>
                Paste JSON data or Cloudflare URL from desktop hub.
              </Text>

              <TextInput
                style={[styles.input, { height: 70 }]}
                placeholder='e.g. {"ip":"192.168.0.105","port":7447} or trycloudflare.com'
                placeholderTextColor={TEXT_MUTED}
                value={pastePayload}
                onChangeText={setPastePayload}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={[styles.primaryConnectBtn, !pastePayload.trim() && { opacity: 0.5 }]}
                onPress={handleConnectPasted}
                disabled={!pastePayload.trim() || pairingStatus === 'connecting'}
                activeOpacity={0.85}
              >
                <Ionicons name="checkmark-circle" size={18} color="#000000" style={{ marginRight: 8 }} />
                <Text style={styles.primaryConnectBtnText}>CONNECT WITH DATA</Text>
              </TouchableOpacity>
            </View>

            {/* Offline Bypass */}
            <TouchableOpacity
              style={styles.offlineBypassCard}
              onPress={handleContinueOffline}
              activeOpacity={0.85}
            >
              <View style={styles.offlineBypassLeft}>
                <View style={styles.offlineBypassIcon}>
                  <Ionicons name="cloud-offline" size={20} color="#000000" />
                </View>
                <View>
                  <Text style={styles.offlineBypassTitle}>USE OFFLINE LOCAL CACHE</Text>
                  <Text style={styles.offlineBypassSub}>Skip pairing and work offline</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#000000" />
            </TouchableOpacity>

            {pairingStatus === 'failed' && errorDetails && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={DANGER} style={{ marginTop: 2 }} />
                <Text style={styles.errorBoxText}>{errorDetails}</Text>
              </View>
            )}
          </ScrollView>
        </ScreenContainer>
      )}

      {/* ──────────────── TAB 3: VIEWFINDER (CRASH-FREE SAFE MODE) ──────────────── */}
      {activeTab === 'SCANNER' && (
        <View style={styles.scannerWrapper}>
          {!permission ? (
            <View style={styles.centerCard}>
              <ActivityIndicator size="large" color={CYAN} />
              <Text style={styles.loadingText}>Initializing camera...</Text>
            </View>
          ) : !permission.granted ? (
            <View style={styles.permissionCard}>
              <View style={styles.permIconCircle}>
                <Ionicons name="camera-outline" size={36} color={CYAN} />
              </View>
              <Text style={styles.permTitle}>Camera Permission Required</Text>
              <Text style={styles.permDesc}>
                Allow camera access to view the screen. Or use Instant Connect without camera.
              </Text>
              <TouchableOpacity
                style={styles.permButton}
                onPress={() => requestPermission()}
                activeOpacity={0.85}
              >
                <Text style={styles.permButtonText}>GRANT ACCESS</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraContainer}>
              <CameraView
                facing="back"
                enableTorch={torchOn}
                barcodeScannerSettings={barcodeSettings}
                onBarcodeScanned={handleBarcodeScanned}
                style={StyleSheet.absoluteFillObject}
              />

              {/* Viewfinder Overlays & Reticle */}
              <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
                <View style={styles.viewfinderCenter} pointerEvents="none">
                  <View style={styles.reticleFrame}>
                    <View style={[styles.corner, styles.cornerTL]} />
                    <View style={[styles.corner, styles.cornerTR]} />
                    <View style={[styles.corner, styles.cornerBL]} />
                    <View style={[styles.corner, styles.cornerBR]} />

                    <Animated.View
                      style={[
                        styles.scanline,
                        { transform: [{ translateY: scanlineTranslate }] },
                      ]}
                    />
                  </View>

                  <View style={styles.instructionBadge}>
                    <Text style={styles.instructionText}>
                      Point at PC QR Code or Tap Connect Below
                    </Text>
                  </View>
                </View>

                {/* HUD Overlay with 1-Tap Connect Card */}
                <SafeAreaView style={styles.viewfinderBottom} pointerEvents="box-none">
                  <View style={styles.viewfinderCard}>
                    <View style={styles.viewfinderCardTop}>
                      <Ionicons name="wifi" size={20} color={GREEN} />
                      <Text style={styles.viewfinderCardTitle}>
                        PC HUB: {discoveredHub?.ip || KNOWN_PC_IP}
                      </Text>
                    </View>
                    <Text style={styles.viewfinderCardSub}>
                      Desktop software is active on local Wi-Fi. Scan QR code or tap below.
                    </Text>

                    <TouchableOpacity
                      style={styles.primaryConnectBtn}
                      onPress={() => finalizeConnection(discoveredHub?.url || `ws://${KNOWN_PC_IP}:${KNOWN_PORT}`, 'local')}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="flash" size={18} color="#000000" style={{ marginRight: 8 }} />
                      <Text style={styles.primaryConnectBtnText}>⚡ 1-TAP CONNECT ({discoveredHub?.ip || KNOWN_PC_IP})</Text>
                    </TouchableOpacity>

                    {/* Quick IP Selectors */}
                    <View style={[styles.presetRow, { marginTop: 8 }]}>
                      <TouchableOpacity
                        style={[styles.presetBtn, { flex: 1, paddingVertical: 6 }]}
                        onPress={() => finalizeConnection(`ws://${KNOWN_PC_IP}:${KNOWN_PORT}`, 'local')}
                      >
                        <Text style={styles.presetBtnText}>PC .110</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.presetBtn, { flex: 1, paddingVertical: 6 }]}
                        onPress={() => finalizeConnection(`ws://${KNOWN_PC_IP_ALT}:${KNOWN_PORT}`, 'local')}
                      >
                        <Text style={styles.presetBtnText}>PC .105</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.presetBtn, { flex: 1, paddingVertical: 6 }]}
                        onPress={() => finalizeConnection(`ws://${KNOWN_PC_IP_ALT2}:${KNOWN_PORT}`, 'local')}
                      >
                        <Text style={styles.presetBtnText}>PC .103</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.viewfinderManualBtn}
                      onPress={() => setActiveTab('MANUAL')}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.viewfinderManualText}>ENTER IP MANUALLY</Text>
                    </TouchableOpacity>
                  </View>
                </SafeAreaView>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topSafeArea: {
    backgroundColor: 'rgba(8, 10, 14, 0.98)',
    zIndex: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 12,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: '600',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: GREEN,
  },
  liveText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 9,
  },
  segmentBtnActive: {
    backgroundColor: CYAN,
  },
  segmentText: {
    color: TEXT_MUTED,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  segmentTextActive: {
    color: '#000000',
  },

  // Instant Connect Tab
  instantContainer: {
    flex: 1,
    backgroundColor: BG,
  },
  instantScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  radarCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
  },
  radarOuterCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.35)',
    backgroundColor: 'rgba(0, 229, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  radarInnerCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 4,
  },
  radarSubtitle: {
    color: TEXT_MUTED,
    fontSize: 12,
    textAlign: 'center',
  },
  foundHubCard: {
    backgroundColor: SURFACE,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    marginBottom: 16,
    elevation: 4,
  },
  foundHubTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  foundHubIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: CYAN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foundHubTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  foundHubEndpoint: {
    color: TEXT_MUTED,
    fontSize: 11,
    marginTop: 2,
  },
  latencyBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  latencyText: {
    color: GREEN,
    fontSize: 10,
    fontWeight: '900',
  },
  countdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  countdownText: {
    color: CYAN,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  cancelCountdownBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cancelCountdownText: {
    color: TEXT_MUTED,
    fontSize: 11,
    fontWeight: '800',
  },
  primaryConnectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CYAN,
    borderRadius: 14,
    paddingVertical: 16,
    elevation: 3,
  },
  primaryConnectBtnConnecting: {
    backgroundColor: '#0284C7',
  },
  primaryConnectBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  directHubCard: {
    backgroundColor: SURFACE,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  directHubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  directHubTitle: {
    color: CYAN,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  directHubSub: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 18,
  },
  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  rescanBtnText: {
    color: CYAN,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  offlineBypassCard: {
    backgroundColor: GOLD,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    elevation: 3,
  },
  offlineBypassLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  offlineBypassIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineBypassTitle: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  offlineBypassSub: {
    color: 'rgba(0, 0, 0, 0.75)',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  errorBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },
  errorBoxText: {
    color: '#FCA5A5',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },

  // Manual Tab
  manualContainer: {
    flex: 1,
    backgroundColor: BG,
  },
  manualScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardHeaderTitle: {
    color: CYAN,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  cardHeaderSub: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginBottom: 16,
    lineHeight: 18,
  },
  inputLabel: {
    color: TEXT_MUTED,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: SURFACE_HOVER,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    color: TEXT_MAIN,
    fontSize: 15,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  presetBtn: {
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.25)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  presetBtnText: {
    color: CYAN,
    fontSize: 11,
    fontWeight: '700',
  },

  // Viewfinder / Scanner Safe Tab
  scannerWrapper: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraContainer: {
    flex: 1,
  },
  centerCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
  },
  loadingText: {
    color: TEXT_MUTED,
    marginTop: 12,
    fontSize: 13,
  },
  permissionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: BG,
  },
  permIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  permTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 10,
  },
  permDesc: {
    color: TEXT_MUTED,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permButton: {
    backgroundColor: CYAN,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  permButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  viewfinderCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reticleFrame: {
    width: 250,
    height: 250,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: CYAN,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  scanline: {
    width: '90%',
    height: 2,
    backgroundColor: CYAN,
    shadowColor: CYAN,
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  instructionBadge: {
    marginTop: 20,
    backgroundColor: 'rgba(8, 10, 14, 0.85)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  viewfinderBottom: {
    justifyContent: 'flex-end',
    padding: 20,
  },
  viewfinderCard: {
    backgroundColor: 'rgba(15, 19, 29, 0.95)',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  viewfinderCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  viewfinderCardTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  viewfinderCardSub: {
    color: TEXT_MUTED,
    fontSize: 11,
    marginBottom: 14,
    lineHeight: 16,
  },
  viewfinderManualBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginTop: 4,
  },
  viewfinderManualText: {
    color: TEXT_MUTED,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
