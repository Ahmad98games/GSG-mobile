import React, { useEffect, useRef } from 'react'
import {
  Animated, StyleSheet, Text
} from 'react-native'
import * as Haptics from 'expo-haptics'

interface Props {
  message: string
  visible: boolean
  onHide: () => void
}

export function SuccessOverlay({
  message, visible, onHide
}: Props) {
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      )
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 200,
          friction: 12,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Auto-hide after 1.5 seconds
        const timer = setTimeout(() => {
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            scale.setValue(0.8)
            onHide()
          })
        }, 1500)
        return () => clearTimeout(timer)
      })
    }
  }, [visible])

  if (!visible) return null

  return (
    <Animated.View style={[
      styles.container,
      { opacity, transform: [{ scale }] }
    ]}>
      <Text style={styles.check}>✓</Text>
      <Text style={styles.message}>
        {message}
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
    zIndex: 100,
  },
  check: {
    fontSize: 32,
    color: '#10B981',
  },
  message: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
})
