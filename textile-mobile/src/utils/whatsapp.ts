import { Linking, Alert } from 'react-native';
import { useBridgeStatusStore } from '../store/BridgeStatusStore';

const COUNTRY_PREFIXES: Record<string, string> = {
  PK: '92',
  IN: '91',
  BD: '880',
  US: '1',
  GB: '44',
};

/**
 * DYNAMIC WHATSAPP LINK PARSER
 * Standardizes phone formats and routes messages through WhatsApp or SMS.
 */
export async function openWhatsApp(phone: string, message: string, countryCode?: string): Promise<void> {
  const store = useBridgeStatusStore.getState();
  const cCode = countryCode || store.countryCode || 'PK';
  const prefix = COUNTRY_PREFIXES[cCode.toUpperCase()] || '92';

  const targetPhone = phone || store.ownerWhatsApp || '923334355475';
  let digits = targetPhone.replace(/\D/g, '');

  if (digits.startsWith('0')) {
    digits = prefix + digits.slice(1);
  } else if (digits.length > 0 && !digits.startsWith(prefix)) {
    digits = prefix + digits;
  }

  if (!digits) {
    digits = '923334355475';
  }

  const waUrl = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;

  try {
    const supported = await Linking.canOpenURL(waUrl);
    if (supported) {
      await Linking.openURL(waUrl);
    } else {
      const smsUrl = `sms:${digits}?body=${encodeURIComponent(message)}`;
      const smsSupported = await Linking.canOpenURL(smsUrl);
      if (smsSupported) {
        await Linking.openURL(smsUrl);
      } else {
        Alert.alert('Error', 'No messaging client available on this device.');
      }
    }
  } catch (err) {
    console.error('[openWhatsApp] Failed to open communication URL:', err);
    Alert.alert('Error', 'Failed to open WhatsApp or SMS.');
  }
}
