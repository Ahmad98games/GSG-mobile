import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useBridgeStatus } from '../store/BridgeStatusStore';
import { THEME } from '../constants/theme';
import * as Haptics from 'expo-haptics';

/**
 * BRIDGE STATUS BAR
 * Persistent indicator showing real-time connectivity status and signal quality.
 * Tapping navigates to the Diagnostics screen for deep inspection.
 */
export const BridgeStatusBar: React.FC = () => {
  const router = useRouter();
  const { connectionState, reconnectAttempts, signalQuality } = useBridgeStatus();

  const getStatusConfig = () => {
    switch (connectionState) {
      case 'connected':
        return {
          label: `● Connected (${signalQuality.toUpperCase()})`,
          color: THEME.colors.blue,
          bgColor: 'rgba(96, 165, 250, 0.15)'
        };
      case 'reconnecting':
        return {
          label: `⟳ Reconnecting... attempt ${reconnectAttempts}`,
          color: THEME.colors.gold,
          bgColor: 'rgba(197, 160, 89, 0.15)'
        };
      case 'offline':
      default:
        return {
          label: '✕ Offline — Connection Lost',
          color: THEME.colors.critical,
          bgColor: 'rgba(239, 68, 68, 0.15)'
        };
    }
  };

  const config = getStatusConfig();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(app)/diagnostics');
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      activeOpacity={0.7}
      style={[
        styles.container, 
        { 
          backgroundColor: config.bgColor, 
          borderBottomColor: config.color,
          marginTop: Platform.OS === 'android' ? 30 : 0 // Basic status bar offset
        }
      ]}
    >
      <Text style={[styles.text, { color: config.color }]}>
        {config.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 36,
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  text: {
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1.5,
  },
});
