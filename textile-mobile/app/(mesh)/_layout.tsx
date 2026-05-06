/**
 * ══════════════════════════════════════════════════════════
 * FILE LOCATION:  app/(mesh)/_layout.tsx
 * ACTION:         NEW — create this file AND the (mesh)/ folder inside app/
 * ══════════════════════════════════════════════════════════
 *
 * Expo Router layout for the (mesh) route group.
 * Route group means the folder name (mesh) is NOT in the URL.
 *
 * Screens in this group:
 *   /messenger  → app/(mesh)/messenger.tsx
 *   /pair       → app/(mesh)/pair.tsx
 */

import { Stack } from 'expo-router';

export default function MeshLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle:     { backgroundColor: '#161B22' },
        headerTintColor: '#E6EDF3',
        headerTitleStyle: { fontWeight: '700', fontSize: 16 },
        contentStyle:    { backgroundColor: '#0D1117' },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="messenger"
        options={{ title: 'Tactical Messenger', headerShown: true }}
      />
      <Stack.Screen
        name="pair"
        options={{ title: 'Connect to Hub', headerShown: true, presentation: 'modal' }}
      />
    </Stack>
  );
}
