import React, { useRef } from 'react'
import {
  TouchableOpacity, Animated, StyleSheet,
  Text, View, ActivityIndicator
} from 'react-native'
import type { ViewStyle } from 'react-native'
import * as Haptics from 'expo-haptics'

interface Props {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  icon?: string
  style?: ViewStyle
}

export function NoxisButton({
  label, onPress, variant = 'primary',
  size = 'md', loading, disabled, icon, style
}: Props) {
  const scale = useRef(new Animated.Value(1)).current

  const handlePress = async () => {
    if (loading || disabled) return

    // Scale down on press
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.96,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start()

    // Haptic
    await Haptics.impactAsync(
      variant === 'danger'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    )

    onPress()
  }

  const bgColor = {
    primary: '#60A5FA',
    secondary: 'rgba(96,165,250,0.1)',
    ghost: 'transparent',
    danger: 'rgba(239,68,68,0.1)',
  }[variant]

  const textColor = {
    primary: '#000000',
    secondary: '#60A5FA',
    ghost: '#9CA3AF',
    danger: '#EF4444',
  }[variant]

  const borderColor = {
    primary: 'transparent',
    secondary: 'rgba(96,165,250,0.2)',
    ghost: 'rgba(255,255,255,0.08)',
    danger: 'rgba(239,68,68,0.2)',
  }[variant]

  const paddingV = { sm: 8, md: 14, lg: 18 }[size]
  const fontSize = { sm: 12, md: 14, lg: 16 }[size]

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      disabled={loading || disabled}
    >
      <Animated.View style={[
        styles.base,
        {
          backgroundColor: bgColor,
          borderColor,
          paddingVertical: paddingV,
          opacity: (loading || disabled) ? 0.5 : 1,
          transform: [{ scale }],
        },
        style,
      ]}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={textColor}
          />
        ) : (
          <View style={styles.inner}>
            {icon && (
              <Text style={[
                styles.icon,
                { color: textColor }
              ]}>
                {icon}
              </Text>
            )}
            <Text style={[
              styles.label,
              { color: textColor, fontSize }
            ]}>
              {label}
            </Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontWeight: '600',
  },
})
