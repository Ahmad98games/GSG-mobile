import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Check, Minus, ChevronRight, CreditCard, ShieldCheck, Zap, Crown } from 'lucide-react-native';
import { THEME } from '../../../src/constants/DesignSystem';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import type { TierFeatures } from '../../../src/store/BridgeStatusStore';
import { usePersona } from '../../../src/hooks/usePersona';
import { useAuthStore } from '../../../src/store/AuthStore';
import { DeviceCounterCard } from '../../../src/components/tier/DeviceCounterCard';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';

/**
 * PLAN DETAILS SCREEN
 * Industrial-grade transparency regarding system capabilities and licensing.
 */
export default function PlanScreen() {
  const router = useRouter();
  const { t } = usePersona();
  const nodeTier = useAuthStore(s => s.nodeTier);
  const companyName = useAuthStore(s => s.companyName);
  
  const tierLimit = useBridgeStatus(s => s.tierLimit);
  const tierFeatures = useBridgeStatus(s => s.tierFeatures);
  const connectedNodeCount = useBridgeStatus(s => s.connectedNodeCount);
  const maxNodeCount = useBridgeStatus(s => s.maxNodeCount);
  const portalUpgradeUrl = useBridgeStatus(s => s.portalUpgradeUrl);

  const isElite = tierLimit === 'elite';
  const isPro = tierLimit === 'pro';
  const isLite = tierLimit === 'lite' || !tierLimit;

  const features: Array<{ key: keyof TierFeatures; label: string }> = [
    { key: 'voiceMessages', label: 'Voice Messenger' },
    { key: 'aiDetection', label: 'CCTV AI Detection' },
    { key: 'guardianAuth', label: 'Guardian Biometrics' },
    { key: 'multiLocation', label: 'Multi-Branch Support' },
    { key: 'systemLock', label: 'Global System Lock' },
    { key: 'whatsappReports', label: 'WhatsApp Automation' },
  ];

  const getTierIcon = () => {
    if (isElite) return <Crown color={THEME.colors.gold} size={24} />;
    if (isPro) return <Zap color={THEME.colors.blue} size={24} />;
    return <ShieldCheck color={THEME.colors.slate} size={24} />;
  };

  const getTierColor = () => {
    if (isElite) return THEME.colors.gold;
    if (isPro) return THEME.colors.blue;
    return THEME.colors.slate;
  };

  const nextTier = isLite ? 'PRO' : isPro ? 'ELITE' : null;
  const upgradeFeaturesCount = features.filter(f => !tierFeatures?.[f.key]).length;

  const handleUpgrade = () => {
    if (portalUpgradeUrl) {
      Linking.openURL(portalUpgradeUrl);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false, title: t('tier.plan_title'),
          headerStyle: { backgroundColor: THEME.colors.background },
          headerTintColor: '#fff',
          headerTitleStyle: { fontFamily: THEME.fonts.interBold }
        }} 
      />
      <ScreenHeader title="tier.plan_title" showBack={true} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* CURRENT PLAN CARD */}
        <View style={styles.planCard}>
          <View style={styles.tierHeader}>
            <View style={[styles.tierIconBox, { backgroundColor: getTierColor() + '20' }]}>
              {getTierIcon()}
            </View>
            <View>
              <Text style={styles.planLabel}>{t('tier.your_plan').toUpperCase()}</Text>
              <Text style={[styles.tierName, { color: getTierColor() }]}>
                {(tierLimit || 'LITE').toUpperCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.deviceLabel}>{t('tier.connected_devices').toUpperCase()}</Text>
          <View style={styles.deviceStats}>
            <Text style={styles.deviceCount}>
              {connectedNodeCount} <Text style={styles.deviceMax}>/ {maxNodeCount || '∞'}</Text>
            </Text>
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: maxNodeCount ? `${(connectedNodeCount / maxNodeCount) * 100}%` : '100%',
                    backgroundColor: getTierColor()
                  }
                ]} 
              />
            </View>
          </View>
        </View>

        {/* FEATURE MATRIX */}
        <Text style={styles.sectionTitle}>INDUSTRIAL CAPABILITIES</Text>
        <View style={styles.matrix}>
          {features.map((feature, idx) => {
            const hasFeature = tierFeatures?.[feature.key];
            return (
              <View key={feature.key} style={[styles.matrixRow, idx === features.length - 1 && { borderBottomWidth: 0 }]}>
                <Text style={styles.featureLabel}>{feature.label}</Text>
                <View style={styles.matrixStatus}>
                  {hasFeature ? (
                    <Check color={THEME.colors.status.success} size={16} />
                  ) : (
                    <Minus color={THEME.colors.muted} size={16} />
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* UPGRADE SECTION */}
        {nextTier && (
          <View style={styles.upgradeCard}>
            <Text style={styles.upgradeTitle}>
              Unlock <Text style={styles.goldText}>{upgradeFeaturesCount}</Text> more features with {nextTier}
            </Text>
            <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgrade}>
              <Text style={styles.upgradeBtnText}>{t('tier.upgrade_available').toUpperCase()}</Text>
              <ChevronRight color="black" size={18} />
            </TouchableOpacity>
          </View>
        )}

        {/* LICENSE INFO */}
        <View style={styles.licenseCard}>
          <View style={styles.licenseInfo}>
            <Text style={styles.licenseLabel}>{t('tier.license_key').toUpperCase()}</Text>
            <Text style={styles.licenseKey}>
              OMN-{companyName?.substring(0, 3).toUpperCase() || 'SYS'}-••••••••
            </Text>
          </View>
          <TouchableOpacity style={styles.manageBtn}>
            <Text style={styles.manageText}>{t('tier.manage_license').toUpperCase()}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>OMNORA OS v13.0 Industrial Prime</Text>
          <Text style={styles.footerText}>Secure Mesh Architecture Active</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    padding: 20,
  },
  planCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 32,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tierIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planLabel: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1,
  },
  tierName: {
    fontFamily: THEME.fonts.interBold,
    fontSize: 24,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: 20,
    opacity: 0.5,
  },
  deviceLabel: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 8,
  },
  deviceStats: {
    gap: 12,
  },
  deviceCount: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 24,
  },
  deviceMax: {
    color: THEME.colors.text.muted,
    fontSize: 14,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: THEME.colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionTitle: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 16,
    marginLeft: 4,
  },
  matrix: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 32,
    overflow: 'hidden',
  },
  matrixRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  featureLabel: {
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.inter,
    fontSize: 14,
  },
  matrixStatus: {
    width: 24,
    alignItems: 'center',
  },
  upgradeCard: {
    backgroundColor: 'rgba(96, 165, 250, 0.05)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    marginBottom: 32,
  },
  upgradeTitle: {
    color: '#fff',
    fontFamily: THEME.fonts.interBold,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  goldText: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.monoBold,
  },
  upgradeBtn: {
    backgroundColor: THEME.colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  upgradeBtnText: {
    color: 'black',
    fontFamily: THEME.fonts.interBold,
    fontSize: 12,
  },
  licenseCard: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  licenseInfo: {
    flex: 1,
  },
  licenseLabel: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 9,
    letterSpacing: 1,
  },
  licenseKey: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.mono,
    fontSize: 13,
    marginTop: 4,
  },
  manageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: THEME.colors.gold + '40',
    borderRadius: 6,
  },
  manageText: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.interBold,
    fontSize: 9,
  },
  footer: {
    marginTop: 40,
    marginBottom: 60,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.mono,
    fontSize: 9,
    opacity: 0.5,
  }
});
