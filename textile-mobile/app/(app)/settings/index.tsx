import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert, 
  Switch,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { 
  Building2, 
  Camera, 
  Languages, 
  CircleDollarSign, 
  Moon, 
  Fingerprint, 
  Info, 
  Cpu, 
  Globe, 
  Link2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import { useAuthStore } from '../../../src/store/AuthStore';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { useTierStore } from '../../../src/stores/TierStore';
import { NspService } from '../../../src/services/NspService';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const router = useRouter();
  const { 
    companyName, 
    nodeId, 
    hubIp, 
    hubPort, 
    nodeTier, 
    companyBranding 
  } = useAuthStore();
  const { tier } = useTierStore();
  const { connectionState } = useBridgeStatus();
  
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<'EN' | 'UR'>('EN');
  const [currency, setCurrency] = useState<'PKR' | 'USD'>('PKR');
  const [biometricEnabled, setBiometricEnabled] = useState(true);

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setLoading(true);
      try {
        // Upload via NSP
        await NspService.send({
          logo_upload_req: {
            image_base64: result.assets[0].uri, // In a real app, convert to base64 or use FileSystem
            node_id: nodeId
          }
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Logo uploaded to Hub successfully.');
      } catch (e) {
        Alert.alert('Upload Failed', 'Could not sync logo with Hub.');
      } finally {
        setLoading(false);
      }
    }
  };

  const testBiometric = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      Alert.alert('Hardware Error', 'Biometric hardware not detected.');
      return;
    }
    
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Guardian Auth Verification',
      fallbackLabel: 'Enter PIN',
    });

    if (result.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Authenticated', 'Guardian Auth biometric link active.');
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
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
          trackColor={{ false: THEME.colors.surface, true: THEME.colors.blue }}
          thumbColor="white"
        />
      ) : (
        <ChevronRight size={18} color={THEME.colors.border} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Settings',
        headerStyle: { backgroundColor: THEME.colors.bg },
        headerTintColor: 'white',
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 12 }
      }} />

      {/* BUSINESS PROFILE */}
      <View style={styles.profileCard}>
        <TouchableOpacity style={styles.logoContainer} onPress={pickImage}>
          {companyBranding.logoUrl ? (
            <Image source={{ uri: companyBranding.logoUrl }} style={styles.logo} />
          ) : (
            <View style={styles.logoPlaceholder}>
              <Camera size={24} color={THEME.colors.gold} />
            </View>
          )}
          <View style={styles.cameraIcon}>
            <Camera size={12} color="white" />
          </View>
        </TouchableOpacity>
        <Text style={styles.companyName}>{companyName}</Text>
        <View style={[
          styles.tierBadge, 
          tier === 'pro' && { borderColor: '#60A5FA', backgroundColor: 'rgba(96, 165, 250, 0.1)' },
          tier === 'lite' && { borderColor: '#9CA3AF', backgroundColor: 'rgba(156, 163, 175, 0.1)' }
        ]}>
           <Text style={[
             styles.tierText,
             tier === 'pro' && { color: '#60A5FA' },
             tier === 'lite' && { color: '#9CA3AF' }
           ]}>{tier.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>APP_PREFERENCES</Text>
      <View style={styles.section}>
        <SettingItem 
          icon={Languages} 
          label="LANGUAGE" 
          value={lang === 'EN' ? 'English (Global)' : 'Urdu (South Asia)'}
          onPress={() => setLang(lang === 'EN' ? 'UR' : 'EN')}
        />
        <SettingItem 
          icon={CircleDollarSign} 
          label="BASE_CURRENCY" 
          value={currency}
          onPress={() => setCurrency(currency === 'PKR' ? 'USD' : 'PKR')}
        />
        <SettingItem 
          icon={Moon} 
          label="QUIET_HOURS" 
          onPress={() => router.push('/(app)/settings/notifications')}
        />
      </View>

      <Text style={styles.sectionTitle}>SECURITY_&_AUTH</Text>
      <View style={styles.section}>
        <SettingItem 
          icon={Fingerprint} 
          label="GUARDIAN_BIOMETRIC" 
          toggle={biometricEnabled}
          onToggle={setBiometricEnabled}
        />
        <TouchableOpacity style={styles.testBtn} onPress={testBiometric}>
           <ShieldCheck size={18} color={THEME.colors.blue} />
           <Text style={styles.testBtnText}>TEST_BIOMETRIC_LINK</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>DEVICE_TELEMETRY</Text>
      <View style={styles.section}>
        <View style={styles.telemetryRow}>
           <Cpu size={14} color={THEME.colors.textSecondary} />
           <Text style={styles.telLabel}>NODE_ID</Text>
           <Text style={styles.telValue}>{nodeId}</Text>
        </View>
        <View style={styles.telemetryRow}>
           <Globe size={14} color={THEME.colors.textSecondary} />
           <Text style={styles.telLabel}>HUB_ADDRESS</Text>
           <Text style={styles.telValue}>{hubIp}:{hubPort}</Text>
        </View>
        <View style={styles.telemetryRow}>
           <Link2 size={14} color={THEME.colors.textSecondary} />
           <Text style={styles.telLabel}>SYNC_STATUS</Text>
           <Text style={[styles.telValue, { color: connectionState === 'connected' ? '#10B981' : THEME.colors.critical }]}>
             {connectionState.toUpperCase()}
           </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>ABOUT</Text>
      <View style={styles.section}>
        <View style={styles.aboutRow}>
           <Text style={styles.aboutLabel}>NOXIS_MOBILE</Text>
           <Text style={styles.aboutValue}>v1.13.0-stable</Text>
        </View>
        <View style={styles.aboutRow}>
           <Text style={styles.aboutLabel}>VENDOR</Text>
           <Text style={styles.aboutValue}>Omnora Labs</Text>
        </View>
        <View style={styles.aboutRow}>
           <Text style={styles.aboutLabel}>HUB_VERSION</Text>
           <Text style={styles.aboutValue}>v4.2.1-prime</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.copyright}>© 2026 OMNORA INDUSTRIAL SYSTEMS</Text>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={THEME.colors.gold} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  profileCard: { alignItems: 'center', paddingVertical: 40, backgroundColor: THEME.colors.surface, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  logoContainer: { position: 'relative' },
  logo: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: THEME.colors.gold },
  logoPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: THEME.colors.bg, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: THEME.colors.border },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: THEME.colors.gold, padding: 6, borderRadius: 12 },
  companyName: { color: 'white', fontSize: 20, fontWeight: '900', marginTop: 16 },
  tierBadge: { backgroundColor: 'rgba(197, 160, 89, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: THEME.colors.gold },
  tierText: { color: THEME.colors.gold, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  sectionTitle: { color: THEME.colors.textMuted, fontSize: 10, fontFamily: THEME.fonts.monoBold, paddingHorizontal: 20, marginTop: 30, marginBottom: 12, letterSpacing: 1 },
  section: { backgroundColor: THEME.colors.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: THEME.colors.border },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  itemIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: THEME.colors.bg, justifyContent: 'center', alignItems: 'center' },
  itemLabel: { color: 'white', fontSize: 14, fontWeight: '600' },
  itemValue: { color: THEME.colors.textSecondary, fontSize: 12, marginTop: 2 },
  testBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  testBtnText: { color: THEME.colors.blue, fontSize: 12, fontFamily: THEME.fonts.monoBold },
  telemetryRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  telLabel: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold, flex: 1 },
  telValue: { color: THEME.colors.gold, fontSize: 12, fontFamily: THEME.fonts.monoBold },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  aboutLabel: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  aboutValue: { color: 'white', fontSize: 10, fontFamily: THEME.fonts.mono },
  footer: { padding: 40, alignItems: 'center' },
  copyright: { color: THEME.colors.textMuted, fontSize: 8, fontFamily: THEME.fonts.mono },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }
});
