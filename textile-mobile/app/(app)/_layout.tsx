import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { registerChannels } from '../../src/lib/notifications/NotificationChannels';
import { BrandWatermark } from '@/components/ui/BrandWatermark';
import { NoxisTabBar } from '../../src/components/navigation/NoxisTabBar';
import { HubStatusBar } from '../../src/components/HubStatusBar';

/**
 * NOXIS SENTINEL — TACTICAL NAVIGATION
 * High-performance bottom navigation with industrial aesthetics.
 */
export default function AppLayout() {
  React.useEffect(() => {
    registerChannels().catch(e => console.error('[AppLayout] Channel registration failed:', e));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <HubStatusBar />
      <Tabs
        tabBar={props => <NoxisTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="karigars" />
        <Tabs.Screen name="production" />
        <Tabs.Screen name="attendance" />
        <Tabs.Screen name="settings" />

        {/* Hide other utility/hidden screens in the bottom bar */}
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen name="vision" options={{ href: null }} />
        <Tabs.Screen name="command" options={{ href: null }} />
        <Tabs.Screen name="executive" options={{ href: null }} />
        <Tabs.Screen name="diagnostics" options={{ href: null }} />
        <Tabs.Screen name="scanner" />
      </Tabs>
      <BrandWatermark />
    </View>
  );
}

