import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useBridgeStatus } from '../../store/BridgeStatusStore';
import { useMessageStore } from '../../store/MessageStore'; // Assuming this exists or will exist
import { Ionicons } from '@expo/vector-icons';

/**
 * BRIDGE STATUS BAR
 * Persistent status indicator for Hub connectivity.
 */
export const BridgeStatusBar: React.FC = () => {
  const router = useRouter();
  const { connectionState, reconnectAttempts, pairedDeviceCount } = useBridgeStatus();
  const queuedCount = 0; // Will be connected to MessageService/SQLite later

  const getStatusConfig = () => {
    switch (connectionState) {
      case 'connected':
        return {
          label: `Connected — ${pairedDeviceCount} devices online`,
          color: '#10B981',
          icon: 'radio-button-on' as const,
        };
      case 'reconnecting':
        return {
          label: `Reconnecting... attempt ${reconnectAttempts}`,
          color: '#F59E0B',
          icon: 'sync' as const,
        };
      case 'offline':
      default:
        return {
          label: `Offline — ${queuedCount} messages queued`,
          color: '#EF4444',
          icon: 'close-circle' as const,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <TouchableOpacity 
      style={[styles.container, { borderBottomColor: config.color }]} 
      onPress={() => router.push('/(app)/diagnostics')}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Ionicons name={config.icon} size={14} color={config.color} style={styles.icon} />
        <Text style={[styles.text, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 36,
    backgroundColor: '#121417',
    borderBottomWidth: 2,
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
