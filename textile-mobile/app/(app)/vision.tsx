import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Stack } from 'expo-router';
import { THEME } from '../../src/constants/theme';
import { useVisionStore } from '../../src/store/VisionStore';
import { Eye, AlertTriangle, Activity, Camera } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, withRepeat, withSequence, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

export default function VisionScreen() {
  const { nodes, criticalAlert, subscribeToTelemetry, acknowledgeAlert, fetchTelemetry, isLoading } = useVisionStore();
  
  const primaryNode = nodes[0] || {
    node_id: 'unknown',
    camera_model: 'SEARCHING...',
    bitrate_mbps: 0,
    latency_ms: 0,
    status: 'NOMINAL'
  };

  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    fetchTelemetry();
    const unsubscribe = subscribeToTelemetry();
    
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );

    return () => unsubscribe();
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: criticalAlert ? pulseOpacity.value : 1,
  }));

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Vision Feed', 
        headerStyle: { backgroundColor: THEME.colors.bg }, 
        headerTintColor: 'white',
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 12 }
      }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>VISION_SENTINEL</Text>
          <View style={styles.liveBadge}>
            <Animated.View style={[styles.liveDot, pulseStyle]} />
            <Text style={styles.liveText}>LIVE_FEED</Text>
          </View>
        </View>

        {/* CCTV FEED PLACEHOLDER */}
        <View style={[styles.feedContainer, criticalAlert && styles.feedAlertBorder]}>
          <View style={styles.feedOverlay}>
            <View style={styles.feedInfo}>
              <Text style={styles.modelName}>{primaryNode.camera_model}</Text>
              <Text style={styles.feedMeta}>{primaryNode.bitrate_mbps.toFixed(2)} Mbps | {primaryNode.latency_ms}ms</Text>
            </View>
            <TouchableOpacity style={styles.expandBtn} onPress={fetchTelemetry}>
              <Activity size={16} color="white" />
            </TouchableOpacity>
          </View>
          {/* Mock image for industrial look */}
          <View style={styles.placeholderFeed}>
            <Eye size={48} color={THEME.colors.border} />
            <Text style={styles.placeholderText}>ENCRYPTED_STREAM_ACTIVE</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Activity size={16} color={THEME.colors.blue} />
            <View>
              <Text style={styles.statLabel}>BITRATE_STABILITY</Text>
              <Text style={styles.statValue}>98.2%</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <AlertTriangle size={16} color={criticalAlert ? THEME.colors.critical : THEME.colors.gold} />
            <View>
              <Text style={styles.statLabel}>AI_DETECTION</Text>
              <Text style={styles.statValue}>ENABLED</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={fetchTelemetry}
        >
          <Text style={styles.actionText}>SYNC_HARDWARE_INTEGRITY</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* CRITICAL OVERLAY */}
      {criticalAlert && (
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut}
          style={styles.criticalOverlay}
        >
          <AlertTriangle size={64} color="white" />
          <Text style={styles.criticalTitle}>CRITICAL_ALERT</Text>
          <Text style={styles.criticalSubtitle}>HARDWARE_FAULT_OR_LENS_OBSCURED</Text>
          <Text style={styles.criticalAction}>CHECK_NODE_STATUS_IMMEDIATELY</Text>
          
          <TouchableOpacity 
            style={styles.dismissOverlayBtn}
            onPress={() => acknowledgeAlert(primaryNode.node_id)}
          >
            <Text style={styles.dismissText}>ACKNOWLEDGE_&_LOG_EVENT</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  content: {
    padding: THEME.spacing.md,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: THEME.colors.textPrimary,
    fontSize: 20,
    letterSpacing: 2,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.critical,
    marginRight: 6,
  },
  liveText: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textPrimary,
    fontSize: 8,
    letterSpacing: 1,
  },
  feedContainer: {
    height: 220,
    backgroundColor: '#000',
    borderRadius: THEME.radius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: THEME.colors.border,
    position: 'relative',
  },
  feedAlertBorder: {
    borderColor: THEME.colors.critical,
  },
  placeholderFeed: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#050505',
  },
  placeholderText: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.border,
    fontSize: 10,
    marginTop: 12,
    letterSpacing: 2,
  },
  feedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: THEME.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  feedInfo: {
    flex: 1,
  },
  modelName: {
    fontFamily: THEME.fonts.monoBold,
    color: 'white',
    fontSize: 12,
  },
  feedMeta: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textSecondary,
    fontSize: 10,
  },
  expandBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 8,
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    marginTop: THEME.spacing.md,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    gap: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  statLabel: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textSecondary,
    fontSize: 8,
  },
  statValue: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textPrimary,
    fontSize: 12,
  },
  actionBtn: {
    marginTop: THEME.spacing.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    alignItems: 'center',
  },
  actionText: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
  },
  criticalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: 40,
  },
  criticalTitle: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: 'white',
    fontSize: 28,
    marginTop: 20,
  },
  criticalSubtitle: {
    fontFamily: THEME.fonts.monoBold,
    color: 'white',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.8,
  },
  criticalAction: {
    fontFamily: THEME.fonts.mono,
    color: 'white',
    fontSize: 12,
    marginTop: 24,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    padding: 8,
  },
  dismissOverlayBtn: {
    marginTop: 60,
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  dismissText: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: THEME.colors.critical,
    fontSize: 14,
  }
});
