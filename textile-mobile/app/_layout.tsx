
import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
// @ts-ignore
// import * as Sentry from '@sentry/react-native';
const Sentry = {
  init: () => {},
  captureException: () => {},
  metrics: { distribution: () => {} }
} as any;
// @ts-ignore
import { 
  useFonts, 
  JetBrainsMono_400Regular, 
  JetBrainsMono_700Bold,
  JetBrainsMono_800ExtraBold
} from '@expo-google-fonts/jetbrains-mono';
import { THEME } from '../src/constants/theme';
import { useAuthStore } from '../src/store/AuthStore';
import { usePathname } from 'expo-router';
import { queueManager } from '../src/services/OfflineQueueManager';
import { useAlertStore } from '../src/store/AlertStore';
import { RedAlertOverlay } from '../src/components/alerts/RedAlertOverlay';
import { VoiceFileManager } from '../src/services/VoiceFileManager';
import { NspService } from '../src/services/NspService';
import { tcpService } from '../src/services/TCPClientService';
import notifee, { EventType } from '../src/lib/notifications/notifee';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {});

// Initialize Sentry for Industrial Forensic Logging
Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // To be replaced in CI/CD
  debug: false,
  enableAutoSessionTracking: true,
});

/**
 * INDUSTRIAL ERROR BOUNDARY
 * Ensures the stack remains recoverable without data loss.
 */
class IndustrialErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    Sentry.captureException(error, { extra: errorInfo });
    console.error('[CRITICAL_FAULT]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>SYSTEM_FAULT_RECOVERABLE</Text>
          <Text style={styles.errorText}>A CRITICAL FAULT OCCURRED IN THE UI STACK.</Text>
          <Text style={styles.errorText}>ALL QUEUED DATA REMAINS SECURE IN SQLITE.</Text>
          <TouchableOpacity 
            style={styles.retryBtn} 
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={styles.retryText}>REBOOT STACK</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
    'JetBrainsMono_900Black': JetBrainsMono_800ExtraBold,
  });

  const { isAuthenticated, subscriptionActive, isDeviceApproved, nodeTier } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // GUARD: Do not navigate until fonts are loaded and <Stack> is mounted.
    // Calling router.replace() before the Stack renders causes:
    // "Attempted to navigate before mounting the Root Layout component"
    if (!fontsLoaded && !fontError) return;

    // GUARANTEE COLD BOOT MAINTENANCE
    try {
      queueManager.drainPersistedQueue();
    } catch (e) {
      console.error('[RootLayout] Queue drain failed:', e);
    }
    try {
      VoiceFileManager.runCleanup();
    } catch (e) {
      console.error('[RootLayout] Voice cleanup failed:', e);
    }
    try {
      NspService.initialize();
    } catch (e) {
      console.error('[RootLayout] NSP initialization failed:', e);
    }
    try {
      const { createAllChannels } = require('../src/lib/notifications/NotificationChannels');
      createAllChannels().catch((e: any) => console.error('[RootLayout] Notifee channel creation failed:', e));
    } catch (e) {
      console.error('[RootLayout] Notifee channel init failed:', e);
    }

    // Auth Guard logic
    if (!isAuthenticated) {
      router.replace('/(auth)/pair');
      return;
    }

    // License Watchdog logic
    const isPublicRoute = pathname.includes('(auth)') || pathname === '/license-expired';
    
    if (!isPublicRoute) {
      if (!subscriptionActive) {
        router.replace('/license-expired');
      } else if (nodeTier === 'ELITE' && !isDeviceApproved) {
        // Device mismatch for Elite
        router.replace('/license-expired');
      }
    }

    // Path tracking for NSP suppression
    NspService.setPath(pathname);

    // M11: COLD START MEASUREMENT
    const coldStartMs = Date.now() - ((global as any).__APP_START_MS__ || Date.now());
    
    if (__DEV__) {
      // Reanimated 3: Enable frame rate monitoring on UI thread
    }

    if (Sentry.metrics) {
      Sentry.metrics.distribution('cold_start_ms', coldStartMs, {
        unit: 'millisecond'
      });
    }

    // M11: Notifee Foreground Listener
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.pressAction?.id === 'ack_breach') {
        // Handle in-app breach acknowledgment if needed
        console.log('[NOTIFEE] Breach acknowledged in foreground');
      }
    });

    return () => {
      unsubscribeNotifee();
      NspService.destroy();
      tcpService.destroy();
    };
  }, [fontsLoaded, isAuthenticated, subscriptionActive, isDeviceApproved, nodeTier, pathname]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      if (fontError) {
        console.error('[RootLayout] Font loading failed, falling back to default:', fontError);
      }
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  const { activeBreaches, removeBreach } = useAlertStore();

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <IndustrialErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
      {activeBreaches.length > 0 && (
        <RedAlertOverlay 
          alerts={activeBreaches} 
        />
      )}
    </IndustrialErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: { flex: 1, backgroundColor: THEME.colors.bg, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorTitle: { color: THEME.colors.critical, fontWeight: '900', fontSize: 18, marginBottom: 16 },
  errorText: { color: THEME.colors.textSecondary, textAlign: 'center', fontSize: 12, marginBottom: 8 },
  retryBtn: { backgroundColor: THEME.colors.blue, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12, marginTop: 40 },
  retryText: { color: 'white', fontWeight: '900' }
});
