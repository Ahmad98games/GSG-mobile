import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthStore } from '../../src/store/AuthStore';
import { useBridgeStatus } from '../../src/store/BridgeStatusStore';
import { HandshakeScreen } from '../../src/components/HandshakeScreen';
import { EliteDashboard } from '../../src/components/dashboards/EliteDashboard';
import { LiteDashboard } from '../../src/components/dashboards/LiteDashboard';
import { THEME } from '../../src/constants/theme';

/**
 * EXECUTIVE PROTOCOL (v9.0)
 * Tier-aware dashboard with integrated Local Mesh handshake.
 */
export default function ExecutiveScreen() {
  const { nodeTier } = useAuthStore();
  const { connectionState } = useBridgeStatus();
  const [showHandshake, setShowHandshake] = useState(true);

  useEffect(() => {
    // Show handshake for at least 3 seconds or while connecting
    if (connectionState === 'connected') {
      const timer = setTimeout(() => {
        setShowHandshake(false);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowHandshake(true);
    }
  }, [connectionState]);

  if (showHandshake) {
    return <HandshakeScreen />;
  }

  return (
    <View style={styles.container}>
      {nodeTier === 'ELITE' ? <EliteDashboard /> : <LiteDashboard />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
});
