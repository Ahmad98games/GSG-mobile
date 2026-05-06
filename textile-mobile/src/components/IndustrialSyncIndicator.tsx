import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConnection } from '../store/ConnectionContext';
import { tcpService } from '../services/TCPClientService';

// PILLAR 5 & DESIGN SYSTEM COLORS
const COLORS = {
  bg: '#09090b',         // Deep Onyx
  online: '#84cc16',     // Cyber-Lime
  offline: '#ea580c',    // Deep Orange
  syncing: '#60a5fa',    // Electric Blue
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
};

export const IndustrialSyncIndicator = () => {
  const { status, queueCount, lastSync } = useConnection();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Status-based idle animation
  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    
    if (status === 'SYNCING') {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.6,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }

    return () => animation?.stop();
  }, [status]);

  // Rhythm-based ACK pulse
  useEffect(() => {
    const handleAckPulse = () => {
      // Rapid scale "pop" on each ACK
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.15,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    };

    tcpService.on('syncPulse', handleAckPulse);
    return () => {
      tcpService.off('syncPulse', handleAckPulse);
    };
  }, []);

  const getStatusConfig = useMemo(() => {
    switch (status) {
      case 'CONNECTED':
        return { color: COLORS.online, icon: 'shield-checkmark', label: 'ONLINE' };
      case 'SYNCING':
        return { color: COLORS.syncing, icon: 'sync', label: 'SYNCING' };
      default:
        return { color: COLORS.offline, icon: 'cloud-offline', label: 'OFFLINE' };
    }
  }, [status]);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.indicator, 
          { 
            backgroundColor: getStatusConfig.color, 
            opacity: pulseAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Ionicons name={getStatusConfig.icon as any} size={28} color="white" />
        {queueCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{queueCount}</Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.textContainer}>
        <Text style={styles.statusLabel}>{getStatusConfig.label}</Text>
        {lastSync && (
          <Text style={styles.syncTime}>
            LAST SYNC: {new Date(lastSync).toLocaleTimeString()}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#27272a',
    marginVertical: 12,
    marginHorizontal: 16,
    // PILLAR 5: Minimum touch target size
    minHeight: 80,
  },
  indicator: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  statusLabel: {
    color: COLORS.textPrimary,
    fontWeight: '900',
    fontSize: 20, // Pillar 5: 18px min font
    letterSpacing: 2,
  },
  syncTime: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  }
});

