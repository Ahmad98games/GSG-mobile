import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Lock, Crown, Zap, Shield } from 'lucide-react-native';
import { useBridgeStatusStore } from '../store/BridgeStatusStore';
import { openWhatsApp } from '../utils/whatsapp';
import { THEME } from '../constants/theme';

interface MobileFeatureGateProps {
  feature: 'finance' | 'intelligence' | 'api' | 'cctv';
  children: React.ReactNode;
}

const TIER_WEIGHTS = {
  lite: 1,
  pro: 2,
  elite: 3,
};

const FEATURE_REQUIREMENTS = {
  cctv: 'lite',
  finance: 'pro',
  intelligence: 'pro',
  api: 'elite',
} as const;

const FEATURE_DISPLAY_NAMES = {
  finance: 'Financial Ledger & Cashflow',
  intelligence: 'Tactical Intelligence Anomaly Reports',
  api: 'External API Sync Integration',
  cctv: 'CCTV Telemetry Monitoring',
};

export function MobileFeatureGate({ feature, children }: MobileFeatureGateProps) {
  const currentTier = useBridgeStatusStore(s => s.tierLimit) || 'lite';
  const { ownerWhatsApp, businessName } = useBridgeStatusStore();

  const requiredTier = FEATURE_REQUIREMENTS[feature];
  const currentWeight = TIER_WEIGHTS[currentTier as 'lite' | 'pro' | 'elite'] || 1;
  const requiredWeight = TIER_WEIGHTS[requiredTier] || 1;

  if (currentWeight >= requiredWeight) {
    return <>{children}</>;
  }

  const featureName = FEATURE_DISPLAY_NAMES[feature];

  const handleUpgradeRequest = () => {
    const message = `Assalam o Alaikum,\n\nI would like to request an upgrade for my business "${businessName || 'My Factory'}" from ${currentTier.toUpperCase()} to ${requiredTier.toUpperCase()} plan to access the "${featureName}" feature on Noxis Mobile.\n\nPlease guide me through the upgrade steps.\n\n─────────────────\n🔒 Noxis Hub | Omnora Labs\nnoxishub.app`;
    const targetPhone = ownerWhatsApp || '923334355475';
    openWhatsApp(targetPhone, message);
  };

  const renderIcon = () => {
    if (requiredTier === 'elite') return <Crown size={40} color={THEME.colors.gold} />;
    if (requiredTier === 'pro') return <Zap size={40} color={THEME.colors.blue} />;
    return <Shield size={40} color="#9CA3AF" />;
  };

  return (
    <View style={styles.lockContainer}>
      <View style={styles.lockBox}>
        <View style={styles.iconContainer}>
          {renderIcon()}
          <View style={styles.lockBadge}>
            <Lock size={12} color="black" />
          </View>
        </View>

        <Text style={styles.lockTitle}>{featureName}</Text>
        
        <Text style={styles.lockSubtitle}>
          This capability is restricted. To unlock, upgrade from your current{' '}
          <Text style={styles.highlightText}>{currentTier.toUpperCase()}</Text> tier to the{' '}
          <Text style={[styles.highlightText, { color: requiredTier === 'elite' ? THEME.colors.gold : THEME.colors.blue }]}>
            {requiredTier.toUpperCase()}
          </Text>{' '}
          plan.
        </Text>

        <TouchableOpacity style={styles.upgradeBtn} onPress={handleUpgradeRequest}>
          <Text style={styles.upgradeBtnText}>
            Upgrade to {requiredTier.toUpperCase()} Plan
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lockContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(5, 5, 5, 0.95)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lockBox: {
    backgroundColor: '#0A0C0F',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#C5A059',
    borderRadius: 8,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0A0C0F',
  },
  lockTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  lockSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 28,
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  upgradeBtn: {
    backgroundColor: '#C5A059',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  upgradeBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
});
