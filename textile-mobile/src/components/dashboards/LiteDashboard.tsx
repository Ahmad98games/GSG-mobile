import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { THEME, COMMON_STYLES } from '../../constants/DesignSystem';
import { TrendingUp, DollarSign, Package, AlertCircle, Lock, ChevronRight } from 'lucide-react-native';

export const LiteDashboard = () => {
  return (
    <ScrollView style={COMMON_STYLES.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>PROTOCOL: LITE</Text>
          <Text style={styles.title}>Financial Overview</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>STABLE</Text>
        </View>
      </View>

      {/* Financial Metrics */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { flex: 1 }]}>
          <DollarSign color={THEME.colors.status.success} size={20} />
          <Text style={styles.statValue}>$42.5k</Text>
          <Text style={styles.statLabel}>DAILY REVENUE</Text>
        </View>
        <View style={[styles.statCard, { flex: 1 }]}>
          <TrendingUp color={THEME.colors.blue} size={20} />
          <Text style={styles.statValue}>+12.4%</Text>
          <Text style={styles.statLabel}>EFFICIENCY</Text>
        </View>
      </View>

      {/* Main Stats Card */}
      <View style={COMMON_STYLES.card}>
        <Text style={styles.sectionTitle}>PRODUCTION METRICS</Text>
        <View style={styles.metricRow}>
          <Package color={THEME.colors.slate} size={18} />
          <Text style={styles.metricName}>Total Units Produced</Text>
          <Text style={styles.metricValue}>1,280</Text>
        </View>
        <View style={styles.metricRow}>
          <AlertCircle color={THEME.colors.status.warning} size={18} />
          <Text style={styles.metricName}>Pending Audits</Text>
          <Text style={styles.metricValue}>5</Text>
        </View>
      </View>

      {/* Locked AI Features Section */}
      <View style={styles.lockedSection}>
        <View style={styles.lockedHeader}>
          <Lock color={THEME.colors.muted} size={16} />
          <Text style={styles.lockedTitle}>AI VISION ENGINE</Text>
        </View>
        
        <View style={styles.lockedFeatures}>
          <View style={styles.lockedFeature}>
            <View style={styles.lockOverlay}>
               <Lock color="#fff" size={12} />
            </View>
            <Text style={styles.lockedFeatureText}>Real-time Anomaly Detection</Text>
          </View>
          <View style={styles.lockedFeature}>
            <View style={styles.lockOverlay}>
               <Lock color="#fff" size={12} />
            </View>
            <Text style={styles.lockedFeatureText}>Predictive Maintenance</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.upgradeBtn} activeOpacity={0.8}>
          <Text style={styles.upgradeBtnText}>Upgrade to ELITE for Real-time Vision</Text>
          <ChevronRight color="#000" size={16} />
        </TouchableOpacity>
      </View>

      {/* Recent Transactions */}
      <Text style={styles.sectionHeader}>RECENT LEDGER</Text>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.ledgerItem}>
          <View style={styles.ledgerInfo}>
            <Text style={styles.ledgerId}>TRX-990{i}</Text>
            <Text style={styles.ledgerDate}>29 APR 2026</Text>
          </View>
          <Text style={styles.ledgerAmount}>+$1,200.00</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: THEME.spacing.lg,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.xl,
  },
  welcomeText: {
    color: THEME.colors.blue,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 2,
  },
  title: {
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.interBold,
    fontSize: 24,
    marginTop: 4,
  },
  badge: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  badgeText: {
    color: THEME.colors.status.success,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 9,
  },
  statsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  statCard: {
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  statValue: {
    color: THEME.colors.text.primary,
    fontSize: 20,
    fontFamily: THEME.fonts.monoBold,
    marginTop: 8,
  },
  statLabel: {
    color: THEME.colors.text.muted,
    fontSize: 8,
    fontFamily: THEME.fonts.monoBold,
    marginTop: 4,
    letterSpacing: 1,
  },
  sectionTitle: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: THEME.spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  metricName: {
    flex: 1,
    color: THEME.colors.text.secondary,
    fontFamily: THEME.fonts.inter,
    fontSize: 14,
    marginLeft: 12,
  },
  metricValue: {
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 14,
  },
  lockedSection: {
    marginTop: THEME.spacing.xl,
    backgroundColor: 'rgba(45, 52, 65, 0.3)',
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderStyle: 'dashed',
  },
  lockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: THEME.spacing.md,
  },
  lockedTitle: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 2,
  },
  lockedFeatures: {
    gap: 12,
    marginBottom: THEME.spacing.lg,
  },
  lockedFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    opacity: 0.5,
  },
  lockOverlay: {
    width: 24,
    height: 24,
    backgroundColor: THEME.colors.surfaceLighter,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedFeatureText: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.inter,
    fontSize: 13,
  },
  upgradeBtn: {
    backgroundColor: THEME.colors.gold,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: THEME.borderRadius.md,
  },
  upgradeBtnText: {
    color: '#000',
    fontFamily: THEME.fonts.interBold,
    fontSize: 12,
  },
  sectionHeader: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: THEME.spacing.xl,
    marginBottom: THEME.spacing.md,
  },
  ledgerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  ledgerInfo: {
    flexDirection: 'column',
  },
  ledgerId: {
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.mono,
    fontSize: 13,
  },
  ledgerDate: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.inter,
    fontSize: 10,
    marginTop: 2,
  },
  ledgerAmount: {
    color: THEME.colors.status.success,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 14,
  }
});
