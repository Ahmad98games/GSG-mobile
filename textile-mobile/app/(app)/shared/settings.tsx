import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert, ScrollView } from 'react-native';
import { THEME, COMMON_STYLES } from '../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../../src/store/AuthStore';
import { supabase } from '../../../src/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../../../src/utils/storage';
import { I18nManager } from 'react-native';
// @ts-ignore
import * as Updates from 'expo-updates';

/**
 * SOVEREIGN INDUSTRIAL SETTINGS (v2.0)
 * Protocol-level configuration for ecosystem nodes.
 */

export default function Settings() {
  const { nodeRole, nodeId } = useAuthStore();
  const [isRTL, setIsRTL] = useState(I18nManager.isRTL);
  const [printerConnected, setPrinterConnected] = useState(false);
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});
  const [dndStart, setDndStart] = useState(22);
  const [dndEnd, setDndEnd] = useState(7);
  const [isLoading, setIsLoading] = useState(false);

  const NOTIF_TYPES = [
    { id: 'RED_ALERT', label: 'Karigar Fabric Deficit', sub: 'Critical variance detections.' },
    { id: 'LOW_STOCK', label: 'Low Stock Alert', sub: 'Article below threshold.' },
    { id: 'JOB_ASSIGNED', label: 'New Job Assigned', sub: 'Tasks for this node.' },
    { id: 'ORDER_CONFIRMED', label: 'Large Order Confirmed', sub: 'Orders > 50 sets.' },
    { id: 'BROADCAST_ALERT', label: 'Admin Broadcasts', sub: 'Direct messages from PC.' },
    { id: 'DIRECT_MESSAGE', label: 'Direct Messages', sub: '1-to-1 secure chat.' },
    { id: 'NODE_TASK', label: 'Remote Node Tasks', sub: 'Operations pushed by Admin.' },
  ];

  useEffect(() => {
    const loadSettings = async () => {
      const rtl = await getSafeStorage('user_rtl');
      setIsRTL(rtl === 'true');
      
      if (nodeId) {
          // Load notification preferences from Supabase
          const { data } = await supabase
            .from('notification_preferences')
            .select('*')
            .eq('node_id', nodeId);
          
          if (data && data.length > 0) {
              const prefs: Record<string, boolean> = {};
              data.forEach((p: any) => {
                  prefs[p.notification_type] = p.is_enabled;
              });
              setNotifications(prefs);
              setDndStart(data[0].dnd_start ?? 22);
              setDndEnd(data[0].dnd_end ?? 7);
          } else {
              // Apply role-based defaults
              applyRoleDefaults();
          }
      }
    };
    loadSettings();
  }, [nodeId]);

  const applyRoleDefaults = () => {
      const defaults: Record<string, boolean> = {
          BROADCAST_ALERT: true,
          DIRECT_MESSAGE: true,
      };

      if (nodeRole === 'PRODUCTION_FLOOR') {
          defaults.JOB_ASSIGNED = true;
          defaults.RED_ALERT = true;
      } else if (nodeRole === 'INWARD_DOCK') {
          defaults.LOW_STOCK = true;
          defaults.ORDER_CONFIRMED = true;
      } else if (nodeRole === 'DISPATCH_BAY') {
          defaults.ORDER_CONFIRMED = true;
          defaults.NODE_TASK = true;
      } else if (nodeRole === 'MANAGER_ROVING') {
          NOTIF_TYPES.forEach(t => defaults[t.id] = true);
      }

      setNotifications(defaults);
  };

  const toggleNotification = async (type: string, value: boolean) => {
      setNotifications(prev => ({ ...prev, [type]: value }));
      if (!nodeId) return;

      await supabase.from('notification_preferences').upsert({
          node_id: nodeId,
          notification_type: type,
          is_enabled: value,
          dnd_start: dndStart,
          dnd_end: dndEnd,
          updated_at: new Date().toISOString()
      });
  };

  useEffect(() => {
    const loadSettings = async () => {
      const rtl = await getSafeStorage('user_rtl');
      setIsRTL(rtl === 'true');
    };
    loadSettings();
  }, []);

  const toggleRTL = async (value: boolean) => {
    setIsRTL(value);
    await AsyncStorage.setItem('user_rtl', value.toString());
    I18nManager.forceRTL(value);
    I18nManager.allowRTL(value);
    
    Alert.alert(
      'RESTART REQUIRED',
      'The application must restart to apply Urdu RTL layout.',
      [
        { text: 'RESTART NOW', onPress: () => Updates.reloadAsync() },
        { text: 'LATER', style: 'cancel' }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'TERMINATE SESSION',
      'Are you sure you want to decouple this node?',
      [
        { text: 'CANCEL', style: 'cancel' },
        { text: 'LOGOUT', style: 'destructive', onPress: () => useAuthStore.getState().logout() }
      ]
    );
  };

  return (
    <ScrollView style={COMMON_STYLES.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>NODE SETTINGS</Text>
        <Text style={styles.subtitle}>ID: {nodeId?.substring(0, 8)}...</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>LOCALIZATION</Text>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Urdu RTL Layout</Text>
            <Text style={styles.settingSub}>Optimize for Pakistani workforce.</Text>
          </View>
          <Switch 
            value={isRTL} 
            onValueChange={toggleRTL}
            thumbColor={isRTL ? THEME.colors.gold : THEME.colors.border}
            trackColor={{ false: '#333', true: THEME.colors.gold + '50' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>HARDWARE</Text>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Bluetooth Printer</Text>
            <Text style={styles.settingSub}>Thermal label status.</Text>
          </View>
          <View style={[styles.statusBadge, printerConnected ? styles.connected : styles.disconnected]}>
            <Text style={styles.statusText}>{printerConnected ? 'CONNECTED' : 'OFFLINE'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>DISCOVER PRINTERS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        {NOTIF_TYPES.map(notif => (
          <View key={notif.id} style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>{notif.label}</Text>
              <Text style={styles.settingSub}>{notif.sub}</Text>
            </View>
            <Switch 
              value={notifications[notif.id] ?? false} 
              onValueChange={(val) => toggleNotification(notif.id, val)}
              thumbColor={notifications[notif.id] ? THEME.colors.gold : THEME.colors.border}
              trackColor={{ false: '#333', true: THEME.colors.gold + '50' }}
            />
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>DO-NOT-DISTURB HOURS</Text>
        <View style={styles.dndRow}>
          <View style={styles.dndBlock}>
            <Text style={styles.dndLabel}>START</Text>
            <Text style={styles.dndValue}>{dndStart}:00</Text>
          </View>
          <Ionicons name="arrow-forward" size={16} color={THEME.colors.text.muted} />
          <View style={styles.dndBlock}>
            <Text style={styles.dndLabel}>END</Text>
            <Text style={styles.dndValue}>{dndEnd}:00</Text>
          </View>
        </View>
        <Text style={styles.dndSub}>Critical RED_ALERTS bypass DND window.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>SECURITY</Text>
        <View style={styles.settingRow}>
           <View>
            <Text style={styles.settingLabel}>Current Role</Text>
            <Text style={styles.settingSub}>{nodeRole}</Text>
          </View>
          <Ionicons name="shield-checkmark" size={24} color={THEME.colors.gold} />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color={THEME.colors.status.danger} />
        <Text style={styles.logoutText}>DECOUPLE NODE</Text>
      </TouchableOpacity>

      <Text style={styles.version}>v2.1 // SOVEREIGN_MOBILE</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
  header: { marginBottom: 32 },
  title: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 24 },
  subtitle: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.mono, fontSize: 12 },
  section: { marginBottom: 32 },
  sectionTitle: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 2, marginBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, backgroundColor: THEME.colors.surface, padding: 16, borderRadius: 4 },
  settingLabel: { color: 'white', fontFamily: THEME.fonts.interBold, fontSize: 16 },
  settingSub: { color: THEME.colors.text.muted, fontSize: 12, marginTop: 4 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  connected: { backgroundColor: THEME.colors.status.success + '20' },
  disconnected: { backgroundColor: THEME.colors.status.danger + '20' },
  statusText: { color: 'white', fontSize: 10, fontFamily: THEME.fonts.monoBold },
  actionBtn: { backgroundColor: THEME.colors.border, padding: 12, borderRadius: 4, alignItems: 'center' },
  actionBtnText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 12 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 40, padding: 16, borderWidth: 1, borderColor: THEME.colors.status.danger, borderRadius: 4 },
  logoutText: { color: THEME.colors.status.danger, fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  dndRow: { flexDirection: 'row', alignItems: 'center', gap: 20, backgroundColor: THEME.colors.surface, padding: 16, borderRadius: 4 },
  dndBlock: { alignItems: 'center' },
  dndLabel: { color: THEME.colors.text.muted, fontSize: 8, fontFamily: THEME.fonts.monoBold },
  dndValue: { color: 'white', fontSize: 18, fontFamily: THEME.fonts.monoBold, marginTop: 4 },
  dndSub: { color: THEME.colors.text.muted, fontSize: 10, marginTop: 12, textAlign: 'center', fontStyle: 'italic' },
  version: { color: THEME.colors.text.muted, textAlign: 'center', marginTop: 40, fontSize: 10, fontFamily: THEME.fonts.mono }
});
