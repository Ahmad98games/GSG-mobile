import React from 'react';
import { Tabs } from 'expo-router';
import { THEME } from '../../src/constants/theme';
import { Activity, Eye, Zap } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { registerChannels } from '../../src/lib/notifications/NotificationChannels';
import { BrandWatermark } from '@/components/ui/BrandWatermark';

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
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: THEME.colors.blue,
          tabBarInactiveTintColor: THEME.colors.textSecondary,
          tabBarLabelStyle: styles.tabLabel,
          tabBarBackground: () => (
            <View style={styles.tabBackground} />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'HEALTH',
            tabBarIcon: ({ color, size }) => <Activity color={color} size={size} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="vision"
          options={{
            title: 'VISION',
            tabBarIcon: ({ color, size }) => <Eye color={color} size={size} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="command"
          options={{
            title: 'COMMAND',
            tabBarIcon: ({ color, size }) => <Zap color={color} size={size} strokeWidth={2.5} />,
          }}
        />
        {/* Hide existing screens that are not part of the main tabs */}
        <Tabs.Screen name="dashboard" options={{ href: null }} />
        <Tabs.Screen name="executive" options={{ href: null }} />
        <Tabs.Screen name="diagnostics" options={{ href: null }} />
        <Tabs.Screen name="dispatch/index" options={{ href: null }} />
      </Tabs>
      <BrandWatermark />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.colors.bg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    height: 70,
    paddingBottom: 10,
    paddingTop: 5,
  },
  tabLabel: {
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 2,
  },
  tabBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: THEME.colors.bg,
    opacity: 0.95,
  }
});
