import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Lock } from 'lucide-react-native'
import { useTierStore } from '../../stores/TierStore'
import { THEME } from '../../constants/theme'

interface FeatureLockProps {
  feature: string
  children: React.ReactNode
  requiredTier?: 'pro' | 'elite'
}

export function FeatureLock({
  feature, children, requiredTier = 'pro'
}: FeatureLockProps) {
  const { hasFeature } = useTierStore()
  
  if (hasFeature(feature)) {
    return <>{children}</>
  }
  
  return (
    <View style={styles.lockContainer}>
      <View style={styles.lockBox}>
        <Lock
          size={32}
          color="#C5A059"
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.lockTitle}>
          {getFeatureDisplayName(feature)}
        </Text>
        <Text style={styles.lockSubtitle}>
          This feature is available on {requiredTier.toUpperCase()} and above.
        </Text>
        
        <TouchableOpacity
          style={styles.upgradeBtn}
          onPress={() => {
            // In a real app, this would open the billing portal
          }}
        >
          <Text style={styles.upgradeBtnText}>
            Upgrade to {requiredTier.toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

function getFeatureDisplayName(f: string): string {
  const names: Record<string, string> = {
    aiCctvDetection: 'AI Camera Detection',
    whatsappAutoAlerts: 'WhatsApp Auto Alerts',
    customerPortal: 'Customer Portal',
    batchTracking: 'Batch & Lot Tracking',
    lensUnlimited: 'Unlimited Lens Scans',
  }
  return names[f] || f
}

const styles = StyleSheet.create({
  lockContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  lockBox: {
    backgroundColor: '#1A1D21',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(197, 160, 89, 0.3)',
  },
  lockTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: THEME.fonts.monoBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  lockSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: THEME.fonts.mono,
    textAlign: 'center',
    marginBottom: 24,
  },
  upgradeBtn: {
    backgroundColor: '#C5A059',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  upgradeBtnText: {
    color: 'black',
    fontSize: 14,
    fontFamily: THEME.fonts.monoBold,
  },
})
