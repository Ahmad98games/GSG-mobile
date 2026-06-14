import React from 'react';
import { Tabs } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { LayoutDashboard, Scan, MessageSquare, Bell, Menu } from 'lucide-react-native';
import { View, StyleSheet } from 'react-native';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { canAccessTab } from '../../../src/lib/auth/rolePermissions';

export default function TabsLayout() {
  const { userRole } = useBridgeStatus();

  return (
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
          title: 'DASHBOARD',
          href: canAccessTab(userRole, 'index') ? undefined : null as any,
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'SCAN',
          href: canAccessTab(userRole, 'scan') ? undefined : null as any,
          tabBarIcon: ({ color, size }) => <Scan color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="lens"
        options={{
          title: 'LENS',
          href: canAccessTab(userRole, 'lens') ? undefined : null as any,
          tabBarIcon: ({ color, size }) => <View style={{ width: size + 4, height: size + 4, borderRadius: (size + 4) / 2, backgroundColor: THEME.colors.blue + '20', justifyContent: 'center', alignItems: 'center' }}><Scan color={color} size={size} strokeWidth={2.5} /></View>,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'MESSAGES',
          href: canAccessTab(userRole, 'messages') ? undefined : null as any,
          tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'ALERTS',
          href: canAccessTab(userRole, 'alerts') ? undefined : null as any,
          tabBarIcon: ({ color, size }) => <Bell color={color} size={size} strokeWidth={2.5} />,
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'MORE',
          href: canAccessTab(userRole, 'more') ? undefined : null as any,
          tabBarIcon: ({ color, size }) => <Menu color={color} size={size} strokeWidth={2.5} />,
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: THEME.colors.bg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    height: 75,
    paddingBottom: 15,
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
    opacity: 0.98,
  }
});
