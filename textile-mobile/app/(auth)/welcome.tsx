'use client'
import React, { useRef, useState } from 'react'
import {
  View, Text, StyleSheet, Dimensions,
  TouchableOpacity, FlatList, Animated
} from 'react-native'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { width } = Dimensions.get('window')
const WELCOME_SEEN_KEY = 'noxis_welcome_seen'

interface Slide {
  id: string;
  icon: string;
  title: string;
  desc: string;
  accent: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    icon: '🏭',
    title: 'Factory Control\nin Your Pocket',
    desc: 'Mark attendance, log production,\nand track peshgi — all from your phone.',
    accent: '#60A5FA',
  },
  {
    id: '2',
    icon: '📡',
    title: 'Works Without\nInternet',
    desc: 'Connect to your factory Hub over\nlocal WiFi. No internet needed.',
    accent: '#10B981',
  },
  {
    id: '3',
    icon: '🔒',
    title: 'Secure &\nPrivate',
    desc: 'Your data stays on your factory PC.\nEncrypted. Never shared.',
    accent: '#C5A059',
  },
]

export default function WelcomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList<Slide>>(null)
  const scrollX = useRef(new Animated.Value(0)).current

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      })
      setCurrentIndex(currentIndex + 1)
    } else {
      await AsyncStorage.setItem(WELCOME_SEEN_KEY, 'true')
      router.replace('/(auth)/pair')
    }
  }

  const handleSkip = async () => {
    await AsyncStorage.setItem(WELCOME_SEEN_KEY, 'true')
    router.replace('/(auth)/pair')
  }

  return (
    <View style={styles.container}>
      {/* Skip */}
      {currentIndex < SLIDES.length - 1 && (
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item }: { item: Slide }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.slideIcon}>
              {item.icon}
            </Text>
            <Text style={[
              styles.slideTitle,
              { color: item.accent }
            ]}>
              {item.title}
            </Text>
            <Text style={styles.slideDesc}>
              {item.desc}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => {
          const inputRange = [
            (i - 1) * width,
            i * width,
            (i + 1) * width,
          ]
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          })
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          })
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { width: dotWidth, opacity }
              ]}
            />
          )
        })}
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={styles.cta}
        onPress={handleNext}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>
          {currentIndex < SLIDES.length - 1
            ? 'Next →'
            : 'Connect to Hub'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060708',
    alignItems: 'center',
    paddingBottom: 48,
  },
  skipBtn: {
    alignSelf: 'flex-end',
    padding: 16,
    marginTop: 48,
  },
  skipText: {
    color: '#4B5563',
    fontSize: 14,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    flex: 1,
  },
  slideIcon: {
    fontSize: 64,
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 16,
  },
  slideDesc: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 32,
  },
  dot: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#60A5FA',
  },
  cta: {
    backgroundColor: '#60A5FA',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 50,
    marginHorizontal: 24,
    width: '80%',
    alignItems: 'center',
  },
  ctaText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
})
