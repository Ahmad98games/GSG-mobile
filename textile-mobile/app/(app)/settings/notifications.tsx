import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Modal, FlatList, SafeAreaView } from 'react-native';
import { Stack } from 'expo-router';
import { Clock, Globe, ShieldAlert, Play, ChevronRight, Info } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { THEME } from '../../../src/constants/theme';
import { usePersona } from '../../../src/hooks/usePersona';
import { useQuietHoursStore } from '../../../src/stores/QuietHoursStore';
import { notificationService } from '../../../src/lib/notifications/NotificationService';

const TIMEZONES = [
  'Asia/Karachi', 'Asia/Dubai', 'UTC', 'Europe/London', 'America/New_York', 'Asia/Singapore'
];

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
      <Stack.Screen options={{ title: t('notifications.quiet_hours_label'), headerStyle: { backgroundColor: THEME.colors.bg }, headerTintColor: '#fff' }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        {/* SECTION 1: MASTER TOGGLE */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Clock size={20} color={THEME.colors.blue} />
              <Text style={styles.rowLabel}>{t('notifications.quiet_hours_label')}</Text>
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
            <Text style={styles.subLabel}>{t('notifications.from_time')}</Text>
            <Text style={styles.timeValue}>{formatTime(startHour, startMinute)}</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity style={styles.row}>
            <Text style={styles.subLabel}>{t('notifications.to_time')}</Text>
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
              <Text style={styles.rowLabel}>{t('notifications.timezone_label')}</Text>
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
            {t('notifications.critical_always_delivered')}
          </Text>
        </View>

        {/* SECTION 5: TEST NOTIFICATION */}
        <View style={styles.testSection}>
          <TouchableOpacity style={styles.testBtn} onPress={handleSendTest}>
            <Play size={16} color="black" fill="black" />
            <Text style={styles.testBtnText}>{t('notifications.send_test').toUpperCase()}</Text>
          </TouchableOpacity>
          
          {quietActive && (
            <Text style={styles.suppressedNote}>
              {t('notifications.test_suppressed_note')}
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
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    color: THEME.colors.textPrimary,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  subLabel: {
    color: THEME.colors.textSecondary,
    fontSize: 14,
  },
  timeValue: {
    color: THEME.colors.gold,
    fontFamily: THEME.colors.gold, // Mocking font using color logic as reference
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
