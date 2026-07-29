import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const DEVICE_ID_KEY = 'noxis_device_id'

export async function getOrCreateDeviceId(): Promise<string> {
  try {
    const existing = await AsyncStorage.getItem(DEVICE_ID_KEY)
    if (existing) return existing

    // Generate a stable device ID
    // that survives app updates but
    // not uninstall-reinstall cycles
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).slice(2, 8)
    const platform = Platform.OS.slice(0, 3)
    const newId = `nox_${platform}_${timestamp}_${random}`

    await AsyncStorage.setItem(DEVICE_ID_KEY, newId)
    return newId
  } catch {
    // Fallback if AsyncStorage fails
    return `nox_fallback_${Date.now().toString(36)}`
  }
}

export async function getDeviceLabel(): Promise<string> {
  try {
    const stored = await AsyncStorage.getItem('noxis_device_label')
    if (stored) return stored

    // Default label from device info
    const label = `${Platform.OS === 'android' ? 'Android' : 'iOS'} Device`
    return label
  } catch {
    return 'Mobile Device'
  }
}

export async function setDeviceLabel(label: string): Promise<void> {
  await AsyncStorage.setItem('noxis_device_label', label)
}
