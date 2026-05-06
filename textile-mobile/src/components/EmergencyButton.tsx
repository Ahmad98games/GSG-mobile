import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolateColor,
  useSharedValue
} from 'react-native-reanimated';
import { AlertTriangle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { tcpService } from '../services/TCPClientService';
import { feedback } from '../services/FeedbackService';

/**
 * TACTICAL EMERGENCY BUTTON
 * Focus: Immediate high-priority reporting.
 */
export const EmergencyButton = () => {
  const glowValue = useSharedValue(0);

  React.useEffect(() => {
    glowValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      shadowColor: interpolateColor(
        glowValue.value,
        [0, 1],
        ['#ef4444', '#f87171']
      ),
      shadowOpacity: glowValue.value * 0.8,
      shadowRadius: glowValue.value * 15,
      transform: [{ scale: 1 + glowValue.value * 0.05 }]
    };
  });

  const handlePress = async () => {
    // 1. Heavy Haptic
    await feedback.error();
    
    // 2. Send Priority Alert to Hub
    tcpService.sendMessage({
      type: 'HIGH_PRIORITY_ALERT',
      severity: 'CRITICAL',
      ts: Date.now(),
      payload: {
        reason: 'MANUAL_SOS_TRIGGER',
        location: 'SCAN_STATION'
      }
    });

    console.log('[SOS] Emergency Override Sent to Hub');
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity 
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <AlertTriangle size={24} color="white" />
        <Text style={styles.text}>SOS</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    right: 24,
    borderRadius: 30,
    elevation: 10,
  },
  button: {
    backgroundColor: '#ef4444',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  text: {
    color: 'white',
    fontSize: 8,
    fontWeight: '900',
    marginTop: -2,
  }
});
