import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, Link } from 'expo-router';
import { THEME, COMMON_STYLES } from '../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../../src/store/AuthStore';
import { supabase } from '../../../src/lib/supabase';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { Linking } from 'react-native';
import * as Updates from 'expo-updates';

/**
 * SOVEREIGN MANAGER DASHBOARD (v2.1) - INDUSTRIAL ANALYTICS
 * Full ecosystem observability and financial telemetry.
 */

const { width } = Dimensions.get('window');

export default function ManagerDashboard() {
  const router = useRouter();
  const nodeRole = useAuthStore(s => s.nodeRole);
  const isFriday = new Date().getDay() === 5;
  const isManager = nodeRole === 'MANAGER_ROVING' || nodeRole === 'ACCOUNTANT';
  const [showRegister, setShowRegister] = React.useState(false);
  const [karigarName, setKarigarName] = React.useState('');
  const [karigarPhone, setKarigarPhone] = React.useState('');
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleForceUpdate = async () => {
    try {
      setIsUpdating(true);
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        Alert.alert('SYSTEM UP TO DATE', 'Optimized for current operations.');
      }
    } catch (e) {
      Alert.alert('UPDATE ERROR', 'Tactical link failed. Check connectivity.');
    } finally {
      setIsUpdating(false);
    }
  };

  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['manager-metrics-v2'],
    queryFn: async () => {
      // 1. Vault valuation
      const { data: batches } = await supabase.from('batches').select('suits_count, unit_cost');
      const vaultValue = batches?.reduce((acc, b) => acc + (b.suits_count * b.unit_cost), 0) || 0;

      // 2. Weekly revenue data (Sets OUT)
      const weeklyRevenue = [];
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        const dayStr = format(date, 'EEE');
        const start = startOfDay(date).toISOString();
        const end = endOfDay(date).toISOString();
        
        const { data } = await supabase
          .from('stock_movements')
          .select('quantity')
          .eq('movement_type', 'OUT')
          .gte('created_at', start)
          .lte('created_at', end);
        
        const sum = data?.reduce((acc, m) => acc + m.quantity, 0) || 0;
        weeklyRevenue.push({ label: dayStr, value: sum });
      }

      // 3. Top Articles
      const { data: articles } = await supabase
        .from('articles')
        .select('*')
        .order('stock_remaining', { ascending: false })
        .limit(5);

      // 4. Karigar Efficiency Mock/Query
      // In a real system, we'd query job_audit_results joined with nodes
      const karigars = [
        { name: 'OPERATOR_ALPHA', suits: 42, status: 'PASS', phone: '0000000000' },
        { name: 'OPERATOR_BRAVO', suits: 38, status: 'RED', phone: '0000000000' },
        { name: 'OPERATOR_CHARLIE', suits: 55, status: 'PASS', phone: '0000000000' }
      ];

      return { vaultValue, weeklyRevenue, articles, karigars };
    }
  });

  const openWhatsApp = (phone: string, msg: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const finalPhone = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`;
    const url = `whatsapp://send?phone=${finalPhone}&text=${encodeURIComponent(msg)}`;
    Linking.canOpenURL(url).then(supported => {
        if (supported) Linking.openURL(url);
        else Linking.openURL(`sms:${finalPhone}?body=${encodeURIComponent(msg)}`);
    });
  };

  const maxVal = Math.max(...(metrics?.weeklyRevenue.map(d => d.value) || [1]));

  return (
    <ScrollView 
      style={COMMON_STYLES.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={THEME.colors.gold} />}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={require('../../../src/store/assets/image.png')} 
            style={styles.logo} 
            contentFit="contain"
            transition={200}
            cachePolicy="memory-disk"
          />
          <Text style={styles.title}>EXECUTIVE HUB</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(app)/scanner')}>
          <Ionicons name="scan-circle" size={40} color={THEME.colors.blue} />
        </TouchableOpacity>
      </View>

      {/* METRICS GRID */}
      <View style={styles.metricsGrid}>
        <MetricCard 
          label="VAULT VALUATION" 
          value={`Rs. ${(metrics?.vaultValue || 0).toLocaleString()}`} 
          icon="wallet" 
        />
      </View>

      {/* REVENUE CHART */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>7-DAY VELOCITY (SETS)</Text>
        <View style={styles.chartContainer}>
          {metrics?.weeklyRevenue.map((day, i) => (
            <View key={i} style={styles.chartBarWrapper}>
              <View style={[styles.chartBar, { height: (day.value / maxVal) * 120 }]} />
              <Text style={styles.chartLabel}>{day.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* TOP ARTICLES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>TOP ARTICLES</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.articleScroll}>
          {metrics?.articles?.map(art => (
            <View key={art.id} style={styles.articleCard}>
              <View style={[styles.articleSwatch, { backgroundColor: art.color || THEME.colors.gold }]} />
              <Text style={styles.articleName}>{art.code}</Text>
              <Text style={styles.articleStock}>{art.stock_remaining} IN STOCK</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* KARIGAR EFFICIENCY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>KARIGAR PERFORMANCE (TODAY)</Text>
        <View style={styles.list}>
          {metrics?.karigars.map((k, i) => (
            <View key={i} style={styles.karigarRow}>
              <View>
                <Text style={styles.karigarName}>{k.name}</Text>
                <Text style={styles.karigarSub}>{k.suits} SUITS SUBMITTED</Text>
              </View>
              <View style={[styles.kStatus, { backgroundColor: k.status === 'PASS' ? THEME.colors.status.success + '20' : THEME.colors.status.danger + '20' }]}>
                <TouchableOpacity onPress={() => openWhatsApp(k.phone || '', `Assalam o Alaikum ${k.name}, checking production status.`)}>
                    <Ionicons name="logo-whatsapp" size={20} color={THEME.colors.gold} />
                </TouchableOpacity>
                <Text style={[styles.kStatusText, { color: k.status === 'PASS' ? THEME.colors.status.success : THEME.colors.status.danger, marginLeft: 8 }]}>
                  {k.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* FRIDAY VELOCITY */}
      {isFriday && (
        <View style={styles.fridayPanel}>
          <Ionicons name="flash" size={24} color={THEME.colors.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.fridayTitle}>FRIDAY VELOCITY ACTIVE</Text>
            <Text style={styles.fridaySub}>Target: 500 sets • Current: 342</Text>
          </View>
          <Text style={styles.fridayPercent}>68%</Text>
        </View>
      )}

      {/* KARIGAR QUICK-REGISTER */}
      {isManager && (
          <TouchableOpacity 
            style={styles.registerBtn}
            onPress={() => setShowRegister(true)}
          >
            <Ionicons name="person-add" size={20} color={THEME.colors.background} />
            <Text style={styles.registerBtnText}>REGISTER KARIGAR</Text>
          </TouchableOpacity>
      )}

      {/* SYSTEM ALERTS FEED */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>ACTIVE ALERTS</Text>
        <Ionicons name="notifications-outline" size={16} color={THEME.colors.gold} />
      </View>
      <View style={styles.alertFeed}>
        <TouchableOpacity style={styles.alertItem}>
          <View style={[styles.alertIndicator, { backgroundColor: THEME.colors.status.danger }]} />
          <View>
            <Text style={styles.alertText}>RED_ALERT: Fabric deficit in JO-2024-0012</Text>
            <Text style={styles.alertTime}>2 minutes ago</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <ActionBtn label="KHATA" icon="book" onPress={() => router.push('/shared/khata/')} />
        <Link href="/(mesh)/messenger" style={{ color: 'white', alignSelf: 'center', fontFamily: THEME.fonts.monoBold, fontSize: 10 }}>
          💬 MESH MESSENGER
        </Link>
        <ActionBtn label="FORCE UPDATE" icon="cloud-download" onPress={handleForceUpdate} />
      </View>

      {/* KARIGAR MODAL */}
      <Modal visible={showRegister} transparent animationType="slide">
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>QUICK KARIGAR REG</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="Full Name" 
                    placeholderTextColor={THEME.colors.text.muted}
                    value={karigarName}
                    onChangeText={setKarigarName}
                  />
                  <TextInput 
                    style={styles.input} 
                    placeholder="Phone (+92...)" 
                    placeholderTextColor={THEME.colors.text.muted}
                    value={karigarPhone}
                    onChangeText={setKarigarPhone}
                    keyboardType="phone-pad"
                  />
                  <View style={styles.modalActions}>
                      <TouchableOpacity 
                        style={styles.modalPrimary} 
                        onPress={async () => {
                            if (!karigarName || !karigarPhone) return;
                            const { error } = await supabase.from('karigars').insert({ name: karigarName, phone: karigarPhone });
                            if (!error) {
                                setShowRegister(false);
                                Alert.alert('SUCCESS', 'Karigar registered on production floor.');
                            }
                        }}
                      >
                          <Text style={styles.modalPrimaryText}>REGISTER</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.modalSecondary} onPress={() => setShowRegister(false)}>
                          <Text style={styles.modalSecondaryText}>CANCEL</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </View>
      </Modal>

      <Modal visible={isUpdating} transparent>
          <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { alignItems: 'center' }]}>
                  <ActivityIndicator color={THEME.colors.gold} size="large" />
                  <Text style={[styles.modalTitle, { marginTop: 20 }]}>DOWNLOADING TACTICAL PATCH...</Text>
                  <Text style={styles.modalSecondaryText}>DO NOT SHUT DOWN NODE</Text>
              </View>
          </View>
      </Modal>
    </ScrollView>
  );
}

const MetricCard = ({ label, value, icon }: any) => (
  <View style={styles.card}>
    <View style={styles.cardTop}>
      <Text style={styles.cardLabel}>{label}</Text>
      <Ionicons name={icon as any} size={16} color={THEME.colors.blue} />
    </View>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const ActionBtn = ({ label, icon, onPress }: any) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <Ionicons name={icon as any} size={24} color={THEME.colors.blue} />
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 40, height: 40 },
  title: { color: THEME.colors.blue, fontFamily: THEME.fonts.monoBold, fontSize: 22, letterSpacing: 1 },
  metricsGrid: { paddingHorizontal: 24, marginBottom: 24 },
  card: { backgroundColor: THEME.colors.surface, padding: 20, borderRadius: 8, borderWidth: 1, borderColor: THEME.colors.border },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardLabel: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.mono, fontSize: 10, letterSpacing: 1 },
  cardValue: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 24 },
  chartSection: { padding: 24, backgroundColor: THEME.colors.surface, marginHorizontal: 24, borderRadius: 8, borderWidth: 1, borderColor: THEME.colors.border },
  sectionTitle: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 2, marginBottom: 20 },
  chartContainer: { flexDirection: 'row', height: 150, alignItems: 'flex-end', justifyContent: 'space-between' },
  chartBarWrapper: { alignItems: 'center', gap: 8 },
  chartBar: { width: 12, backgroundColor: THEME.colors.blue, borderRadius: 2 },
  chartLabel: { color: THEME.colors.text.muted, fontSize: 9, fontFamily: THEME.fonts.mono },
  section: { marginTop: 32, paddingHorizontal: 24 },
  articleScroll: { marginTop: 12 },
  articleCard: { backgroundColor: THEME.colors.surface, padding: 16, borderRadius: 4, marginRight: 12, width: 140, borderWidth: 1, borderColor: THEME.colors.border },
  articleSwatch: { width: 20, height: 20, borderRadius: 10, marginBottom: 12 },
  articleName: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  articleStock: { color: THEME.colors.text.muted, fontSize: 10, marginTop: 4, fontFamily: THEME.fonts.mono },
  list: { marginTop: 12, gap: 8 },
  karigarRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: 16, borderRadius: 4, borderWidth: 1, borderColor: THEME.colors.border },
  karigarName: { color: 'white', fontFamily: THEME.fonts.interBold, fontSize: 15 },
  karigarSub: { color: THEME.colors.text.muted, fontSize: 11, marginTop: 2 },
  kStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  kStatusText: { fontSize: 10, fontFamily: THEME.fonts.monoBold },
  fridayPanel: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: THEME.colors.gold + '10', margin: 24, padding: 20, borderRadius: 8, borderWidth: 1, borderColor: THEME.colors.gold },
  fridayTitle: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  fridaySub: { color: THEME.colors.text.muted, fontSize: 10, marginTop: 2 },
  fridayPercent: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, marginTop: 32 },
  alertFeed: { padding: 24, gap: 12 },
  alertItem: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: THEME.colors.surface, padding: 16, borderRadius: 4, borderWidth: 1, borderColor: THEME.colors.border },
  alertIndicator: { width: 4, height: 40, borderRadius: 2 },
  alertText: { color: 'white', fontSize: 14, fontFamily: THEME.fonts.interBold },
  alertTime: { color: THEME.colors.text.muted, fontSize: 10, marginTop: 4 },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, borderTopWidth: 1, borderTopColor: THEME.colors.border, marginTop: 24 },
  actionBtn: { alignItems: 'center', gap: 8 },
  actionLabel: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.monoBold, fontSize: 10 },
  registerBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: THEME.colors.blue, margin: 24, paddingVertical: 16, borderRadius: 4 },
  registerBtnText: { color: 'white', fontFamily: THEME.fonts.monoBold },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: THEME.colors.surface, padding: 24, borderRadius: 8, borderWidth: 1, borderColor: THEME.colors.border },
  modalTitle: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 18, marginBottom: 20 },
  input: { backgroundColor: THEME.colors.background, color: 'white', padding: 12, borderRadius: 4, marginBottom: 12, fontFamily: THEME.fonts.inter },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  modalPrimary: { flex: 1, backgroundColor: THEME.colors.blue, paddingVertical: 12, borderRadius: 4, alignItems: 'center' },
  modalPrimaryText: { color: 'white', fontFamily: THEME.fonts.monoBold },
  modalSecondary: { flex: 1, backgroundColor: THEME.colors.border, paddingVertical: 12, borderRadius: 4, alignItems: 'center' },
  modalSecondaryText: { color: 'white' }
});
