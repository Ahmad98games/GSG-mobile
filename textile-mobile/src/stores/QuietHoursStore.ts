import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface QuietHoursState {
  enabled: boolean;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  timezone: string;
  
  // Cache for performance (TTL 60s)
  _cache: {
    lastCheckedAt: number;
    lastResult: boolean;
  };
  
  // Actions
  setQuietHours: (start: { hour: number; minute: number }, end: { hour: number; minute: number }) => void;
  setEnabled: (enabled: boolean) => void;
  setTimezone: (tz: string) => void;
  
  // Computed
  isQuietHoursActive: () => boolean;
}

/**
 * QUIET HOURS STORE
 * Manages notification suppression windows with timezone awareness.
 * Persisted to AsyncStorage for industrial shift consistency.
 */
export const useQuietHoursStore = create<QuietHoursState>()(
  persist(
    (set, get) => ({
      enabled: true,
      startHour: 23,
      startMinute: 0,
      endHour: 6,
      endMinute: 0,
      timezone: 'Asia/Karachi',
      _cache: {
        lastCheckedAt: 0,
        lastResult: false,
      },

      setQuietHours: (start, end) => set({
        startHour: start.hour,
        startMinute: start.minute,
        endHour: end.hour,
        endMinute: end.minute,
      }),

      setEnabled: (enabled) => set({ enabled }),

      setTimezone: (tz) => set({ timezone: tz }),

      isQuietHoursActive: () => {
        const state = get();
        if (!state.enabled) return false;

        const nowMs = Date.now();
        // Return cached result if fresh (< 60s)
        if (nowMs - state._cache.lastCheckedAt < 60000) {
          return state._cache.lastResult;
        }

        try {
          const now = new Date();
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: state.timezone,
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
          });

          const parts = formatter.formatToParts(now);
          const hourPart = parts.find(p => p.type === 'hour');
          const minutePart = parts.find(p => p.type === 'minute');

          if (!hourPart || !minutePart) return false;

          const currentHour = parseInt(hourPart.value, 10);
          const currentMinute = parseInt(minutePart.value, 10);

          const startTotal = state.startHour * 60 + state.startMinute;
          const endTotal = state.endHour * 60 + state.endMinute;
          const currentTotal = currentHour * 60 + currentMinute;

          let result = false;
          if (startTotal > endTotal) {
            result = currentTotal >= startTotal || currentTotal <= endTotal;
          } else {
            result = currentTotal >= startTotal && currentTotal <= endTotal;
          }

          // Update cache (bypass persist by using partial state if needed, 
          // but here we just update the internal state)
          set({ 
            _cache: { 
              lastCheckedAt: nowMs, 
              lastResult: result 
            } 
          });

          return result;
        } catch (e) {
          console.error('[QuietHoursStore] Timezone logic failed:', e);
          return false;
        }
      },
    }),
    {
      name: 'quiet_hours_config',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const { _cache, ...rest } = state;
        return rest;
      },
    }
  )
);
