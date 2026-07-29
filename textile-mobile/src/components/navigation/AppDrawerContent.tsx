import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import {
  useBridgeStatusStore,
  ConnectionState,
} from '@/src/stores/BridgeStatusStore'
import { silentReconnect } from '@/src/services/ConnectionManager'
import { RefreshCw, Wifi, WifiOff, ShieldCheck, User, Database } from 'lucide-react-native'

export function AppDrawerContent() {
  const {
    user,
    connectionState,
    latency,
    hubIp,
    pendingCount,
    reconnectAttempt,
    businessName,
  } = useBridgeStatusStore()

  const [isReconnecting, setIsReconnecting] = useState(false)

  const handleReconnect = async () => {
    setIsReconnecting(true)
    try {
      await silentReconnect()
    } finally {
      setIsReconnecting(false)
    }
  }

  // Determine status badge details based on ConnectionState enum
  const renderStatusCard = () => {
    switch (connectionState) {
      case ConnectionState.CONNECTED_LOCAL:
        return {
          indicatorColor: '#10B981', // Green
          icon: <Wifi size={18} color="#10B981" />,
          title: `Hub Online · WiFi · ${latency}ms`,
          subtitle: hubIp || 'Local LAN Active',
          badgeBg: 'rgba(16, 185, 129, 0.15)',
        }
      case ConnectionState.CONNECTED_REMOTE:
        return {
          indicatorColor: '#10B981', // Green
          icon: <Wifi size={18} color="#10B981" />,
          title: `Hub Online · Remote · ${latency}ms`,
          subtitle: hubIp || 'Cloudflare Tunnel Active',
          badgeBg: 'rgba(16, 185, 129, 0.15)',
        }
      case ConnectionState.CONNECTING:
        return {
          indicatorColor: '#F59E0B', // Yellow
          icon: <ActivityIndicator size="small" color="#F59E0B" />,
          title: `Connecting... (Attempt ${Math.min(reconnectAttempt || 1, 3)}/3)`,
          subtitle: 'Probing LAN & Cloudflare Tunnel...',
          badgeBg: 'rgba(245, 158, 11, 0.15)',
        }
      case ConnectionState.OFFLINE_QUEUED:
        return {
          indicatorColor: '#EF4444', // Red
          icon: <WifiOff size={18} color="#EF4444" />,
          title: `Offline — ${pendingCount} entries queued`,
          subtitle: 'Autonomous Mode · Enqueued locally',
          badgeBg: 'rgba(239, 68, 68, 0.15)',
        }
      case ConnectionState.OFFLINE_EMPTY:
      default:
        return {
          indicatorColor: '#6B7280', // Dark / Gray
          icon: <WifiOff size={18} color="#9CA3AF" />,
          title: 'Hub Offline',
          subtitle: 'Autonomous Standalone Mode',
          badgeBg: 'rgba(107, 114, 128, 0.15)',
        }
    }
  }

  const cardInfo = renderStatusCard()

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* USER PROFILE HEADER */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={24} color="#3B82F6" />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {user.name || 'Operator'}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user.email || 'operator@noxishub.com'}
          </Text>
          <View style={styles.roleBadge}>
            <ShieldCheck size={12} color="#3B82F6" style={{ marginRight: 4 }} />
            <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* DYNAMIC HUB STATUS CARD */}
      <View style={styles.statusCard}>
        <Text style={styles.cardHeaderTitle}>{businessName || 'Noxis PC Hub'}</Text>
        
        <View style={[styles.statusBadge, { backgroundColor: cardInfo.badgeBg }]}>
          <View style={[styles.dotIndicator, { backgroundColor: cardInfo.indicatorColor }]} />
          <Text style={[styles.statusTitle, { color: cardInfo.indicatorColor }]} numberOfLines={1}>
            {cardInfo.title}
          </Text>
        </View>

        <Text style={styles.subtitleText}>{cardInfo.subtitle}</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>IP Address</Text>
            <Text style={styles.metricValue}>{hubIp ? hubIp.replace(/^ws:\/\//, '').replace(/^wss:\/\//, '').split(':')[0] : 'Disconnected'}</Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Latency</Text>
            <Text style={styles.metricValue}>{latency ? `${latency}ms` : 'N/A'}</Text>
          </View>

          <View style={styles.metricItem}>
            <Text style={styles.metricLabel}>Pending Queue</Text>
            <Text style={[styles.metricValue, pendingCount > 0 && { color: '#EF4444' }]}>
              {pendingCount}
            </Text>
          </View>
        </View>

        {/* RECONNECT BUTTON */}
        <TouchableOpacity
          style={styles.reconnectButton}
          onPress={handleReconnect}
          disabled={isReconnecting}
          activeOpacity={0.8}
        >
          {isReconnecting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <RefreshCw size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.reconnectText}>Reconnect Hub</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  roleText: {
    color: '#60A5FA',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#1E293B',
    marginVertical: 16,
  },
  statusCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeaderTitle: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 6,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusTitle: {
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
  subtitleText: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 14,
    marginLeft: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: '#E2E8F0',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  reconnectButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reconnectText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
})
