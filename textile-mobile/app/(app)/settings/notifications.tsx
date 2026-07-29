'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Modal, FlatList, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { Clock, Globe, ShieldAlert, Play, ChevronRight, Info } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME } from '../../../src/constants/theme';
import { usePersona } from '../../../src/hooks/usePersona';
import { useQuietHoursStore } from '../../../src/stores/QuietHoursStore';
import { notificationService } from '../../../src/lib/notifications/NotificationService';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';
import { scheduleAttendanceReminder, cancelAllScheduled } from '../../../src/services/NotificationService';

const TIMEZONES = [
  'Asia/Karachi', 'Asia/Dubai', 'UTC', 'Europe/London', 'America/New_York', 'Asia/Singapore'
];

const NOTIF_PREFS_KEY = 'noxis_notif_prefs';

export default function NotificationSettings() {
  const { t } = usePersona();
  const enabled = useQuietHoursStore(s => s.enabled);
  const startHour = useQuietHoursStore(s => s.startHour);
  const startMinute = useQuietHoursStore(s => s.startMinute);
  const endHour = useQuietHoursStore(s => s.endHour);
  const endMinute = useQuietHoursStore(s => s.endMinute);
  const timezone = useQuietHoursStore(s => s.timezone);
  const setEnabled = useQuietHoursStore(s => s.setEnabled);
  const setTimezone = useQuietHoursStore(s => s.setTimezone);
  const isQuietHoursActive = useQuietHoursStore(s => s.isQuietHoursActive);

  const [tzModalVisible, setTzModalVisible] = useState(false);
  const [prefs, setPrefs] = useState({
    attendance_reminder: true,
    low_stock: true,
    payment_overdue: true,
    foresight: true,
  });

  useEffect(() => {
    const loadPrefs = async () => {
      const stored = await AsyncStorage.getItem(NOTIF_PREFS_KEY);
      if (stored) {
        setPrefs(JSON.parse(stored));
      }
    };
    loadPrefs();
  }, []);

  const savePrefs = async (key: string, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    await AsyncStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(updated));

    if (key === 'attendance_reminder') {
      if (value) {
        await scheduleAttendanceReminder();
      } else {
        await cancelAllScheduled();
      }
    }
  };

  const disabledOverlayStyle = useAnimatedStyle(() => ({
    opacity: withSpring(enabled ? 1 : 0.4, { stiffness: 250, damping: 30 }),
  }));

  const formatTime = (h: number, m: number) => {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const handleSendTest = () => {
    notificationService.displayLowStock('SKU-TEST-001', '5', 'units');
  };

  const quietActive = isQuietHoursActive();

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false, title: t('notifications.quiet_hours_label') || 'Notification Preferences', headerStyle: { backgroundColor: THEME.colors.bg }, headerTintColor: '#fff' }} />
      <ScreenHeader title="Notification Preferences" showBack={true} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* SECTION: CHANNEL PREFERENCES */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>NOTIFICATION CHANNELS</Text>
          
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Clock size={18} color="#60A5FA" />
              <Text style={styles.rowLabel}>Attendance Reminder (9 AM)</Text>
            </View>
            <Switch
              value={prefs.attendance_reminder}
              onValueChange={(v) => savePrefs('attendance_reminder', v)}
              trackColor={{ false: THEME.colors.border, true: '#60A5FA' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <ShieldAlert size={18} color="#F59E0B" />
              <Text style={styles.rowLabel}>Low Stock Alerts</Text>
            </View>
            <Switch
              value={prefs.low_stock}
              onValueChange={(v) => savePrefs('low_stock', v)}
              trackColor={{ false: THEME.colors.border, true: '#60A5FA' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <ShieldAlert size={18} color="#EF4444" />
              <Text style={styles.rowLabel}>Payment Overdue Alerts</Text>
            </View>
            <Switch
              value={prefs.payment_overdue}
              onValueChange={(v) => savePrefs('payment_overdue', v)}
              trackColor={{ false: THEME.colors.border, true: '#60A5FA' }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <ShieldAlert size={18} color="#10B981" />
              <Text style={styles.rowLabel}>Foresight Critical Alerts</Text>
            </View>
            <Switch
              value={prefs.foresight}
              onValueChange={(v) => savePrefs('foresight', v)}
              trackColor={{ false: THEME.colors.border, true: '#60A5FA' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* SECTION 1: MASTER TOGGLE (Quiet Hours) */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>QUIET HOURS POLICY</Text>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Clock size={20} color={THEME.colors.blue} />
              <Text style={styles.rowLabel}>{t('notifications.quiet_hours_label') || 'Enable Quiet Hours'}</Text>
            </View>
            <Switch 
              value={enabled} 
              onValueChange={setEnabled}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.blue }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* SECTION 2: TIME RANGE */}
        <Animated.View style={[styles.section, disabledOverlayStyle]} pointerEvents={enabled ? 'auto' : 'none'}>
          <TouchableOpacity style={styles.row}>
            <Text style={styles.subLabel}>{t('notifications.from_time') || 'Start Time'}</Text>
            <Text style={styles.timeValue}>{formatTime(startHour, startMinute)}</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.row}>
            <Text style={styles.subLabel}>{t('notifications.to_time') || 'End Time'}</Text>
            <Text style={styles.timeValue}>{formatTime(endHour, endMinute)}</Text>
          </TouchableOpacity>

          <Text style={styles.summaryText}>
            Notifications suppressed from {formatTime(startHour, startMinute)} to {formatTime(endHour, endMinute)}
          </Text>
        </Animated.View>

        {/* SECTION 3: TIMEZONE */}
        <Animated.View style={[styles.section, disabledOverlayStyle]} pointerEvents={enabled ? 'auto' : 'none'}>
          <TouchableOpacity style={styles.row} onPress={() => setTzModalVisible(true)}>
            <View style={styles.rowLeft}>
              <Globe size={20} color={THEME.colors.textSecondary} />
              <Text style={styles.rowLabel}>{t('notifications.timezone_label') || 'Timezone'}</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.monoValue}>{timezone}</Text>
              <ChevronRight size={16} color={THEME.colors.textSecondary} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* SECTION 4: CRITICAL NOTE */}
        <View style={styles.infoBox}>
          <Info size={18} color="#F59E0B" />
          <Text style={styles.infoText}>
            {t('notifications.critical_always_delivered') || 'Critical alerts will bypass quiet hours policies.'}
          </Text>
        </View>

        {/* SECTION 5: TEST NOTIFICATION */}
        <View style={styles.testSection}>
          <TouchableOpacity style={styles.testBtn} onPress={handleSendTest}>
            <Play size={16} color="black" fill="black" />
            <Text style={styles.testBtnText}>{(t('notifications.send_test') || 'Send Test Alert').toUpperCase()}</Text>
          </TouchableOpacity>
          
          {quietActive && (
            <Text style={styles.suppressedNote}>
              {t('notifications.test_suppressed_note') || 'Quiet hours active: Non-critical alerts are suppressed.'}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* TIMEZONE MODAL */}
      <Modal visible={tzModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>SELECT TIMEZONE</Text>
            <FlatList
              data={TIMEZONES}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.tzItem} 
                  onPress={() => { setTimezone(item); setTzModalVisible(false); }}
                >
                  <Text style={[styles.tzText, item === timezone && { color: THEME.colors.blue }]}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeBtn} onPress={() => setTzModalVisible(false)}>
              <Text style={styles.closeBtnText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  content: {
    padding: 16,
  },
  section: {
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  sectionHeader: {
    color: THEME.colors.textSecondary,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    color: THEME.colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  subLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
  },
  timeValue: {
    color: THEME.colors.gold,
    fontSize: 18,
    fontWeight: 'bold',
  },
  monoValue: {
    color: THEME.colors.textPrimary,
    fontFamily: THEME.fonts.mono,
    fontSize: 13,
  },
  summaryText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: THEME.colors.border,
    marginVertical: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: 16,
    borderRadius: THEME.radius.md,
    gap: 12,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    color: '#F59E0B',
    fontSize: 12,
    lineHeight: 18,
  },
  testSection: {
    alignItems: 'center',
    gap: 12,
  },
  testBtn: {
    backgroundColor: THEME.colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: THEME.radius.sm,
  },
  testBtnText: {
    color: 'black',
    fontFamily: THEME.fonts.monoBold,
    fontSize: 12,
  },
  suppressedNote: {
    color: THEME.colors.critical,
    fontSize: 11,
    fontFamily: THEME.fonts.mono,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.radius.lg,
    borderTopRightRadius: THEME.radius.lg,
    padding: 24,
    maxHeight: '60%',
  },
  modalTitle: {
    color: THEME.colors.textSecondary,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 12,
    marginBottom: 20,
    letterSpacing: 1,
  },
  tzItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  tzText: {
    color: THEME.colors.textPrimary,
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeBtnText: {
    color: THEME.colors.textSecondary,
    fontFamily: THEME.fonts.monoBold,
  }
});
