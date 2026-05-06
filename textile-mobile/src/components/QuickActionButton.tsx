import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../constants/DesignSystem';
import { useVocabulary } from '../store/NodeVocabularyContext';

interface QuickActionButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  color?: string;
  subLabel?: string;
}

/**
 * QUICK ACTION BUTTON
 * Senior Developer Implementation for Industrial Mesh.
 * Optimized for factory workers: Massive touch target, high contrast.
 */
export const QuickActionButton: React.FC<QuickActionButtonProps> = React.memo(({ 
  label, 
  icon, 
  onPress, 
  color = THEME.colors.blue,
  subLabel
}) => {
  const { vocabulary } = useVocabulary();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        style={[styles.button, { borderColor: color }]}
      >
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          <Ionicons name={icon} size={32} color="white" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={24} color={THEME.colors.muted} />
      </TouchableOpacity>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    marginVertical: 8,
    // Massive touch target
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.manropeBold,
    fontSize: 20,
    letterSpacing: 0.5,
  },
  subLabel: {
    color: THEME.colors.text.secondary,
    fontFamily: THEME.fonts.mono,
    fontSize: 12,
    marginTop: 4,
    textTransform: 'uppercase',
  },
});
