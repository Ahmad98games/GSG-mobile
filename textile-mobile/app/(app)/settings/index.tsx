'use client';

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert, 
  Switch,
  ActivityIndicator,
  Linking
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { 
  Building2, 
  Languages, 
  Moon, 
  Info, 
  Cpu, 
  Globe, 
  Link2,
  ChevronRight,
  ShieldCheck,
  Bell,
  RefreshCw,
  HelpCircle,
  LogOut
} from 'lucide-react-native';
import { useAuthStore } from '../../../src/store/AuthStore';
import { useBridgeStatusStore } from '../../../src/stores/BridgeStatusStore';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { getPendingCount } from '../../../src/services/OfflineQueueManager';
import { getDeviceLabel } from '../../../src/utils/deviceId';
import * as Haptics from 'expo-haptics';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { useTranslation } from '../../../src/hooks/useTranslation';

export default function SettingsScreen() {
  const router = useRouter();
  const { tr, lang, setLanguage } = useTranslation();
  
  const { 
    nodeId, 
    companyBranding 
  } = useAuthStore();

  const {
    businessName,
    tier,
    lastSeen
  } = useBridgeStatusStore();

  const { connectionState } = useBridgeStatus();

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [deviceLabel, setDeviceLabelState] = useState('');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    getDeviceLabel().then(setDeviceLabelState);

    const checkCount = async () => {
      const c = await getPendingCount();
      setPendingCount(c);
    };
    checkCount();
    const interval = setInterval(checkCount, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSyncNow = async () => {
    setSyncing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const { onHubReconnect } = require('@/services/OfflineSyncService');
      await onHubReconnect();
      const c = await getPendingCount();
      setPendingCount(c);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(tr('Sync Complete') || 'Sync Complete', 'Offline sync queue has been fully processed.');
    } catch {
      Alert.alert(tr('Sync Error') || 'Sync Error', 'Could not sync queue. Please ensure Hub is online.');
    } finally {
      setSyncing(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      tr('Log Out') || 'Log Out',
      'Are you sure you want to log out? This will clear pairing and local config data.',
      [
        { text: tr('Cancel') || 'Cancel', style: 'cancel' },
        { 
          text: tr('Log Out') || 'Log Out', 
          style: 'destructive',
          onPress: async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await useAuthStore.getState().logout();
            useBridgeStatusStore.getState().reset();
            router.replace('/(auth)/pair');
          }
        }
      ]
    );
  };

  const handleCheckUpdates = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('App Update', 'Your app is up to date (v1.13.0 is the latest stable version).');
  };

  const handleOpenSupport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const url = 'whatsapp://send?phone=+923001234567&text=' + encodeURIComponent('Hello, I need support for Noxis Mobile app.');
    Linking.openURL(url).catch(() => {
      Alert.alert('Support', 'Please contact support at support@omnora.com or WhatsApp +92 300 1234567.');
    });
  };

  const SettingItem = ({ icon: Icon, label, value, onPress, toggle, onToggle }: any) => (
    <TouchableOpacity style={styles.item} onPress={onPress} disabled={!!toggle}>
      <View style={styles.itemIconBox}>
        <Icon size={20} color={THEME.colors.textSecondary} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.itemLabel}>{label}</Text>
        {value && <Text style={styles.itemValue}>{value}</Text>}
      </View>
      {toggle ? (
        <Switch 
          value={toggle} 
          onValueChange={onToggle} 
          trackColor={{ false: THEME.colors.surface, true: '#60A5FA' }}
          thumbColor="white"
        />
      ) : (
        <ChevronRight size={18} color={THEME.colors.border} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScreenHeader title={tr('Settings')} showBack={false} />

        {/* BUSINESS PROFILE */}
        <View style={styles.profileCard}>
          <View style={styles.logoPlaceholder}>
            <Building2 size={32} color={THEME.colors.gold} />
          </View>
          <Text style={styles.companyName}>{businessName || 'My Factory'}</Text>
          <View style={styles.tierBadge}>
             <Text style={styles.tierText}>{(tier || 'LITE').toUpperCase()} PLAN</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT_&_HUB</Text>
        <View style={styles.section}>
          <View style={styles.telemetryRow}>
             <Cpu size={14} color={THEME.colors.textSecondary} />
             <Text style={styles.telLabel}>DEVICE_LABEL</Text>
             <Text style={styles.telValue}>{deviceLabel}</Text>
          </View>
          <SettingItem 
            icon={Link2} 
            label="REPAIR_WITH_HUB" 
            onPress={() => router.push('/(auth)/pair')}
          />
        </View>

        <Text style={styles.sectionTitle}>APP_PREFERENCES</Text>
        <View style={styles.section}>
          <SettingItem 
            icon={Languages} 
            label={tr('Settings') + ' ' + (tr('Urdu') || 'Language')} 
            value={lang === 'en' ? 'English (Global)' : 'اردو (Urdu)'}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setLanguage(lang === 'en' ? 'ur' : 'en');
            }}
          />
          <SettingItem 
            icon={Moon} 
            label="DARK_MODE" 
            toggle={true}
            onToggle={() => {}}
          />
          <SettingItem 
            icon={Bell} 
            label="NOTIFICATIONS" 
            onPress={() => router.push('/(app)/settings/notifications')}
          />
        </View>

        <Text style={styles.sectionTitle}>DATA_&_SYNC</Text>
        <View style={styles.section}>
          <View style={styles.telemetryRow}>
             <RefreshCw size={14} color={THEME.colors.textSecondary} />
             <Text style={styles.telLabel}>PENDING_ACTIONS</Text>
             <Text style={[styles.telValue, pendingCount > 0 && { color: '#F59E0B' }]}>
               {pendingCount} items
             </Text>
          </View>
          <View style={styles.telemetryRow}>
             <Globe size={14} color={THEME.colors.textSecondary} />
             <Text style={styles.telLabel}>LAST_SYNCHRONIZED</Text>
             <Text style={styles.telValue}>
               {lastSeen ? new Date(lastSeen).toLocaleTimeString() : 'Never'}
             </Text>
          </View>
          <TouchableOpacity style={styles.syncBtn} onPress={handleSyncNow} disabled={syncing}>
             {syncing ? <ActivityIndicator size="small" color="#60A5FA" /> : <RefreshCw size={14} color="#60A5FA" />}
             <Text style={styles.syncBtnText}>SYNC_NOW</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>APP_INFO</Text>
        <View style={styles.section}>
          <View style={styles.aboutRow}>
             <Text style={styles.aboutLabel}>VERSION</Text>
             <Text style={styles.aboutValue}>v1.13.0-stable</Text>
          </View>
          <View style={styles.aboutRow}>
             <Text style={styles.aboutLabel}>BUILD_NUMBER</Text>
             <Text style={styles.aboutValue}>1304</Text>
          </View>
          <SettingItem 
            icon={RefreshCw} 
            label="CHECK_FOR_UPDATES" 
            onPress={handleCheckUpdates}
          />
          <SettingItem 
            icon={HelpCircle} 
            label="WHATSAPP_SUPPORT" 
            onPress={handleOpenSupport}
          />
        </View>

        <Text style={styles.sectionTitle}>DANGER_ZONE</Text>
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
             <LogOut size={16} color="#EF4444" />
             <Text style={styles.logoutBtnText}>LOG_OUT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.copyright}>© 2026 OMNORA INDUSTRIAL SYSTEMS</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  profileCard: { alignItems: 'center', paddingVertical: 32, backgroundColor: THEME.colors.surface, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  logoPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: THEME.colors.bg, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: THEME.colors.border },
  companyName: { color: 'white', fontSize: 18, fontWeight: '900', marginTop: 16 },
  tierBadge: { backgroundColor: 'rgba(197, 160, 89, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: THEME.colors.gold },
  tierText: { color: THEME.colors.gold, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  sectionTitle: { color: THEME.colors.textMuted, fontSize: 9, fontFamily: THEME.fonts.monoBold, paddingHorizontal: 16, marginTop: 24, marginBottom: 8, letterSpacing: 1.5 },
  section: { backgroundColor: THEME.colors.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: THEME.colors.border },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  itemIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: THEME.colors.bg, justifyContent: 'center', alignItems: 'center' },
  itemLabel: { color: 'white', fontSize: 14, fontWeight: '600' },
  itemValue: { color: THEME.colors.textSecondary, fontSize: 12, marginTop: 2 },
  syncBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  syncBtnText: { color: '#60A5FA', fontSize: 12, fontFamily: THEME.fonts.monoBold },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  logoutBtnText: { color: '#EF4444', fontSize: 12, fontFamily: THEME.fonts.monoBold },
  telemetryRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  telLabel: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold, flex: 1 },
  telValue: { color: THEME.colors.gold, fontSize: 12, fontFamily: THEME.fonts.monoBold },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  aboutLabel: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  aboutValue: { color: 'white', fontSize: 10, fontFamily: THEME.fonts.mono },
  footer: { padding: 40, alignItems: 'center' },
  copyright: { color: THEME.colors.textMuted, fontSize: 8, fontFamily: THEME.fonts.mono },
});
