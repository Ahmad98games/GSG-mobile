import React, { useEffect, useRef, useState } from 'react'
import {
  View, Text, StyleSheet, Animated,
  TouchableOpacity,
} from 'react-native'
import { useBridgeStatusStore } from '@/src/stores/BridgeStatusStore'
import { router } from 'expo-router'

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCountdown(nextRetryAt: number | null): string {
  if (!nextRetryAt) return ''
  const remaining = Math.max(0, Math.ceil((nextRetryAt - Date.now()) / 1000))
  if (remaining === 0) return ''
  if (remaining < 60) return `retry in ${remaining}s`
  return `retry in ${Math.ceil(remaining / 60)}m`
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HubStatusBar() {
  const {
    hubOnline,
    businessName,
    tier,
    syncStatus,
    connectionMethod,
    connectionStatus,
    pendingCount,
    reconnectAttempt,
    nextRetryAt,
  } = useBridgeStatusStore()

  const pulseAnim  = useRef(new Animated.Value(1)).current
  const bannerAnim = useRef(new Animated.Value(0)).current
  const [showBanner, setShowBanner] = useState(false)

  // Live countdown ticker — only active while waiting for reconnect
  const [, tick] = useState(0)
  useEffect(() => {
    if (!hubOnline && nextRetryAt) {
      const id = setInterval(() => tick((n) => n + 1), 1000)
      return () => clearInterval(id)
    }
  }, [hubOnline, nextRetryAt])

  // Pulse animation when online
  useEffect(() => {
    if (hubOnline) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.4, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1,   duration: 1200, useNativeDriver: true }),
        ])
      )
      pulse.start()
      return () => pulse.stop()
    } else {
      pulseAnim.setValue(1)
    }
  }, [hubOnline])

  // Pending sync banner slide
  useEffect(() => {
    if (pendingCount > 0 && !showBanner) {
      setShowBanner(true)
      Animated.timing(bannerAnim, {
        toValue: 30, duration: 200, useNativeDriver: false,
      }).start()
    } else if (pendingCount === 0 && showBanner) {
      Animated.timing(bannerAnim, {
        toValue: 0, duration: 200, useNativeDriver: false,
      }).start(() => setShowBanner(false))
    }
  }, [pendingCount])

  // ── Derive display values ──────────────────────────────────────────────────
  const isConnecting = connectionStatus === 'connecting'

  const dotColor =
    hubOnline      ? '#10B981' :
    isConnecting   ? '#F59E0B' :
    reconnectAttempt > 0 ? '#F59E0B' :
                     '#374151'

  const statusLabel =
    hubOnline      ? 'Hub Online' :
    isConnecting   ? 'Connecting…' :
    reconnectAttempt > 0 ? `Offline (attempt ${reconnectAttempt})` :
                     'Hub Offline'

  const countdownLabel = !hubOnline ? formatCountdown(nextRetryAt) : ''

  const methodLabel =
    hubOnline && connectionMethod === 'local'  ? 'local WiFi' :
    hubOnline && connectionMethod === 'tunnel' ? 'via tunnel' :
    null

  const methodColor =
    connectionMethod === 'local'  ? '#10B981' :
    connectionMethod === 'tunnel' ? '#60A5FA' :
    '#6B7280'

  const bannerColor =
    hubOnline ? '#C5A059' : '#EF4444'

  const bannerBg =
    hubOnline ? 'rgba(197,160,89,0.10)' : 'rgba(239,68,68,0.08)'

  const bannerBorder =
    hubOnline ? 'rgba(197,160,89,0.20)' : 'rgba(239,68,68,0.15)'

  const bannerLabel =
    hubOnline
      ? `${pendingCount} action${pendingCount > 1 ? 's' : ''} syncing…`
      : `${pendingCount} action${pendingCount > 1 ? 's' : ''} pending sync`

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View>
      {/* Main status bar */}
      <View style={styles.bar}>

        {/* Left: connection dot + label */}
        <TouchableOpacity
          style={styles.left}
          activeOpacity={0.7}
          onPress={() => !hubOnline && router.push('/(auth)/pair')}
        >
          <View style={styles.dotWrapper}>
            <View style={[styles.dotOuter, { backgroundColor: dotColor + '25' }]}>
              <Animated.View style={[
                styles.dotInner,
                { backgroundColor: dotColor, transform: [{ scale: pulseAnim }] },
              ]} />
            </View>
          </View>

          <View>
            <Text style={[styles.statusText, { color: dotColor }]}>
              {statusLabel}
            </Text>
            {methodLabel && (
              <Text style={[styles.subText, { color: methodColor }]}>
                {methodLabel}
              </Text>
            )}
            {!hubOnline && countdownLabel !== '' && (
              <Text style={[styles.subText, { color: '#6B7280' }]}>
                {countdownLabel}
              </Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Center: business name */}
        <Text style={styles.businessName} numberOfLines={1}>
          {businessName}
        </Text>

        {/* Right: tier badge */}
        <View style={styles.right}>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>
              {tier.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Pending sync banner — slides in when items are queued */}
      {showBanner && (
        <Animated.View style={[
          styles.syncBanner,
          {
            height: bannerAnim,
            backgroundColor: bannerBg,
            borderBottomColor: bannerBorder,
          },
        ]}>
          <Text style={[styles.syncText, { color: bannerColor }]}>
            {bannerLabel}
          </Text>
        </Animated.View>
      )}
    </View>
  )
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1114',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  dotWrapper: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotOuter: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotInner: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subText: {
    fontSize: 9,
    opacity: 0.7,
    marginTop: 1,
  },
  businessName: {
    flex: 2,
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
  },
  tierBadge: {
    backgroundColor: 'rgba(197,160,89,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(197,160,89,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
  },
  tierText: {
    color: '#C5A059',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  syncBanner: {
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  syncText: {
    fontSize: 10,
    fontWeight: '500',
  },
})
