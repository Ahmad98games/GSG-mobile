import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { THEME } from '../../src/constants/theme';
import { Zap, RefreshCcw, Lock, Palette, ChevronUp, Power, ShieldAlert, Cpu, Crown, LockKeyhole } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/AuthStore';
import { useBridgeStatus } from '../../src/store/BridgeStatusStore';
import * as Haptics from 'expo-haptics';
import { FeatureLock } from '../../src/components/tier/FeatureLock';
import { ScreenHeader } from '../../src/components/navigation/ScreenHeader';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CommandScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { nodeTier, isDeviceApproved } = useAuthStore();
  const { advanceTerm } = useBridgeStatus();
  const drawerY = useSharedValue(SCREEN_HEIGHT);
  
  const isElite = nodeTier === 'ELITE' && isDeviceApproved;

  const toggleDrawer = () => {
    if (!isElite) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    const nextState = !isDrawerOpen;
    setIsDrawerOpen(nextState);
    drawerY.value = withSpring(nextState ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT, {
      stiffness: 250,
      damping: 30,
      mass: 1,
    });
  };

  const drawerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: drawerY.value }],
  }));

  const QuickAction = ({ icon: Icon, label, color, onPress }: any) => (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <Icon size={24} color={color} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        headerShown: false, title: 'Command Center', 
        headerStyle: { backgroundColor: THEME.colors.bg }, 
        headerTintColor: 'white',
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 12 }
      }} />
      <ScreenHeader title="Command Center" showBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>COMMAND_CENTER</Text>
          <TouchableOpacity style={styles.powerBtn}>
            <Power size={18} color={THEME.colors.critical} />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>QUICK_ACTIONS_v1.0</Text>
        <View style={styles.grid}>
          <QuickAction 
            icon={RefreshCcw} 
            label="RESTART_NODE" 
            color={THEME.colors.blue} 
            onPress={() => console.log('Restarting node...')}
          />
          <FeatureLock feature="systemLock" requiredTier="elite">
            <QuickAction 
              icon={Lock} 
              label="GLOBAL_LOCKDOWN" 
              color={THEME.colors.critical} 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                console.log('Initiating lockdown...');
              }}
            />
          </FeatureLock>
          <QuickAction 
            icon={Palette} 
            label="SWITCH_THEME" 
            color={THEME.colors.gold} 
            onPress={() => console.log('Switching theme...')}
          />
          <QuickAction 
            icon={Zap} 
            label={`${advanceTerm.toUpperCase()}_ENTRY`} 
            color={THEME.colors.blue} 
            onPress={() => require('expo-router').router.push('/(app)/karigars/peshgi')}
          />
          <QuickAction 
            icon={Zap} 
            label="CREATE_INVOICE" 
            color={THEME.colors.gold} 
            onPress={() => require('expo-router').router.push('/(app)/invoices/new')}
          />
          <FeatureLock feature="systemLock" requiredTier="elite">
            <QuickAction 
              icon={ShieldAlert} 
              label="OVERRIDE_MESH" 
              color={THEME.colors.textSecondary} 
              onPress={toggleDrawer}
            />
          </FeatureLock>
        </View>


        <View style={styles.infoBox}>
          <Cpu size={16} color={THEME.colors.textSecondary} />
          <Text style={styles.infoText}>SYSTEM_RESOURCES_OPTIMIZED_FOR_LOW_BANDWIDTH</Text>
        </View>

        <TouchableOpacity 
          style={[styles.drawerTrigger, !isElite && styles.disabledTrigger]} 
          onPress={toggleDrawer}
        >
          {!isElite ? (
            <Animated.View entering={FadeIn} style={styles.eliteLock}>
              <LockKeyhole size={16} color={THEME.colors.gold} />
              <Text style={styles.eliteText}>
                {nodeTier === 'ELITE' ? 'DEVICE_NOT_APPROVED' : 'UPGRADE_TO_ELITE_FOR_ADVANCED_OPS'}
              </Text>
            </Animated.View>
          ) : (
            <>
              <ChevronUp size={24} color={THEME.colors.textSecondary} />
              <Text style={styles.drawerTriggerText}>ADVANCED_UNIT_SETTINGS</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* MAGAZINE STYLE DRAWER */}
      {isElite && (
        <Animated.View style={[styles.drawer, drawerStyle]}>
          <View style={styles.drawerHandle} />
          <View style={styles.drawerContent}>
            <Text style={styles.drawerTitle}>UNIT_CONFIGURATION</Text>
            
            <View style={styles.drawerItem}>
              <Text style={styles.drawerItemLabel}>LOW_BANDWIDTH_MODE</Text>
              <View style={styles.toggleActive} />
            </View>
            
            <View style={styles.drawerItem}>
              <Text style={styles.drawerItemLabel}>REAL_TIME_TELEMETRY</Text>
              <View style={styles.toggleActive} />
            </View>

            <View style={styles.drawerItem}>
              <Text style={styles.drawerItemLabel}>AI_THREAT_FILTER</Text>
              <View style={styles.toggleInactive} />
            </View>

            <TouchableOpacity 
              style={styles.closeDrawerBtn}
              onPress={toggleDrawer}
            >
              <Text style={styles.closeDrawerText}>INSERT_MAGAZINE_&_CLOSE</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: THEME.spacing.xl,
  },
  title: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: THEME.colors.textPrimary,
    fontSize: 20,
    letterSpacing: 2,
  },
  powerBtn: {
    backgroundColor: THEME.colors.surface,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sectionLabel: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: THEME.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.md,
  },
  actionCard: {
    width: '47%',
    backgroundColor: THEME.colors.surface,
    padding: THEME.spacing.md,
    borderRadius: THEME.radius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textPrimary,
    fontSize: 10,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: THEME.spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 12,
    borderRadius: 8,
    gap: 10,
  },
  infoText: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textSecondary,
    fontSize: 8,
    flex: 1,
  },
  drawerTrigger: {
    marginTop: 40,
    alignItems: 'center',
    gap: 8,
  },
  drawerTriggerText: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textSecondary,
    fontSize: 10,
    letterSpacing: 1,
  },
  disabledTrigger: {
    opacity: 0.6,
  },
  eliteLock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(197, 160, 89, 0.1)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.colors.gold,
  },
  eliteText: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.gold,
    fontSize: 9,
    letterSpacing: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    zIndex: 100,
  },
  drawerHandle: {
    width: 40,
    height: 4,
    backgroundColor: THEME.colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
  },
  drawerContent: {
    padding: THEME.spacing.lg,
  },
  drawerTitle: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: THEME.colors.textPrimary,
    fontSize: 18,
    marginBottom: 24,
    letterSpacing: 1,
  },
  drawerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  drawerItemLabel: {
    fontFamily: THEME.fonts.monoBold,
    color: THEME.colors.textSecondary,
    fontSize: 12,
  },
  toggleActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.colors.blue,
  },
  toggleInactive: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: THEME.colors.border,
  },
  closeDrawerBtn: {
    marginTop: 40,
    backgroundColor: THEME.colors.blue,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeDrawerText: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: 'white',
    fontSize: 12,
  }
});
