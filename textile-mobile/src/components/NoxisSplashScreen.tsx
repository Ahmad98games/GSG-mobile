/**
 * NoxisSplashScreen — Professional animated launch screen
 *
 * Motion model (Google Material Motion compliant):
 *   0ms    – 600ms  : Logo enters (spring scale 0.75→1.0 + opacity fade)
 *   300ms  – 900ms  : Wordmark + subtitle slide up (staggered)
 *   900ms  – ∞      : Dot loader pulses with 200ms stagger
 *   isReady=true     : Full screen fades out (300ms ease-in), onFinish called
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// ── Design tokens ──────────────────────────────────────
const GOLD    = '#C6A756';
const GOLD_DIM = '#8A6F38';
const WHITE   = '#F8FAFC';
const BLUE    = '#60A5FA';
const BG      = '#060708';
const MUTED   = '#1F2937';
const OMNORA  = '#374151';

interface Props {
  isReady: boolean;
  onFinish: () => void;
}

export function NoxisSplashScreen({ isReady, onFinish }: Props) {
  // ── Animated values ──
  const screenOpacity  = useRef(new Animated.Value(1)).current;

  // Logo mark
  const logoScale      = useRef(new Animated.Value(0.72)).current;
  const logoOpacity    = useRef(new Animated.Value(0)).current;

  // Wordmark section (slides up)
  const wordmarkY      = useRef(new Animated.Value(28)).current;
  const wordmarkOpacity= useRef(new Animated.Value(0)).current;

  // Subtitle
  const subtitleY      = useRef(new Animated.Value(20)).current;
  const subtitleOpacity= useRef(new Animated.Value(0)).current;

  // Separator line (scales in width)
  const lineScale      = useRef(new Animated.Value(0)).current;

  // Three dots
  const dot1           = useRef(new Animated.Value(0.3)).current;
  const dot2           = useRef(new Animated.Value(0.3)).current;
  const dot3           = useRef(new Animated.Value(0.3)).current;

  // ── Dot loop ──────────────────────────────────────────
  const startDotLoop = () => {
    const pulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1,   duration: 320, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 0.3, duration: 320, useNativeDriver: true }),
          Animated.delay(640 - delay * 2),
        ])
      );
    pulse(dot1, 0).start();
    pulse(dot2, 200).start();
    pulse(dot3, 400).start();
  };

  // ── Entrance sequence ─────────────────────────────────
  useEffect(() => {
    Animated.sequence([
      // Phase 1 — Logo appears (spring feel via sequence of easings)
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Phase 2 — Separator line draws in
      Animated.timing(lineScale, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
      // Phase 3 — Wordmark slides up
      Animated.parallel([
        Animated.timing(wordmarkY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(wordmarkOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Phase 4 — Subtitle
      Animated.parallel([
        Animated.timing(subtitleY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => startDotLoop());
  }, []);

  // ── Exit sequence ─────────────────────────────────────
  useEffect(() => {
    if (!isReady) return;
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => onFinish());
  }, [isReady]);

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor={BG} />

      {/* ── CENTER CONTENT ─────────────────────────────── */}
      <View style={styles.centerContent}>

        {/* LOGO MARK — Diamond frame with N monogram */}
        <Animated.View style={{
          opacity: logoOpacity,
          transform: [{ scale: logoScale }],
        }}>
          <LogoMark />
        </Animated.View>

        {/* SEPARATOR LINE */}
        <Animated.View style={[styles.separatorWrap, { transform: [{ scaleX: lineScale }] }]}>
          <View style={styles.separator} />
        </Animated.View>

        {/* WORDMARK */}
        <Animated.View style={{
          opacity: wordmarkOpacity,
          transform: [{ translateY: wordmarkY }],
          alignItems: 'center',
        }}>
          <Text style={styles.wordmark} allowFontScaling={false}>NOXIS</Text>
        </Animated.View>

        {/* SUBTITLE */}
        <Animated.View style={{
          opacity: subtitleOpacity,
          transform: [{ translateY: subtitleY }],
          alignItems: 'center',
          marginTop: 8,
        }}>
          <Text style={styles.subtitle} allowFontScaling={false}>INDUSTRIAL  OS</Text>
        </Animated.View>

      </View>

      {/* ── DOT LOADER ────────────────────────────────── */}
      <View style={styles.dotRow}>
        <Animated.View style={[styles.dot, styles.dotActive, { opacity: dot1 }]} />
        <Animated.View style={[styles.dot, { opacity: dot2 }]} />
        <Animated.View style={[styles.dot, { opacity: dot3 }]} />
      </View>

      {/* ── FOOTER ────────────────────────────────────── */}
      <Text style={styles.footer} allowFontScaling={false}>by Omnora</Text>

    </Animated.View>
  );
}

// ── Logo mark component ──────────────────────────────────
function LogoMark() {
  return (
    <View style={logoStyles.container}>
      {/* Outer diamond ring */}
      <View style={logoStyles.diamondOuter}>
        {/* Corner accent dots */}
        <View style={[logoStyles.cornerDot, { top: -3, left: '50%', marginLeft: -3 }]} />
        <View style={[logoStyles.cornerDot, { bottom: -3, left: '50%', marginLeft: -3 }]} />
        <View style={[logoStyles.cornerDot, { left: -3, top: '50%', marginTop: -3 }]} />
        <View style={[logoStyles.cornerDot, { right: -3, top: '50%', marginTop: -3 }]} />

        {/* Inner content — rotated back to upright */}
        <View style={logoStyles.diamondInner}>
          {/* N letterform — three rectangles */}
          <View style={logoStyles.nWrap}>
            {/* Left bar */}
            <View style={logoStyles.nBarLeft} />
            {/* Diagonal — rotated rectangle */}
            <View style={logoStyles.nDiag} />
            {/* Right bar */}
            <View style={logoStyles.nBarRight} />
          </View>
        </View>
      </View>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width, height,
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separatorWrap: {
    width: 80,
    alignItems: 'center',
    marginVertical: 24,
  },
  separator: {
    width: 80,
    height: 1,
    backgroundColor: GOLD,
  },
  wordmark: {
    color: WHITE,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 14,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Menlo',
    marginLeft: 14, // visual compensation for tracking
  },
  subtitle: {
    color: BLUE,
    fontSize: 10,
    fontWeight: '300',
    letterSpacing: 8,
    marginLeft: 8,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Menlo',
  },
  dotRow: {
    position: 'absolute',
    bottom: height * 0.14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: MUTED,
  },
  dotActive: {
    backgroundColor: GOLD,
  },
  footer: {
    position: 'absolute',
    bottom: height * 0.07,
    color: OMNORA,
    fontSize: 11,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'android' ? 'monospace' : 'Menlo',
  },
});

const DIAMOND_SIZE = 88;
const BAR_W = 3.5;
const BAR_H = 30;
const DIAG_W = 3;
const DIAG_H = 36;

const logoStyles = StyleSheet.create({
  container: {
    width: DIAMOND_SIZE + 24,
    height: DIAMOND_SIZE + 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diamondOuter: {
    width: DIAMOND_SIZE,
    height: DIAMOND_SIZE,
    borderWidth: 1.5,
    borderColor: GOLD,
    transform: [{ rotate: '45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cornerDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: GOLD,
  },
  diamondInner: {
    transform: [{ rotate: '-45deg' }],
    width: DIAMOND_SIZE - 16,
    height: DIAMOND_SIZE - 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nWrap: {
    width: 34,
    height: BAR_H,
    flexDirection: 'row',
    alignItems: 'flex-start',
    position: 'relative',
    justifyContent: 'space-between',
  },
  nBarLeft: {
    width: BAR_W,
    height: BAR_H,
    backgroundColor: GOLD,
    borderRadius: 1,
  },
  nBarRight: {
    width: BAR_W,
    height: BAR_H,
    backgroundColor: GOLD,
    borderRadius: 1,
  },
  nDiag: {
    position: 'absolute',
    width: DIAG_W,
    height: DIAG_H,
    backgroundColor: GOLD,
    borderRadius: 1,
    left: '50%',
    marginLeft: -DIAG_W / 2,
    top: -3,
    transform: [{ rotate: '25deg' }],
  },
});
