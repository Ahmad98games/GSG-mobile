import React from 'react'
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native'
import { Phone, MessageCircle } from 'lucide-react-native'
import { useTierStore } from '@/stores/TierStore'
import { useBridgeStatus as useBridgeStatusStore } from '@/store/BridgeStatusStore'
import { openWhatsApp } from '../../utils/whatsapp'

interface PartyActionsProps {
  name: string
  phone: string
  balance?: number
  currency?: string
  type: 'customer' | 'supplier' | 'karigar'
}

export function PartyActions({
  name, phone, balance, currency = 'PKR', type
}: PartyActionsProps) {
  const { tier } = useTierStore()
  const { ownerWhatsApp, businessName: storeBusinessName } = useBridgeStatusStore()
  
  // Format phone for Pakistan and international
  const formatPhone = (p: string): string => {
    // Remove all non-digits
    const digits = p.replace(/[^0-9]/g, '')
    
    // Pakistan numbers
    if (digits.startsWith('03') &&
        digits.length === 11) {
      return '92' + digits.slice(1)
    }
    // Already has country code
    if (digits.length > 11) return digits
    // Default: return as-is
    return digits
  }
  
  const handleCall = () => {
    const url = `tel:${phone}`
    Linking.canOpenURL(url).then(can => {
      if (can) {
        Linking.openURL(url)
      } else {
        Alert.alert('Cannot make call',
          'Phone calling is not available')
      }
    })
  }

  const handleWhatsApp = () => {
    const BRAND_FOOTER = '\n\n─────────────────\n🔒 Noxis Hub | Omnora Labs\nnoxishub.app'
    
    // Generate contextual message based on type
    let message = ''
    
    if (type === 'customer' && balance && balance > 0) {
      message = `Assalam o Alaikum ${name},\n\nYou have an outstanding balance of ${currency} ${balance.toLocaleString()} with us.\n\nPlease arrange payment at your earliest convenience.\n\nThank you for your business.`
    } else if (type === 'supplier') {
      message = `Assalam o Alaikum ${name},\n\nRegarding our account with you. Please contact us to discuss.`
    } else if (type === 'karigar') {
      message = `Assalam o Alaikum ${name},\n\nRegarding your account with ${currency} ${Math.abs(balance || 0).toLocaleString()} outstanding.\n\nPlease contact us.`
    } else {
      message = `Assalam o Alaikum ${name},\n\nPlease contact us regarding your account.`
    }
    
    message += BRAND_FOOTER
    
    const targetPhone = phone || ownerWhatsApp
    openWhatsApp(targetPhone, message)
  }
  
  if (!phone) return null
  
  return (
    <View style={{
      flexDirection: 'row',
      gap: 8,
      marginTop: 12,
      marginBottom: 12,
    }}>
      {/* Direct Call */}
      <TouchableOpacity
        onPress={handleCall}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          backgroundColor: 'rgba(16,185,129,0.1)',
          borderWidth: 1,
          borderColor: 'rgba(16,185,129,0.3)',
          borderRadius: 6,
          paddingVertical: 12,
        }}
      >
        <Phone size={16} color="#10B981" />
        <Text style={{
          color: '#10B981',
          fontSize: 13,
          fontWeight: '600',
        }}>
          Direct Call
        </Text>
      </TouchableOpacity>
      
      {/* WhatsApp Reminder */}
      <TouchableOpacity
        onPress={handleWhatsApp}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          backgroundColor: 'rgba(37,211,102,0.1)',
          borderWidth: 1,
          borderColor: 'rgba(37,211,102,0.3)',
          borderRadius: 6,
          paddingVertical: 12,
        }}
      >
        <MessageCircle size={16} color="#25D366" />
        <Text style={{
          color: '#25D366',
          fontSize: 13,
          fontWeight: '600',
        }}>
          WhatsApp Reminder
        </Text>
      </TouchableOpacity>
    </View>
  )
}
