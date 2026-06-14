import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { ScanLine, FileText, ChevronRight, Info, Plus } from 'lucide-react-native';
import { getSafeStorage } from '../../../src/utils/storage';
import { formatDistanceToNow } from 'date-fns';
import { Image } from 'expo-image';

interface RecentScan {
  id: string;
  timestamp: number;
  uri: string;
}

export default function LensHub() {
  const router = useRouter();
  const { connectionState } = useBridgeStatus();
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentScans();
  }, []);

  const loadRecentScans = async () => {
    try {
      const rawStored = await getSafeStorage('lens_recent_scans');
      const stored = rawStored ? JSON.parse(rawStored) : null;
      if (stored) {
        setRecentScans(stored);
      }
    } catch (e) {
      console.error('Failed to load recent scans', e);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (connectionState === 'connected') return THEME.colorStatus.online;
    if (connectionState === 'reconnecting') return THEME.colorStatus.degraded;
    return THEME.colorStatus.offline;
  };

  const renderRecentScan = ({ item }: { item: RecentScan }) => (
    <View style={styles.scanItem}>
      <Image source={{ uri: item.uri }} style={styles.scanThumbnail} />
      <View style={styles.scanInfo}>
        <Text style={styles.scanTitle}>Document Scan</Text>
        <Text style={styles.scanTime}>
          Sent {formatDistanceToNow(item.timestamp, { addSuffix: true })}
        </Text>
      </View>
      <ChevronRight size={16} color={THEME.colors.textMuted} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Noxis Lens</Text>
        <Text style={styles.subtitle}>DOCUMENT_INTELLIGENCE_NODE</Text>
      </View>

      <View style={[styles.statusCard, { borderColor: getStatusColor() }]}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {connectionState === 'connected' ? 'HUB_READY_TO_RECEIVE' : 'CONNECT_TO_HUB_FIRST'}
        </Text>
      </View>

      <TouchableOpacity 
        style={styles.scanButton}
        onPress={() => router.push('/(app)/lens/scan')}
        activeOpacity={0.8}
      >
        <View style={styles.scanIconBg}>
          <ScanLine size={32} color={THEME.colors.blue} />
        </View>
        <Text style={styles.scanButtonText}>Scan Document</Text>
        <Text style={styles.scanButtonSub}>AI-POWERED EDGE DETECTION</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>RECENT_SCANS</Text>
        {loading ? (
          <ActivityIndicator color={THEME.colors.blue} style={{ marginTop: 20 }} />
        ) : recentScans.length > 0 ? (
          <FlatList
            data={recentScans}
            renderItem={renderRecentScan}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <FileText size={40} color={THEME.colors.border} />
            <Text style={styles.emptyText}>NO_RECENT_SCANS</Text>
          </View>
        )}
      </View>

      <View style={styles.instructions}>
        <View style={styles.instructionRow}>
          <Info size={14} color={THEME.colors.blue} />
          <Text style={styles.instructionText}>Point camera at document</Text>
        </View>
        <View style={styles.instructionRow}>
          <Info size={14} color={THEME.colors.blue} />
          <Text style={styles.instructionText}>Hold steady when border turns green</Text>
        </View>
        <View style={styles.instructionRow}>
          <Info size={14} color={THEME.colors.blue} />
          <Text style={styles.instructionText}>Document appears on Hub automatically</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
    padding: THEME.spacing.md,
    paddingTop: 60,
  },
  header: {
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: THEME.colors.textPrimary,
    fontSize: 24,
    letterSpacing: 2,
  },
  subtitle: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.blue,
    fontSize: 10,
    letterSpacing: 1,
    opacity: 0.8,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.sm,
    borderRadius: THEME.radius.sm,
    borderWidth: 1,
    marginBottom: THEME.spacing.xl,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: THEME.spacing.sm,
  },
  statusText: {
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  scanButton: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    shadowColor: THEME.colors.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  scanIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  scanButtonText: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: THEME.colors.textPrimary,
    fontSize: 18,
    marginBottom: 4,
  },
  scanButtonSub: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textMuted,
    fontSize: 10,
    letterSpacing: 1,
  },
  section: {
    marginTop: THEME.spacing.xl,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: THEME.spacing.md,
  },
  scanItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.sm,
    borderRadius: THEME.radius.md,
    marginBottom: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  scanThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 4,
    backgroundColor: THEME.colors.bg,
    marginRight: THEME.spacing.md,
  },
  scanInfo: {
    flex: 1,
  },
  scanTitle: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textPrimary,
    fontSize: 12,
  },
  scanTime: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textMuted,
    fontSize: 10,
  },
  instructions: {
    marginTop: THEME.spacing.lg,
    padding: THEME.spacing.md,
    backgroundColor: 'rgba(96, 165, 250, 0.05)',
    borderRadius: THEME.radius.md,
    gap: 8,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  instructionText: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
});
