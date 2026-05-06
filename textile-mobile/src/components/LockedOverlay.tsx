'use client';

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { THEME } from '../constants/theme';
import { Lock } from 'lucide-react-native';
import type { Tier } from '../lib/auth/TierGuard';
import Animated, { FadeIn, useAnimatedStyle, withRepeat, withSequence, withTiming, useSharedValue } from 'react-native-reanimated';

interface LockedOverlayProps {
  featureName: string;
  requiredTier: Tier;
}

/**
 * LOCKED OVERLAY
 * Industrial-grade feature gating UI.
 */
export function LockedOverlay({ featureName, requiredTier }: LockedOverlayProps) {
  const pulseScale = useSharedValue(1);

  React.useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ scale: pulseScale.value }],
    };
  });

  return (
    <Animated.View entering={FadeIn} style={styles.overlay}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Lock size={32} color={THEME.colors.gold} />
        <Text style={styles.title}>{featureName.toUpperCase()}_LOCKED</Text>
        <Text style={styles.subtitle}>AVAILABLE_ON_{requiredTier.toUpperCase()}_PLAN</Text>
        
        <TouchableOpacity style={styles.upgradeBtn}>
          <Text style={styles.upgradeText}>UPGRADE_PLAN</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 20, 23, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.gold + '40',
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: 'white',
    fontSize: 14,
    marginTop: 16,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.gold,
    fontSize: 10,
    marginTop: 4,
  },
  upgradeBtn: {
    marginTop: 24,
    backgroundColor: THEME.colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  upgradeText: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: 'white',
    fontSize: 10,
  }
});
