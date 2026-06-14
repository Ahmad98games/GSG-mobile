import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Dimensions
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { 
  Factory, 
  Users, 
  FileText, 
  BarChart3, 
  Banknote, 
  Repeat, 
  Trophy, 
  Settings,
  ChevronRight,
  Shield,
  Activity,
  Scan
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function MoreMenuScreen() {
  const router = useRouter();

  const menuItems = [
    { label: 'PRODUCTION', icon: Factory, color: THEME.colors.blue, route: '/(app)/production' },
    { label: 'NOXIS LENS', icon: Scan, color: THEME.colors.blue, route: '/(app)/lens' },
    { label: 'KARIGARS', icon: Users, color: THEME.colors.gold, route: '/(app)/karigars' },
    { label: 'INVOICES', icon: FileText, color: '#10B981', route: '/(app)/invoices/new' },
    { label: 'REPORTS', icon: BarChart3, color: '#6366F1', route: '/(app)/analytics' },
    { label: 'CASHFLOW', icon: Banknote, color: '#F59E0B', route: '/(app)/cashflow' },
    { label: 'HANDOVER', icon: Repeat, color: '#EC4899', route: '/(app)/handover' },
    { label: 'LEADERBOARD', icon: Trophy, color: THEME.colors.gold, route: '/(app)/leaderboard' },
    { label: 'SETTINGS', icon: Settings, color: THEME.colors.textSecondary, route: '/(app)/settings' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'MORE_FEATURES', headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={styles.title}>COMMAND_EXPANSION</Text>
        <Text style={styles.subtitle}>ALL_SYSTEM_MODULES</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.card} 
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                <item.icon size={24} color={item.color} />
              </View>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <ChevronRight size={14} color={THEME.colors.border} style={styles.chevron} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.utilitySection}>
           <Text style={styles.sectionTitle}>SYSTEM_UTILITIES</Text>
           <TouchableOpacity style={styles.utilRow} onPress={() => router.push('/(app)/diagnostics' as any)}>
              <Activity size={18} color={THEME.colors.textSecondary} />
              <Text style={styles.utilLabel}>DIAGNOSTICS</Text>
              <ChevronRight size={16} color={THEME.colors.border} />
           </TouchableOpacity>
           <TouchableOpacity style={styles.utilRow} onPress={() => router.push('/(app)/executive' as any)}>
              <Shield size={18} color={THEME.colors.gold} />
              <Text style={styles.utilLabel}>EXECUTIVE_MODE</Text>
              <ChevronRight size={16} color={THEME.colors.border} />
           </TouchableOpacity>
        </View>

        <View style={styles.footer}>
           <Text style={styles.footerText}>NOXIS_MOBILE_PRIME_v13</Text>
           <Text style={styles.footerSub}>OMNORA_INDUSTRIAL_MESH</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  header: { padding: 24, paddingTop: 40, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  title: { color: 'white', fontFamily: THEME.fonts.monoExtraBold, fontSize: 18, letterSpacing: 2 },
  subtitle: { color: THEME.colors.blue, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 1, marginTop: 4 },
  scroll: { padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    width: (width - 44) / 2, 
    backgroundColor: THEME.colors.surface, 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    position: 'relative'
  },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardLabel: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 11, letterSpacing: 1 },
  chevron: { position: 'absolute', top: 12, right: 12 },
  utilitySection: { marginTop: 24, backgroundColor: THEME.colors.surface, borderRadius: 20, borderWidth: 1, borderColor: THEME.colors.border, overflow: 'hidden' },
  sectionTitle: { color: THEME.colors.textMuted, fontSize: 9, fontFamily: THEME.fonts.monoBold, padding: 16, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  utilRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  utilLabel: { flex: 1, marginLeft: 16, color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 12 },
  footer: { marginTop: 40, alignItems: 'center', marginBottom: 40 },
  footerText: { color: THEME.colors.textMuted, fontFamily: THEME.fonts.monoBold, fontSize: 10 },
  footerSub: { color: THEME.colors.border, fontFamily: THEME.fonts.mono, fontSize: 8, marginTop: 4 }
});
