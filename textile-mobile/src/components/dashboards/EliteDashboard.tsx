import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  interpolateColor
} from 'react-native-reanimated';
import { THEME } from '../../constants/DesignSystem';
import { Eye, ShieldCheck, Zap, Activity, AlertTriangle, Bell } from 'lucide-react-native';
import { PresenceGrid } from '../shell/PresenceGrid';

const { width } = Dimensions.get('window');

export const EliteDashboard = () => {
  const glowValue = useSharedValue(0);

  useEffect(() => {
    glowValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2000 }),
        withTiming(0, { duration: 2000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedGlow = useAnimatedStyle(() => {
    'worklet';
    return {
      borderColor: interpolateColor(
        glowValue.value,
        [0, 1],
        [THEME.colors.border, THEME.colors.gold]
      ),
      shadowOpacity: glowValue.value * 0.5,
      shadowColor: THEME.colors.gold,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 0 },
    };
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Elite Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eliteTitle}>OMNORA ELITE</Text>
            <Text style={styles.visionCenter}>Vision Center v9.0</Text>
          </View>
          <View style={styles.statusGroup}>
            <Activity color={THEME.colors.status.success} size={14} />
            <Text style={styles.liveBadge}>LIVE FEED</Text>
          </View>
        </View>

        {/* Vision Feed Mockup */}
        <Animated.View style={[styles.visionCard, animatedGlow]}>
          <View style={styles.visionHeader}>
             <View style={styles.reticleRow}>
               <Eye color={THEME.colors.gold} size={16} />
               <Text style={styles.visionHeaderText}>NEURAL ANALYTICS ACTIVE</Text>
             </View>
             <Text style={styles.timestamp}>18:01:20:44</Text>
          </View>
          
          <View style={styles.mockFeed}>
             <View style={styles.feedOverlay}>
               <View style={styles.targetBox}>
                  <Text style={styles.targetLabel}>BATCH_889 [OK]</Text>
               </View>
             </View>
             <View style={styles.dataStrip}>
               <Text style={styles.dataText}>FPS: 45.2 | LATENCY: 12ms | CONF: 99.4%</Text>
             </View>
          </View>
        </Animated.View>

        {/* Live Alerts */}
        <View style={styles.sectionHeaderRow}>
          <Bell color={THEME.colors.gold} size={14} />
          <Text style={styles.sectionHeader}>PRIORITY ALERTS</Text>
        </View>

        <View style={styles.alertItem}>
          <View style={styles.alertIconBg}>
            <AlertTriangle color={THEME.colors.status.danger} size={18} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Anomaly Detected: Loom #04</Text>
            <Text style={styles.alertSub}>Heat signature exceeding 85°C. Cooling initiated.</Text>
          </View>
          <Text style={styles.alertTime}>2m ago</Text>
        </View>

        <View style={styles.alertItem}>
          <View style={[styles.alertIconBg, { backgroundColor: 'rgba(96, 165, 250, 0.1)' }]}>
            <ShieldCheck color={THEME.colors.blue} size={18} />
          </View>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Security Protocol Alpha</Text>
            <Text style={styles.alertSub}>Perimeter sync complete. All nodes verified.</Text>
          </View>
          <Text style={styles.alertTime}>15m ago</Text>
        </View>

        {/* Presence Grid */}
        <PresenceGrid />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070A',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  eliteTitle: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 4,
  },
  visionCenter: {
    color: '#fff',
    fontFamily: THEME.fonts.interBold,
    fontSize: 26,
    marginTop: 4,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(52, 211, 153, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  liveBadge: {
    color: THEME.colors.status.success,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 8,
  },
  visionCard: {
    backgroundColor: '#0D1117',
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
    marginBottom: 32,
    elevation: 10,
  },
  visionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(197, 160, 89, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(197, 160, 89, 0.1)',
  },
  reticleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  visionHeaderText: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 8,
    letterSpacing: 1,
  },
  timestamp: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.mono,
    fontSize: 8,
  },
  mockFeed: {
    height: 200,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
  },
  targetBox: {
    width: 120,
    height: 80,
    borderWidth: 1,
    borderColor: THEME.colors.status.success,
    padding: 4,
    backgroundColor: 'rgba(52, 211, 153, 0.05)',
  },
  targetLabel: {
    color: THEME.colors.status.success,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 8,
  },
  dataStrip: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 6,
    alignItems: 'center',
  },
  dataText: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.mono,
    fontSize: 7,
    letterSpacing: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionHeader: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 2,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 12,
  },
  alertIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
    marginLeft: 16,
  },
  alertTitle: {
    color: '#fff',
    fontFamily: THEME.fonts.interBold,
    fontSize: 14,
  },
  alertSub: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.inter,
    fontSize: 11,
    marginTop: 2,
  },
  alertTime: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.mono,
    fontSize: 9,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  gridItem: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  gridValue: {
    color: '#fff',
    fontFamily: THEME.fonts.monoBold,
    fontSize: 18,
    marginTop: 8,
  },
  gridLabel: {
    color: THEME.colors.text.muted,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 8,
    marginTop: 4,
    letterSpacing: 1,
  }
});
