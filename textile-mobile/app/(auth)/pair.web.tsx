/**
 * NOXIS WEB COMPANION — pair.web.tsx
 * Web-specific pairing screen (Expo Router auto-selects this on web).
 * Replaces the native QR scanner with a full connection guide + IP input.
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Animated, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/AuthStore';
import { Ionicons } from '@expo/vector-icons';

const GOLD = '#C6A756';
const BLUE = '#60A5FA';
const BG = '#060708';
const SURFACE = '#0F1114';
const BORDER = '#1E2330';
const TEXT = '#FFFFFF';
const MUTED = '#6B7280';
const GREEN = '#10B981';

const STEPS = [
  {
    icon: 'desktop-outline' as const,
    title: 'OPEN HUB ON PC',
    desc: 'Launch the Noxis Hub application on your factory PC (Windows/Linux). It auto-starts on boot if configured.',
  },
  {
    icon: 'wifi-outline' as const,
    title: 'SAME NETWORK',
    desc: 'Ensure your phone and Hub PC are on the same Wi-Fi or LAN network. Mobile data will NOT work.',
  },
  {
    icon: 'information-circle-outline' as const,
    title: 'FIND THE IP',
    desc: 'In the Hub window, look for "Node Address" or run ipconfig (Windows) / ip addr (Linux). Use the local IP shown (e.g. 192.168.1.x).',
  },
  {
    icon: 'link-outline' as const,
    title: 'ENTER IP BELOW',
    desc: 'Type the Hub IP address in the field below and tap ESTABLISH CONNECTION.',
  },
];

const FEATURES = [
  { icon: 'scan-outline' as const, label: 'Barcode Scanner', desc: 'Scan inventory & dispatch' },
  { icon: 'people-outline' as const, label: 'Mesh Network', desc: 'Peer-to-peer node comms' },
  { icon: 'bar-chart-outline' as const, label: 'Production', desc: 'Live job tracking' },
  { icon: 'chatbubbles-outline' as const, label: 'Messaging', desc: 'Tactical comms' },
  { icon: 'alert-circle-outline' as const, label: 'Breach Alerts', desc: 'Real-time security' },
  { icon: 'analytics-outline' as const, label: 'Analytics', desc: 'Executive dashboard' },
];

export default function WebPairScreen() {
  const router = useRouter();
  const { setCredentials } = useAuthStore();

  const [ip, setIp] = useState('');
  const [port, setPort] = useState('3000');
  const [status, setStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Pulsing animation for the connect button
  const pulse = useRef(new Animated.Value(1)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.04, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const handleConnect = async () => {
    const trimmedIp = ip.trim();
    const portNum = parseInt(port.trim(), 10);

    if (!trimmedIp) {
      setStatus('error');
      setErrorMsg('Enter the Hub IP address.');
      return;
    }
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(trimmedIp)) {
      setStatus('error');
      setErrorMsg('Invalid IP format. Example: 192.168.1.100');
      return;
    }

    setStatus('connecting');
    setErrorMsg('');

    // Try a lightweight ping to the Hub WebSocket bridge
    try {
      const ws = new WebSocket(`ws://${trimmedIp}:${portNum}/mobile-bridge`);
      const timeout = setTimeout(() => {
        ws.close();
        setStatus('error');
        setErrorMsg(`Could not reach Hub at ${trimmedIp}:${portNum}. Check IP and ensure Hub is running.`);
      }, 6000);

      ws.onopen = () => {
        clearTimeout(timeout);
        ws.close();
        // Store credentials — this sets isAuthenticated: true in the store
        setCredentials(trimmedIp, portNum, `WEB_${Date.now()}`, 'LITE', 'MANAGER_ROVING');
        setStatus('success');
        setTimeout(() => router.replace('/(app)/dashboard'), 1200);
      };

      ws.onerror = () => {
        clearTimeout(timeout);
        setStatus('error');
        setErrorMsg(`Could not reach Hub at ${trimmedIp}:${portNum}.\n\nCheck:\n• Hub is running\n• Same Wi-Fi network\n• Port ${portNum} is not blocked by firewall`);
      };
    } catch (e) {
      setStatus('error');
      setErrorMsg('WebSocket connection failed. Ensure you are on the same network as the Hub.');
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Animated.View style={{ opacity: fadeIn }}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.brand}>OMNORA</Text>
          <Text style={styles.title}>NOXIS HUB</Text>
          <Text style={styles.subtitle}>Mobile Command Center</Text>


        </View>

        {/* ── FEATURE GRID ── */}
        <View style={styles.featureGrid}>
          {FEATURES.map((f) => (
            <View key={f.label} style={styles.featureCard}>
              <Ionicons name={f.icon} size={24} color={GOLD} />
              <Text style={styles.featureLabel}>{f.label}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* ── DIVIDER ── */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>CONNECT TO HUB</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── CONNECTION STEPS ── */}
        <View style={styles.stepsContainer}>
          {STEPS.map((step, i) => (
            <View key={i} style={styles.step}>
              <View style={styles.stepIconWrap}>
                <Ionicons name={step.icon} size={22} color={GOLD} />
                {i < STEPS.length - 1 && <View style={styles.stepConnector} />}
              </View>
              <View style={styles.stepContent}>
                <View style={styles.stepHeader}>
                  <View style={styles.stepNumBadge}>
                    <Text style={styles.stepNum}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── IP INPUT ── */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>HUB IP ADDRESS</Text>
          <TextInput
            style={[styles.input, status === 'error' && styles.inputError]}
            placeholder="e.g. 192.168.1.100"
            placeholderTextColor={MUTED}
            value={ip}
            onChangeText={(t) => { setIp(t); setStatus('idle'); }}
            keyboardType="decimal-pad"
            autoCapitalize="none"
            autoCorrect={false}
            
          />

          <Text style={[styles.inputLabel, { marginTop: 12 }]}>HUB PORT (default: 3000)</Text>
          <TextInput
            style={styles.input}
            placeholder="3000"
            placeholderTextColor={MUTED}
            value={port}
            onChangeText={(t) => setPort(t)}
            keyboardType="number-pad"
          />

          {status === 'error' && (
            <View style={styles.errorBox}>
              <Ionicons name="warning-outline" size={16} color="#EF4444" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          {status === 'success' && (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle-outline" size={16} color={GREEN} />
              <Text style={styles.successText}>Connected! Loading dashboard...</Text>
            </View>
          )}

          <Animated.View style={{ transform: [{ scale: pulse }] }}>
            <TouchableOpacity
              style={[
                styles.connectBtn,
                status === 'connecting' && styles.connectBtnConnecting,
                status === 'success' && styles.connectBtnSuccess,
              ]}
              onPress={handleConnect}
              disabled={status === 'connecting' || status === 'success'}
              activeOpacity={0.85}
            >
              <Ionicons
                name={status === 'connecting' ? 'refresh-outline' : status === 'success' ? 'checkmark-done-outline' : 'link-outline'}
                size={20}
                color="white"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.connectBtnText}>
                {status === 'connecting' ? 'CONNECTING...' : status === 'success' ? 'CONNECTED' : 'ESTABLISH CONNECTION'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ── HELP BOX ── */}
        <View style={styles.helpBox}>
          <Ionicons name="help-circle-outline" size={18} color={BLUE} style={{ marginBottom: 8 }} />
          <Text style={styles.helpTitle}>TROUBLESHOOTING</Text>
          <Text style={styles.helpText}>• Hub not found? Make sure it's running on your PC (look for the Noxis Hub icon in the system tray)</Text>
          <Text style={styles.helpText}>• Wrong IP? On Windows: open Command Prompt → type <Text style={styles.code}>ipconfig</Text> → use "IPv4 Address"</Text>
          <Text style={styles.helpText}>• Firewall? Allow port {port} in Windows Defender Firewall for the Hub app</Text>
          <Text style={styles.helpText}>• Still stuck? Connect both devices to the same Wi-Fi router, not mobile hotspot</Text>

        </View>

        <Text style={styles.footer}>
          SECURE HANDSHAKE: AES-256-GCM + P-256{'\n'}
          NOXIS HUB v13.1
        </Text>


      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  container: { padding: 24, paddingBottom: 60 },

  // Header
  header: { alignItems: 'center', paddingTop: 40, paddingBottom: 32 },
  brand: { color: GOLD, fontSize: 11, letterSpacing: 4, fontWeight: '700', marginBottom: 8 },
  title: { color: TEXT, fontSize: 36, fontWeight: '900', letterSpacing: -1, textAlign: 'center' },
  subtitle: { color: MUTED, fontSize: 13, marginTop: 8, letterSpacing: 1, textAlign: 'center' },

  // Feature grid
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
  featureCard: {
    width: '30%', flex: 1, minWidth: 100,
    backgroundColor: SURFACE, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: BORDER, alignItems: 'center', gap: 6,
  },
  featureLabel: { color: TEXT, fontSize: 11, fontWeight: '700', textAlign: 'center', letterSpacing: 0.5 },
  featureDesc: { color: MUTED, fontSize: 10, textAlign: 'center' },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerText: { color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 3, marginHorizontal: 14 },

  // Steps
  stepsContainer: { marginBottom: 32 },
  step: { flexDirection: 'row', marginBottom: 24 },
  stepIconWrap: { alignItems: 'center', marginRight: 16, width: 40 },
  stepConnector: { flex: 1, width: 1, backgroundColor: BORDER, marginTop: 8 },
  stepContent: { flex: 1 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  stepNumBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: GOLD, justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  stepNum: { color: BG, fontSize: 11, fontWeight: '900' },
  stepTitle: { color: TEXT, fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  stepDesc: { color: MUTED, fontSize: 13, lineHeight: 20 },

  // Input
  inputSection: { marginBottom: 32 },
  inputLabel: { color: MUTED, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 8 },
  input: {
    backgroundColor: SURFACE, borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 14, color: TEXT, fontSize: 16, fontWeight: '600',
    borderWidth: 1, borderColor: BORDER, marginBottom: 4,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },
  inputError: { borderColor: '#EF4444' },

  // Error / success
  errorBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)', marginTop: 8, marginBottom: 12,
  },
  errorText: { color: '#EF4444', fontSize: 13, flex: 1, lineHeight: 18 },
  successBox: {
    flexDirection: 'row', gap: 8, alignItems: 'center',
    backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)', marginTop: 8, marginBottom: 12,
  },
  successText: { color: GREEN, fontSize: 13, fontWeight: '600' },

  // Connect button
  connectBtn: {
    backgroundColor: GOLD, borderRadius: 14, padding: 18,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    marginTop: 16,
    shadowColor: GOLD, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12,
  },
  connectBtnConnecting: { backgroundColor: BLUE },
  connectBtnSuccess: { backgroundColor: GREEN },
  connectBtnText: { color: BG, fontSize: 15, fontWeight: '900', letterSpacing: 2 },

  // Help
  helpBox: {
    backgroundColor: 'rgba(96,165,250,0.05)', borderRadius: 14, padding: 20,
    borderWidth: 1, borderColor: 'rgba(96,165,250,0.15)', marginBottom: 32,
  },
  helpTitle: { color: BLUE, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },
  helpText: { color: MUTED, fontSize: 13, lineHeight: 22, marginBottom: 4 },
  code: { color: GOLD, fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier' },

  // Footer
  footer: { color: MUTED, fontSize: 10, textAlign: 'center', letterSpacing: 1.5, lineHeight: 18 },
});
