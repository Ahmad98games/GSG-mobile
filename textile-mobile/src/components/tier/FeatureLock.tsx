import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Lock } from 'lucide-react-native';
import { useBridgeStatus } from '../../store/BridgeStatusStore';
import type { TierFeatures } from '../../store/BridgeStatusStore';
import { usePersona } from '../../hooks/usePersona';
import { UpgradeSheetManager } from '../../services/UpgradeSheetManager';

interface FeatureLockProps {
  feature: keyof TierFeatures;
  requiredTier: 'pro' | 'elite';
  children: React.ReactNode;
  showLockIcon?: boolean;
}

const COLORS = {
  surface: '#1A1D21',
  muted: '#64748B',
  text: '#F0F0F0',
};

/**
 * FEATURE LOCK WRAPPER
 * Conditionally gates industrial features based on tier eligibility.
 */
export const FeatureLock: React.FC<FeatureLockProps> = ({ 
  feature, 
  requiredTier, 
  children, 
  showLockIcon = true 
}) => {
  const { t } = usePersona();
  const { isFeatureAvailable } = useBridgeStatus();
  
  const isAvailable = isFeatureAvailable(feature);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: withSpring(isAvailable ? 1 : 0.4, { stiffness: 250, damping: 30 }),
    };
  });

  const handlePress = () => {
    if (!isAvailable) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      UpgradeSheetManager.open(feature);
    }
  };

  if (isAvailable) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.childWrapper, animatedStyle]}>
        {children}
      </Animated.View>

      <Pressable 
        style={StyleSheet.absoluteFill} 
        onPress={handlePress}
      >
        <View style={styles.overlay}>
          {showLockIcon && (
            <Lock size={20} color={COLORS.text} style={styles.icon} />
          )}
          <Text style={styles.lockText}>
            {t(`tier.feature_requires_${requiredTier}`)}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  childWrapper: {
    flex: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 29, 33, 0.2)', // Subtle surface tint
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  icon: {
    marginBottom: 4,
    opacity: 0.8,
  },
  lockText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: COLORS.text,
    textAlign: 'center',
    opacity: 0.9,
  },
});
