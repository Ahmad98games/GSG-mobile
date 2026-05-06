import React, { forwardRef, useImperativeHandle, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Linking, 
  Pressable 
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate, 
  Extrapolate,
  runOnJS
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Lock, Mic, ShieldAlert, Camera, Globe, BellRing, Smartphone, LockKeyhole } from 'lucide-react-native';
import { useBridgeStatus } from '../../store/BridgeStatusStore';
import type { TierFeatures } from '../../store/BridgeStatusStore';
import { usePersona } from '../../hooks/usePersona';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;
const SPRING_CONFIG = { stiffness: 250, damping: 30 };

const COLORS = {
  background: '#121417',
  surface: '#1A1D21',
  primary: '#60A5FA',
  gold: '#C5A059',
  muted: '#64748B',
  text: '#F0F0F0',
};

export type UpgradeSheetRef = {
  open: (feature: keyof TierFeatures) => void;
  close: () => void;
};

const FEATURE_METADATA: Record<keyof TierFeatures, { icon: any, labelKey: string, benefitKey: string }> = {
  voiceMessages: { icon: Mic, labelKey: 'feature.voice.label', benefitKey: 'feature.voice.benefit' },
  aiDetection: { icon: Camera, labelKey: 'feature.ai.label', benefitKey: 'feature.ai.benefit' },
  clientPortal: { icon: Globe, labelKey: 'feature.portal.label', benefitKey: 'feature.portal.benefit' },
  multiLocation: { icon: BellRing, labelKey: 'feature.multi.label', benefitKey: 'feature.multi.benefit' },
  guardianAuth: { icon: LockKeyhole, labelKey: 'feature.guardian.label', benefitKey: 'feature.guardian.benefit' },
  whatsappReports: { icon: Smartphone, labelKey: 'feature.whatsapp.label', benefitKey: 'feature.whatsapp.benefit' },
  systemLock: { icon: ShieldAlert, labelKey: 'feature.lock.label', benefitKey: 'feature.lock.benefit' },
  maxDevices: { icon: Smartphone, labelKey: 'feature.devices.label', benefitKey: 'feature.devices.benefit' },
  maxCameras: { icon: Camera, labelKey: 'feature.cameras.label', benefitKey: 'feature.cameras.benefit' },
  voiceMaxSeconds: { icon: Mic, labelKey: 'feature.voice_limit.label', benefitKey: 'feature.voice_limit.benefit' },
  msgMaxChars: { icon: Mic, labelKey: 'feature.msg_limit.label', benefitKey: 'feature.msg_limit.benefit' },
};

/**
 * UPGRADE BOTTOM SHEET
 * Custom Reanimated 3 bottom sheet for tier-based feature upselling.
 */
export const UpgradeBottomSheet = forwardRef<UpgradeSheetRef>((_, ref) => {
  const { t } = usePersona();
  const { tierLimit, portalUpgradeUrl } = useBridgeStatus();
  const [activeFeature, setActiveFeature] = useState<keyof TierFeatures | null>(null);
  const translateY = useSharedValue(SCREEN_HEIGHT);

  const close = useCallback(() => {
    translateY.value = withSpring(SCREEN_HEIGHT, SPRING_CONFIG);
  }, []);

  const open = useCallback((feature: keyof TierFeatures) => {
    setActiveFeature(feature);
    translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT, SPRING_CONFIG);
  }, []);

  useImperativeHandle(ref, () => ({ open, close }));

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = SCREEN_HEIGHT - SHEET_HEIGHT + event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 500) {
        runOnJS(close)();
      } else {
        translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT, SPRING_CONFIG);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      opacity: interpolate(
        translateY.value,
        [SCREEN_HEIGHT, SCREEN_HEIGHT - SHEET_HEIGHT],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  const nextTier = tierLimit === 'lite' ? 'pro' : 'elite';
  const upgradeUrl = `${portalUpgradeUrl}#${nextTier}`;
  
  const nextTierUnlocks = tierLimit === 'lite' 
    ? ['voiceMessages', 'aiDetection', 'clientPortal']
    : ['multiLocation', 'guardianAuth', 'whatsappReports'];

  const FeatureIcon = activeFeature ? FEATURE_METADATA[activeFeature].icon : Lock;

  return (
    <>
      <Animated.View 
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]} 
      />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.sheet, animatedStyle]}>
          <View style={styles.handle} />
          
          <View style={styles.content}>
            {/* Current Plan Section */}
            <View style={styles.planHeader}>
              <Text style={styles.planLabel}>{t('tier.your_plan')}:</Text>
              <View style={[styles.badge, tierLimit === 'elite' ? styles.eliteBadge : tierLimit === 'pro' ? styles.proBadge : styles.liteBadge]}>
                <Text style={styles.badgeText}>{tierLimit?.toUpperCase() || 'LITE'}</Text>
              </View>
            </View>

            {/* Missing Feature Highlight */}
            {activeFeature && (
              <View style={styles.missingFeatureContainer}>
                <View style={styles.iconCircle}>
                  <FeatureIcon color={COLORS.gold} size={24} />
                </View>
                <View style={styles.missingFeatureText}>
                  <Text style={styles.featureTitle}>{t(FEATURE_METADATA[activeFeature].labelKey)}</Text>
                  <Text style={styles.benefitText}>{t(FEATURE_METADATA[activeFeature].benefitKey)}</Text>
                </View>
              </View>
            )}

            {/* Next Tier Unlocks */}
            <View style={styles.unlocksContainer}>
              <Text style={styles.sectionTitle}>{t('tier.unlock_with_next')}</Text>
              {nextTierUnlocks.map((f: any) => (
                <View key={f} style={styles.unlockItem}>
                  <Text style={styles.unlockDot}>•</Text>
                  <Text style={styles.unlockText}>{t(FEATURE_METADATA[f as keyof TierFeatures].labelKey)}</Text>
                </View>
              ))}
            </View>

            {/* Upgrade Button */}
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => Linking.openURL(upgradeUrl)}
            >
              <Text style={styles.upgradeButtonText}>
                {t('tier.upgrade_to')} {nextTier.toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
      <Pressable 
        style={StyleSheet.absoluteFill} 
        onPress={close} 
        pointerEvents={translateY.value < SCREEN_HEIGHT ? 'auto' : 'none'}
      />
    </>
  );
});

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: SHEET_HEIGHT,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    zIndex: 100,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.muted,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  content: {
    paddingHorizontal: 24,
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  planLabel: {
    fontFamily: 'Inter-Regular',
    color: COLORS.muted,
    marginRight: 12,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  badgeText: {
    fontFamily: 'JetBrainsMono-Bold',
    fontSize: 12,
    color: COLORS.muted,
  },
  liteBadge: { borderLeftWidth: 2, borderLeftColor: COLORS.muted },
  proBadge: { borderLeftWidth: 2, borderLeftColor: COLORS.primary },
  eliteBadge: { borderLeftWidth: 2, borderLeftColor: COLORS.gold },
  
  missingFeatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(197, 160, 89, 0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(197, 160, 89, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  missingFeatureText: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.gold,
    marginBottom: 4,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
    opacity: 0.8,
  },
  
  unlocksContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: COLORS.muted,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  unlockItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  unlockDot: {
    color: COLORS.primary,
    marginRight: 8,
    fontSize: 16,
  },
  unlockText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: COLORS.text,
  },
  
  upgradeButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 40,
  },
  upgradeButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: COLORS.background,
  },
});
