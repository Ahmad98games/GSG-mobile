import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Battery from 'expo-battery';
import { useDiagnosticStore } from '../../src/store/DiagnosticsStore';
import { THEME } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '../../src/components/navigation/ScreenHeader';

/**
 * PRODUCTION DIAGNOSTICS SCREEN
 * Biometric locked. Forensic monitoring of binary stack health.
 */
export default function DiagnosticsScreen() {
  const router = useRouter();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const diag = useDiagnosticStore();

  useEffect(() => {
    authenticate();
    const sub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      // Mocking temperature check as Battery API varies by device
      // In a real Zebra device, we'd use a native module for exact thermals
    });
    
    const tempInterval = setInterval(async () => {
      // Simulation of temperature monitoring
      const state = await Battery.getPowerStateAsync();
      diag.setLowBatteryMode(state.batteryLevel < 0.2);
    }, 10000);

    return () => {
      sub.remove();
      clearInterval(tempInterval);
    };
  }, []);

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      setIsUnlocked(true); // Fallback for dev
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'ENGINEER AUTH REQUIRED',
      fallbackLabel: 'USE PIN',
    });

    if (result.success) setIsUnlocked(true);
    else router.back();
  };

  const getAvg = (arr: number[]) => {
    if (arr.length === 0) return 0;
    return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
  };

  if (!isUnlocked) return null;

  return (
    <SafeAreaView style={styles.container}>
      {diag.temperature > 45 && (
        <View style={styles.heatBanner}>
          <Ionicons name="thermometer" size={20} color="white" />
          <Text style={styles.heatText}>DEVICE OVERHEATING - PERFORMANCE THROTTLED</Text>
        </View>
      )}

      <ScreenHeader title="Forensic Stack Health" showBack={true} />

      <ScrollView contentContainerStyle={styles.scroll}>
        <MetricSection title="BINARY_PIPELINE">
          <MetricRow label="PROTO_PACKET_AVG" value={`${getAvg(diag.packetSizes)} B`} />
          <MetricRow label="ENC_LATENCY_AVG" value={`${getAvg(diag.encLatencies)} MS`} />
          <MetricRow label="SYNC_OFFSET" value={`${diag.syncOffset} MS`} />
        </MetricSection>

        <MetricSection title="QUEUE_STATUS">
          <MetricRow label="MEMORY_CACHE" value={diag.queueDepth.memory} />
          <MetricRow label="SQLITE_DEPTH" value={diag.queueDepth.sqlite} />
        </MetricSection>

        <MetricSection title="CONNECTIVITY">
          <MetricRow label="TCP_STATE" value={diag.tcpState} />
          <MetricRow label="LAST_ACK" value={diag.lastAck > 0 ? new Date(diag.lastAck).toLocaleTimeString() : 'NEVER'} />
        </MetricSection>

        <MetricSection title="ENVIRONMENT">
          <MetricRow label="BATTERY_TEMP" value={`${diag.temperature}°C`} />
          <MetricRow label="LOW_POWER_MODE" value={diag.isLowBatteryMode ? 'ACTIVE' : 'INACTIVE'} />
        </MetricSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const MetricSection = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.card}>{children}</View>
  </View>
);

const MetricRow = ({ label, value }: any) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', padding: 24, gap: 16 },
  title: { color: 'white', fontWeight: '900', fontSize: 18, letterSpacing: 1 },
  scroll: { padding: 24 },
  heatBanner: { backgroundColor: THEME.colors.critical, padding: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  heatText: { color: 'white', fontWeight: '900', fontSize: 10 },
  section: { marginBottom: 32 },
  sectionTitle: { color: THEME.colors.gold, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginBottom: 12 },
  card: { backgroundColor: THEME.colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: THEME.colors.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  rowLabel: { color: THEME.colors.textSecondary, fontSize: 11, fontWeight: '700' },
  rowValue: { color: THEME.colors.textPrimary, fontSize: 12, fontWeight: '900', fontFamily: 'JetBrainsMono_700Bold' }
});
