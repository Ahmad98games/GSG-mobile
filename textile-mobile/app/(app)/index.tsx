import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { THEME } from '../../src/constants/theme';
import { useBridgeStatus } from '../../src/store/BridgeStatusStore';
import { useAuthStore } from '../../src/store/AuthStore';
import { useVisionStore } from '../../src/store/VisionStore';
import { Activity, Shield, Wifi, HardDrive, Cpu, Download, Database, Server } from 'lucide-react-native';
import { Image } from 'expo-image';

export default function HealthScreen() {
  const { connectionState, signalQuality, rollingRtt } = useBridgeStatus();
  const { companyBranding, companyName, nodeTier } = useAuthStore();
  const { nodes, fetchTelemetry, subscribeToTelemetry } = useVisionStore();
  
  const isElite = nodeTier === 'ELITE';
  const avgRtt = rollingRtt.length > 0 
    ? Math.round(rollingRtt.reduce((a, b) => a + b, 0) / rollingRtt.length) 
    : 0;

  React.useEffect(() => {
    fetchTelemetry();
    const unsubscribe = subscribeToTelemetry();
    return () => unsubscribe();
  }, []);

  const getStatusColor = () => {
    if (connectionState === 'connected') return THEME.colorStatus.online;
    if (connectionState === 'reconnecting') return THEME.colorStatus.degraded;
    return THEME.colorStatus.offline;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ 
        title: 'System Health', 
        headerStyle: { backgroundColor: THEME.colors.bg }, 
        headerTintColor: 'white',
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 12 }
      }} />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{companyName.toUpperCase()}</Text>
          <Text style={styles.subtitle}>SENTINEL_NODE_CENTER</Text>
          {companyBranding.logoUrl && (
            <Image 
              source={{ uri: companyBranding.logoUrl }} 
              style={styles.companyLogo}
              contentFit="contain"
            />
          )}
        </View>
        <View style={[styles.statusBadge, { borderColor: getStatusColor() }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {connectionState.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.grid}>
        {/* MESH STATUS CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Wifi size={16} color={THEME.colors.blue} />
            <Text style={styles.cardTitle}>MESH_SYNAPSE</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>SIGNAL_STRENGTH</Text>
            <Text style={[styles.statValue, { color: getStatusColor() }]}>
              {signalQuality.toUpperCase()}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>LATENCY_RTT</Text>
            <Text style={styles.statValue}>{avgRtt}ms</Text>
          </View>
        </View>

        {/* SECURITY CARD */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Shield size={16} color={THEME.colors.gold} />
            <Text style={styles.cardTitle}>CORE_SECURITY</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>ENCRYPTION</Text>
            <Text style={[styles.statValue, { color: THEME.colorStatus.online }]}>AES-256</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>FIREWALL</Text>
            <Text style={styles.statValue}>ACTIVE</Text>
          </View>
        </View>
      </View>

      {/* NODE TELEMETRY GRID */}
      <Text style={styles.sectionTitle}>ACTIVE_MESH_NODES ({nodes.length})</Text>
      <View style={styles.grid}>
        {nodes.map((node) => (
          <View key={node.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Server size={14} color={node.status === 'CRITICAL' ? THEME.colors.critical : THEME.colors.blue} />
              <Text style={styles.cardTitle}>{node.node_id.toUpperCase()}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>MODEL</Text>
              <Text style={styles.statValue}>{node.camera_model}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>BITRATE</Text>
              <Text style={styles.statValue}>{node.bitrate_mbps.toFixed(1)} Mb/s</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>LATENCY</Text>
              <Text style={styles.statValue}>{node.latency_ms}ms</Text>
            </View>
            <View style={[styles.statusMini, { backgroundColor: node.status === 'CRITICAL' ? THEME.colors.critical : THEME.colorStatus.online }]} />
          </View>
        ))}
        
        {nodes.length === 0 && (
          <View style={styles.emptyCard}>
            <Database size={24} color={THEME.colors.border} />
            <Text style={styles.emptyText}>NO_ACTIVE_NODES_FOUND</Text>
          </View>
        )}
      </View>

      {/* ELITE APK SECTION */}
      {isElite && (
        <TouchableOpacity style={styles.eliteDownloadBtn}>
          <View style={styles.eliteDownloadInfo}>
            <Download size={20} color={THEME.colors.gold} />
            <View>
              <Text style={styles.eliteDownloadTitle}>DOWNLOAD_ELITE_v12_APK</Text>
              <Text style={styles.eliteDownloadSub}>SECURE_DIRECT_BUILD_ACCESS</Text>
            </View>
          </View>
          <Shield size={16} color={THEME.colors.gold} />
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.rebootBtn} onPress={fetchTelemetry}>
        <Activity size={18} color="white" />
        <Text style={styles.rebootText}>FORCE_TELEMETRY_SYNC</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  content: {
    padding: THEME.spacing.md,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: THEME.colors.textPrimary,
    fontSize: 18,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.blue,
    fontSize: 10,
    letterSpacing: 1,
  },
  sectionTitle: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1,
    marginTop: THEME.spacing.md,
    marginBottom: THEME.spacing.sm,
  },
  statusMini: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  emptyCard: {
    width: '100%',
    backgroundColor: THEME.colors.surface,
    padding: 40,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  eliteDownloadBtn: {
    marginTop: THEME.spacing.lg,
    backgroundColor: 'rgba(197, 160, 89, 0.05)',
    borderWidth: 1,
    borderColor: THEME.colors.gold,
    borderRadius: THEME.radius.md,
    padding: THEME.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eliteDownloadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  eliteDownloadTitle: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: THEME.colors.gold,
    fontSize: 12,
  },
  eliteDownloadSub: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.gold,
    fontSize: 8,
    opacity: 0.7,
  },
  companyLogo: {
    width: 120,
    height: 30,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: THEME.colors.surface,
    width: '48%',
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: THEME.spacing.md,
  },
  fullWidth: {
    width: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    gap: 8,
  },
  cardTitle: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textSecondary,
    fontSize: 9,
  },
  statValue: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textPrimary,
    fontSize: 10,
  },
  telemetryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  telemetryItem: {
    alignItems: 'center',
  },
  telLabel: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textSecondary,
    fontSize: 8,
    marginBottom: 2,
  },
  telValue: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.blue,
    fontSize: 12,
  },
  rebootBtn: {
    backgroundColor: THEME.colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    marginTop: THEME.spacing.lg,
    gap: 12,
  },
  rebootText: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: 'white',
    fontSize: 12,
    letterSpacing: 1,
  }
});
