import React from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated
} from 'react-native'
import type {
  BottomTabBarProps
} from '@react-navigation/bottom-tabs'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from '../../hooks/useTranslation'

const TABS = [
  { name: 'dashboard', label: 'Home', icon: '⊞' },
  { name: 'karigars', label: 'Karigars', icon: '👥' },
  { name: 'production', label: 'Log', icon: '⚡' },
  { name: 'attendance', label: 'Attend', icon: '✓' },
  { name: 'scanner', label: 'Scan', icon: '⬚' },
  { name: 'settings', label: 'More', icon: '≡' },
]

export function NoxisTabBar({
  state, navigation
}: BottomTabBarProps) {
  const { tr } = useTranslation()
  const insets = useSafeAreaInsets()
  const scales = TABS.map(() =>
    React.useRef(new Animated.Value(1)).current
  )

  const handlePress = (
    routeName: string,
    index: number
  ) => {
    // Tap animation
    Animated.sequence([
      Animated.timing(scales[index], {
        toValue: 0.85,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(scales[index], {
        toValue: 1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start()

    navigation.navigate(routeName)
  }

  return (
    <View style={[
      styles.container,
      { paddingBottom: Math.max(insets.bottom, 8) }
    ]}>
      {TABS.map((tab, index) => {
        const activeRouteName = state.routes[state.index]?.name
        // Match active tab by name or nested structure
        const isFocused = activeRouteName === tab.name || activeRouteName?.startsWith(tab.name + '/')

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() =>
              handlePress(tab.name, index)
            }
            activeOpacity={1}
          >
            <Animated.View style={[
              styles.tabInner,
              isFocused && styles.tabActive,
              { transform: [{ scale: scales[index] }] }
            ]}>
              <Text style={[
                styles.tabIcon,
                { color: isFocused
                    ? '#60A5FA' : '#4B5563' }
              ]}>
                {tab.icon}
              </Text>
              <Text style={[
                styles.tabLabel,
                { color: isFocused
                    ? '#60A5FA' : '#4B5563',
                  fontWeight: isFocused
                    ? '600' : '400',
                }
              ]}>
                {tr(tab.label)}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0A0C0F',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 3,
  },
  tabActive: {
    backgroundColor: 'rgba(96,165,250,0.1)',
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.3,
  },
})
