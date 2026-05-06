import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';

const BACKGROUND_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export function useBiometricShield() {
  const backgroundedAt = useRef<number | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (appState.current === 'active' && nextState.match(/inactive|background/)) {
        backgroundedAt.current = Date.now();
      }

      if (nextState === 'active' && appState.current.match(/inactive|background/)) {
        const timeInBackground = backgroundedAt.current
          ? Date.now() - backgroundedAt.current
          : Infinity;

        if (timeInBackground > BACKGROUND_TIMEOUT_MS) {
          const hasHardware = await LocalAuthentication.hasHardwareAsync();
          const isEnrolled = await LocalAuthentication.isEnrolledAsync();

          if (hasHardware && isEnrolled) {
            const result = await LocalAuthentication.authenticateAsync({
              promptMessage: 'Verify identity to continue',
              cancelLabel: 'Lock app',
              fallbackLabel: 'Use PIN',
            });

            if (!result.success) {
              // Failed — navigate to lock screen
              router.replace('/(auth)/pairing');
            }
          }
        }
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);
}
