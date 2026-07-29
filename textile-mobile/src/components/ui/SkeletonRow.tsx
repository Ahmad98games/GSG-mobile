import React, { useEffect, useRef } from 'react'
import { Animated, View, StyleSheet } from 'react-native'

interface Props {
  lines?: number
  height?: number
}

export function SkeletonRow({
  lines = 1,
  height = 56
}: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    )
    animation.start()
    return () => animation.stop()
  }, [])

  return (
    <View style={{ gap: 8, padding: 16 }}>
      {Array.from({ length: lines }).map(
        (_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.row,
              { height, opacity }
            ]}
          />
        )
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
  },
})
