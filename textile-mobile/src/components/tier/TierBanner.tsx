import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useBridgeStatus } from '../../store/BridgeStatusStore';
import { usePersona } from '../../hooks/usePersona';

const COLORS = {
  surface: '#1A1D21',
  primary: '#60A5FA',
  gold: '#C5A059',
  red: '#EF4444',
  muted: '#64748B',
  text: '#F0F0F0',
};

/**
 * TIER BANNER
 * Persistent industrial status bar indicating system tier and node density.
 */
export const TierBanner = () => {
  const { t } = usePersona();
  const { 
    tierLimit, 
    connectedNodeCount, 
    maxNodeCount, 
    isNodeLimitReached, 
    connectionState,
    portalUpgradeUrl 
  } = useBridgeStatus();

  const isLimitReached = isNodeLimitReached();
  const isOnline = connectionState === 'connected';

  // Haptics on limit transition
  const [prevLimitReached, setPrevLimitReached] = useState(isLimitReached);
  useEffect(() => {
    if (isLimitReached && !prevLimitReached) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
    setPrevLimitReached(isLimitReached);
  }, [isLimitReached]);

  const renderTierBadge = () => {
    let color = COLORS.muted;
    if (tierLimit === 'pro') color = COLORS.primary;
    if (tierLimit === 'elite') color = COLORS.gold;

    return (
      <View style={styles.badgePill}>
        <Text style={[styles.badgeText, { color }]}>
          {isOnline ? tierLimit?.toUpperCase() : '--'}
        </Text>
      </View>
    );
  };

  const handleUpgrade = () => {
    Linking.openURL(portalUpgradeUrl);
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(400)}
      style={styles.container}
    >
      <View style={styles.leftSection}>
        {renderTierBadge()}
      </View>

      <View style={styles.centerSection}>
        {!isOnline ? (
          <Text style={styles.mutedText}>Plan: --</Text>
        ) : (
          <Text style={[styles.counterText, isLimitReached && styles.dangerText]}>
            {connectedNodeCount}
            <Text style={styles.denominatorText}>
              {maxNodeCount === -1 ? ' DEVICES CONNECTED' : ` / ${maxNodeCount} DEVICES`}
            </Text>
          </Text>
        )}
      </View>

      <View style={styles.rightSection}>
        {isOnline && tierLimit !== 'elite' && (
          <TouchableOpacity onPress={handleUpgrade} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Text style={styles.upgradeText}>{t('tier.upgrade_available')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
    height: 44,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  badgePill: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 10,
  },
  counterText: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 12,
    color: COLORS.gold,
  },
  dangerText: {
    color: COLORS.red,
  },
  denominatorText: {
    fontSize: 10,
    color: COLORS.muted,
  },
  mutedText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.muted,
  },
  upgradeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});
