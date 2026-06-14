import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * SAFE STORAGE HELPER
 * Prevents crashes on storage lookup by catching faults and supplying fallbacks.
 */
export async function getSafeStorage(key: string, fallback: string | null = null): Promise<string | null> {
  try {
    const val = await AsyncStorage.getItem(key);
    return val !== null ? val : fallback;
  } catch (error) {
    console.error(`[getSafeStorage] Failed to read key: ${key}`, error);
    return fallback;
  }
}
