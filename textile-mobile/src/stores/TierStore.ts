import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type Tier = 'lite' | 'pro' | 'elite'

interface MobileTierStore {
  tier: Tier
  expiresAt: string | null
  
  // Feature flags (mirror Hub)
  aiCctvDetection: boolean
  whatsappAutoAlerts: boolean
  customerPortal: boolean
  recurringInvoices: boolean
  staffUsers: boolean
  batchTracking: boolean
  maxMobileDevices: number
  lensScansPerDay: number | null
  
  setTierFromHub: (tierData: {
    tier: Tier
    expiresAt: string
    limits: Record<string, unknown>
  }) => void
  
  hasFeature: (feature: string) => boolean
}

const MOBILE_TIER_FEATURES: Record<Tier, Record<string, unknown>> = {
  lite: {
    aiCctvDetection: false,
    whatsappAutoAlerts: false,
    customerPortal: false,
    recurringInvoices: false,
    staffUsers: false,
    batchTracking: false,
    maxMobileDevices: 5,
    lensScansPerDay: 5,
  },
  pro: {
    aiCctvDetection: true,
    whatsappAutoAlerts: true,
    customerPortal: true,
    recurringInvoices: true,
    staffUsers: true,
    batchTracking: true,
    maxMobileDevices: 15,
    lensScansPerDay: null,
  },
  elite: {
    aiCctvDetection: true,
    whatsappAutoAlerts: true,
    customerPortal: true,
    recurringInvoices: true,
    staffUsers: true,
    batchTracking: true,
    maxMobileDevices: 999,
    lensScansPerDay: null,
  },
}

export const useTierStore = create<MobileTierStore>()(
  persist(
    (set, get) => ({
      tier: 'lite',
      expiresAt: null,
      aiCctvDetection: false,
      whatsappAutoAlerts: false,
      customerPortal: false,
      recurringInvoices: false,
      staffUsers: false,
      batchTracking: false,
      maxMobileDevices: 5,
      lensScansPerDay: 5,
      
      setTierFromHub: (tierData) => {
        const features = MOBILE_TIER_FEATURES[tierData.tier as Tier] || MOBILE_TIER_FEATURES.lite
        set({
          tier: tierData.tier as Tier,
          expiresAt: tierData.expiresAt,
          ...features as any,
        })
      },
      
      hasFeature: (feature) => {
        const val = (get() as any)[feature]
        return typeof val === 'boolean'
          ? val
          : val !== null && val !== undefined
      },
    }),
    {
      name: 'noxis-mobile-tier',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
)
