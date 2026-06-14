import React from 'react'
import { Image, StyleSheet, View } from 'react-native'

export function BrandWatermark() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Image
        source={require('../../../assets/omnoralabs.png')}
        style={styles.watermark}
        resizeMode="contain"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    transform: [{ rotate: '-15deg' }],
    opacity: 0.02,
    zIndex: 0,
    pointerEvents: 'none',
  },
  watermark: {
    width: 200,
    height: 200,
    tintColor: 'white',
  },
})
