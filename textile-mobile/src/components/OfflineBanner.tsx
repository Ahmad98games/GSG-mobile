import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate
} from 'react-native-reanimated';
import { useBridgeStatus } from '../store/BridgeStatusStore';
import { THEME } from '../constants/theme';
import { WifiOff, Wifi, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export const OfflineBanner = () => {
  const { connectionState } = useBridgeStatus();
  const [showToast, setShowToast] = useState(false);
  const isOffline = connectionState !== 'connected';
  
  const height = useSharedValue(0);

  useEffect(() => {
    if (isOffline) {
      height.value = withSpring(40, { damping: 15 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      if (height.value > 0) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      height.value = withSpring(0);
    }
  }, [isOffline]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: interpolate(height.value, [0, 40], [0, 1]),
    overflow: 'hidden'
  }));

  const toastStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(showToast ? 0 : 100) }],
    opacity: withTiming(showToast ? 1 : 0)
  }));

  return (
    <>
      <Animated.View style={[styles.banner, animatedStyle]}>
        <WifiOff size={14} color="black" />
        <Text style={styles.bannerText}>
          OFFLINE — CHANGES WILL SYNC WHEN CONNECTED
        </Text>
      </Animated.View>

      {showToast && (
        <Animated.View style={[styles.toast, toastStyle]}>
          <View style={styles.toastContent}>
            <Wifi size={16} color="#10B981" />
            <Text style={styles.toastText}>CONNECTED TO HUB ✓</Text>
          </View>
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#F59E0B', // Amber
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
  },
  bannerText: {
    color: 'black',
    fontFamily: THEME.fonts.monoBold,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastContent: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: THEME.radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  toastText: {
    color: 'white',
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1,
  }
});
