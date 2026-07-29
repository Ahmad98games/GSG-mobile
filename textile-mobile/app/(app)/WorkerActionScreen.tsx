import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Platform,
} from 'react-native';
import { Camera } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useVocabulary } from '../../src/store/VocabularyContext';
import { queueManager } from '../../src/services/OfflineQueueManager';
import { tcpService } from '../../src/services/TCPClientService';
import { CustomNumpad } from '../../src/components/CustomNumpad';
import { IndustrialSyncIndicator } from '../../src/components/IndustrialSyncIndicator';
import { Stack } from 'expo-router';
import { ScreenHeader } from '../../src/components/navigation/ScreenHeader';

const COLORS = {
  bg: '#09090b',
  surface: '#18181b',
  accent: '#84cc16', // Cyber-Lime
  blue: '#60a5fa',   // Electric Blue
  recording: '#ef4444', // Red
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#27272a',
};

export default function WorkerActionScreen() {
  const { getLabel, config } = useVocabulary();
  const [value, setValue] = useState('');
  const flashAnim = useRef(new Animated.Value(0)).current;
  const recordingAnim = useRef(new Animated.Value(0)).current;
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const handleCctv = () => {
      setIsRecording(true);
      // Pulse animation for 3 seconds
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(recordingAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        ]),
        { iterations: 3 }
      ).start(() => {
        setIsRecording(false);
        recordingAnim.setValue(0);
      });
    };

    tcpService.on('cctvTriggered', handleCctv);
    return () => {
      tcpService.off('cctvTriggered', handleCctv);
    };
  }, []);

  const handleKeyPress = (val: string) => {
    if (value.length < 10) {
      setValue(prev => prev + val);
    }
  };

  const handleClear = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setValue('');
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setValue(prev => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (!value || value === '0') return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      await queueManager.enqueueTier2(1, {
        amount: parseInt(value),
        unit: config?.unit,
        sub_unit: config?.subUnit,
        industry: config?.industry,
        ts: Date.now(),
      });

      setValue('');
      triggerFlash();
    } catch (e) {
      console.error('[Action] Log failed:', e);
    }
  };

  const triggerFlash = () => {
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
      Animated.timing(flashAnim, { toValue: 0, duration: 400, useNativeDriver: false })
    ]).start();
  };

  const backgroundColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.bg, COLORS.accent]
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: false, title: 'Mark Attendance' }} />
      <ScreenHeader title="Mark Attendance" showBack={true} />
      <IndustrialSyncIndicator />

      <View style={styles.content}>
        <View style={styles.header}>
          {config?.activeCamera && (
            <View style={styles.cameraHud}>
              <Camera size={14} color={COLORS.accent} />
              <Text style={styles.cameraText}>
                {config.activeCamera.id}: {config.activeCamera.location.toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.label}>{getLabel('action').toUpperCase()} {getLabel('unit').toUpperCase()}</Text>
          <Text style={styles.subLabel}>NO NATIVE KEYBOARD // INDUSTRIAL MODE</Text>
        </View>

        {/* LARGE NUMERIC DISPLAY */}
        <View style={styles.displayContainer}>
          <Text style={[styles.displayText, !value && styles.placeholderText]}>
            {value || '0'}
          </Text>
          <Text style={styles.unitSuffix}>{getLabel('unit').toUpperCase()}</Text>
        </View>

        {/* RECORDING PULSE */}
        <View style={styles.feedbackArea}>
          {isRecording && (
            <Animated.View style={[styles.recordingBadge, { opacity: recordingAnim }]}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>RECORDING EVIDENCE...</Text>
            </Animated.View>
          )}
        </View>

        {/* INDUSTRIAL NUMPAD */}
        <View style={styles.numpadWrapper}>
          <CustomNumpad 
            onPress={handleKeyPress}
            onDelete={handleDelete}
            onClear={handleClear}
          />
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, !value && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!value}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>{getLabel('action').toUpperCase()} {getLabel('unit').toUpperCase()}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  cameraHud: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.2)',
  },
  cameraText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  label: {
    color: COLORS.accent,
    fontWeight: '900',
    fontSize: 24,
    letterSpacing: 2,
  },
  subLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  displayContainer: {
    backgroundColor: COLORS.surface,
    height: 120,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    flexDirection: 'row',
  },
  displayText: {
    color: COLORS.textPrimary,
    fontSize: 64,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  placeholderText: {
    color: '#27272a',
  },
  unitSuffix: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 12,
    marginTop: 20,
  },
  feedbackArea: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.recording,
  },
  recordingText: {
    color: COLORS.recording,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  numpadWrapper: {
    marginVertical: 10,
  },
  submitBtn: {
    backgroundColor: COLORS.accent,
    height: 85,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  submitBtnDisabled: {
    backgroundColor: COLORS.surface,
    opacity: 0.5,
  },
  submitBtnText: {
    color: COLORS.bg,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  }
});
