import React, { useEffect, useRef } from 'react'
import {
  View, Text, Animated, StyleSheet,
  Dimensions
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const { width, height } = Dimensions.get('window')

interface Props {
  onFinish: () => void
}

export function SplashScreen({ onFinish }: Props) {
  const logoScale = useRef(new Animated.Value(0.6)).current
  const logoOpacity = useRef(new Animated.Value(0)).current
  const wordmarkOpacity = useRef(new Animated.Value(0)).current
  const taglineOpacity = useRef(new Animated.Value(0)).current
  const progressWidth = useRef(new Animated.Value(0)).current
  const containerOpacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    Animated.sequence([
      // Logo appears
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 80,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Wordmark fades in
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: 300,
        delay: 100,
        useNativeDriver: true,
      }),
      // Tagline fades in
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Progress bar fills
      Animated.timing(progressWidth, {
        toValue: width - 80,
        duration: 1200,
        useNativeDriver: false,
      }),
      // Fade out
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 300,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onFinish())
  }, [])

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: containerOpacity }
      ]}
    >
      <LinearGradient
        colors={['#060708', '#0A0C0F', '#060708']}
        style={StyleSheet.absoluteFill}
      />

      {/* Glow orb behind logo */}
      <View style={styles.glowOrb} />

      {/* Logo */}
      <Animated.View style={[
        styles.logoContainer,
        {
          opacity: logoOpacity,
          transform: [{ scale: logoScale }]
        }
      ]}>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>N</Text>
        </View>
      </Animated.View>

      {/* Wordmark */}
      <Animated.Text style={[
        styles.wordmark,
        { opacity: wordmarkOpacity }
      ]}>
        NOXIS
      </Animated.Text>

      {/* Tagline */}
      <Animated.Text style={[
        styles.tagline,
        { opacity: taglineOpacity }
      ]}>
        Industrial ERP · Mobile
      </Animated.Text>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[
          styles.progressBar,
          { width: progressWidth }
        ]} />
      </View>

      {/* Version */}
      <Text style={styles.version}>
        v13.0 · Omnora Labs
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#060708',
    zIndex: 999,
  },
  glowOrb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(96,165,250,0.06)',
    top: height / 2 - 160,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#0F1114',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#60A5FA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoLetter: {
    fontSize: 36,
    fontWeight: '800',
    color: '#60A5FA',
    letterSpacing: -1,
  },
  wordmark: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 8,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 12,
    color: '#374151',
    letterSpacing: 2,
    marginBottom: 48,
  },
  progressTrack: {
    width: width - 80,
    height: 2,
    backgroundColor: '#111418',
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 48,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#60A5FA',
    borderRadius: 1,
  },
  version: {
    position: 'absolute',
    bottom: 40,
    fontSize: 10,
    color: '#1F2937',
    letterSpacing: 2,
  },
})
