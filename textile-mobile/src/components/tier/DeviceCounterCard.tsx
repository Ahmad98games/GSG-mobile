import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  useSharedValue 
} from 'react-native-reanimated';
import { useBridgeStatus } from '../../store/BridgeStatusStore';
import { usePersona } from '../../hooks/usePersona';

const COLORS = {
  surface: '#1A1D21',
  primary: '#60A5FA',
  gold: '#C5A059',
  red: '#EF4444',
  amber: '#F59E0B',
  muted: '#64748B',
  text: '#F0F0F0',
};

const SPRING_CONFIG = {
  stiffness: 250,
  damping: 30,
};

/**
 * DEVICE COUNTER CARD
 * Dashboard widget showing connected node density vs tier limits.
 */
export const DeviceCounterCard = () => {
  const { t } = usePersona();
  const { connectedNodeCount, maxNodeCount, tierLimit } = useBridgeStatus();
  
  const isElite = tierLimit === 'elite';
  const percentage = maxNodeCount > 0 ? (connectedNodeCount / maxNodeCount) * 100 : 0;
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    progressWidth.value = withSpring(Math.min(100, Math.max(0, percentage)), SPRING_CONFIG);
  }, [percentage]);

  const animatedProgressStyle = useAnimatedStyle(() => {
    'worklet';
    let fillColor = COLORS.primary;
    if (percentage >= 90) fillColor = COLORS.red;
    else if (percentage >= 70) fillColor = COLORS.amber;

    return {
      width: `${progressWidth.value}%`,
      backgroundColor: fillColor,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('tier.devices_title')}</Text>
      
      <View style={styles.countContainer}>
        <Text style={styles.countLarge}>{connectedNodeCount}</Text>
        {!isElite && (
          <Text style={styles.denominator}>/ {maxNodeCount}</Text>
        )}
      </View>

      {isElite ? (
        <Text style={styles.unlimitedLabel}>{t('tier.unlimited_devices')}</Text>
      ) : (
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, animatedProgressStyle]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  title: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.muted,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  countContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  countLarge: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 32,
    color: COLORS.gold,
  },
  denominator: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 14,
    color: COLORS.muted,
    marginLeft: 4,
  },
  unlimitedLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: COLORS.primary,
    fontStyle: 'italic',
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
    width: '100%',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});
