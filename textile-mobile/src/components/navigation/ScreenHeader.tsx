import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet
} from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useBridgeStatusStore } from '@/src/stores/BridgeStatusStore'

interface Props {
  title: string
  subtitle?: string
  showBack?: boolean
  rightAction?: {
    label: string
    onPress: () => void
    color?: string
  }
}

export function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  rightAction,
}: Props) {
  const insets = useSafeAreaInsets()
  const { hubOnline } = useBridgeStatusStore()

  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top + 8 }
    ]}>
      {/* Left — back or spacer */}
      <View style={styles.side}>
        {showBack && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={{
              top: 12, bottom: 12,
              left: 12, right: 12,
            }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center */}
      <View style={styles.center}>
        <Text
          style={styles.title}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={styles.subtitle}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      {/* Right */}
      <View style={styles.side}>
        {rightAction ? (
          <TouchableOpacity
            onPress={rightAction.onPress}
            hitSlop={{
              top: 8, bottom: 8,
              left: 8, right: 8,
            }}
          >
            <Text style={[
              styles.rightText,
              rightAction.color
                ? { color: rightAction.color }
                : null,
            ]}>
              {rightAction.label}
            </Text>
          </TouchableOpacity>
        ) : (
          // Hub status dot
          <View style={styles.statusDot}>
            <View style={[
              styles.dot,
              {
                backgroundColor: hubOnline
                  ? '#10B981' : '#374151'
              }
            ]} />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#0A0C0F',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  side: {
    width: 60,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 1,
  },
  backBtn: {
    padding: 4,
  },
  backIcon: {
    color: '#60A5FA',
    fontSize: 20,
  },
  rightText: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  statusDot: {
    alignItems: 'flex-end',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
})
