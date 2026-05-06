import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withDelay,
  Easing,
  interpolate
} from 'react-native-reanimated';
import { THEME } from '../constants/DesignSystem';
import { Cpu, Zap, Shield, Link } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

/**
 * HANDSHAKE SCREEN (v9.0)
 * Cyberpunk cinematic animation for Local Mesh connection.
 */
export const HandshakeScreen = () => {
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 3000, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    rotation.value = withRepeat(withTiming(360, { duration: 10000, easing: Easing.linear }), -1);
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const ringStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
      opacity: interpolate(progress.value, [0, 0.2, 1], [0, 1, 0.8]),
    };
  });

  const node1Style = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [-100, -40]) },
        { scale: interpolate(progress.value, [0, 1], [0.5, 1]) }
      ],
      opacity: progress.value,
    };
  });

  const node2Style = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [100, 40]) },
        { scale: interpolate(progress.value, [0, 1], [0.5, 1]) }
      ],
      opacity: progress.value,
    };
  });

  const lineStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      width: interpolate(progress.value, [0.3, 0.7], [0, 80]),
      opacity: interpolate(progress.value, [0.3, 0.7], [0, 1]),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: interpolate(progress.value, [0.1, 0.3, 0.8, 1], [0, 1, 1, 0.8]),
      transform: [{ translateY: interpolate(progress.value, [0, 1], [20, 0]) }]
    };
  });

  return (
    <View style={styles.container}>
      {/* Cinematic Background Scanlines */}
      <View style={styles.scanline} />
      
      {/* Central Animation Hub */}
      <View style={styles.animationHub}>
        {/* Rotating Energy Ring */}
        <Animated.View style={[styles.energyRing, ringStyle]} />
        
        <View style={styles.nodeContainer}>
          {/* Node 1 (Mobile) */}
          <Animated.View style={[styles.node, node1Style]}>
            <Cpu color={THEME.colors.blue} size={32} strokeWidth={1.5} />
            <Text style={styles.nodeLabel}>NODE_MN</Text>
          </Animated.View>

          {/* Sync Line */}
          <View style={styles.lineWrapper}>
            <Animated.View style={[styles.syncLine, lineStyle]} />
            <Zap color={THEME.colors.gold} size={16} style={styles.zapIcon} />
          </View>

          {/* Node 2 (Hub) */}
          <Animated.View style={[styles.node, node2Style]}>
            <Shield color={THEME.colors.gold} size={32} strokeWidth={1.5} />
            <Text style={styles.nodeLabel}>HUB_ALPHA</Text>
          </Animated.View>
        </View>
      </View>

      {/* Dynamic Status Text */}
      <Animated.View style={[styles.statusContainer, textStyle]}>
        <Text style={styles.statusTitle}>SYNCING NODES</Text>
        <Text style={styles.statusSub}>ESTABLISHING ENCRYPTED MESH BRIDGE...</Text>
        
        {/* Progress Bar Mini */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: `${progress.value * 100}%` }]} />
        </View>
      </Animated.View>

      {/* Footer Branding */}
      <View style={styles.footer}>
        <Link color={THEME.colors.muted} size={14} />
        <Text style={styles.footerText}>OMNORA NOXIS v9.0 SECURE_LINK</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.05)',
    zIndex: 1,
  },
  animationHub: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: THEME.colors.blue,
    borderStyle: 'dashed',
    opacity: 0.3,
  },
  nodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  node: {
    alignItems: 'center',
    backgroundColor: 'rgba(28, 32, 40, 0.8)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  nodeLabel: {
    color: THEME.colors.text.secondary,
    fontFamily: THEME.fonts.mono,
    fontSize: 8,
    marginTop: 8,
    letterSpacing: 1,
  },
  lineWrapper: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncLine: {
    height: 2,
    backgroundColor: THEME.colors.gold,
    shadowColor: THEME.colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  zapIcon: {
    position: 'absolute',
  },
  statusContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  statusTitle: {
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 18,
    letterSpacing: 4,
  },
  statusSub: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.mono,
    fontSize: 10,
    marginTop: 8,
    letterSpacing: 1,
  },
  progressTrack: {
    width: 200,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginTop: 24,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: THEME.colors.blue,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.mono,
    fontSize: 9,
    letterSpacing: 2,
  }
});
