import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  type ViewStyle, 
  type TextStyle, 
  ActivityIndicator 
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { THEME } from '../constants/DesignSystem';

interface TacticalButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

/**
 * TACTICAL BUTTON 
 * Optimized for industrial environments: high contrast, glove-friendly, haptic-mapped.
 */
export const TacticalButton: React.FC<TacticalButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  style,
  textStyle,
  icon
}) => {
  const handlePress = () => {
    if (loading || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  const isGhost = variant === 'ghost';

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.button,
        isPrimary && styles.primary,
        isDanger && styles.danger,
        isGhost && styles.ghost,
        disabled && styles.disabled,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGhost ? THEME.colors.blue : THEME.colors.background} />
      ) : (
        <>
          {icon}
          <Text style={[
            styles.text,
            isGhost && styles.ghostText,
            textStyle
          ]}>
            {title.toUpperCase()}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: THEME.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.lg,
    gap: THEME.spacing.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  primary: {
    backgroundColor: THEME.colors.blue,
  },
  danger: {
    backgroundColor: THEME.colors.status.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: THEME.colors.border,
  },
  disabled: {
    opacity: 0.3,
  },
  text: {
    fontFamily: THEME.fonts.manropeBold,
    fontSize: 14,
    color: THEME.colors.background, // Contrast against primary/danger
    letterSpacing: 1.5,
  },
  ghostText: {
    color: THEME.colors.blue,
  }
});
