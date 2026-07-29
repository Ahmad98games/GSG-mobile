'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  Platform,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../../../src/utils/storage';
import { usePersona } from '../../../src/hooks/usePersona';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { SuccessOverlay } from '../../../src/components/ui/SuccessOverlay';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { useAuthStore } from '../../../src/store/AuthStore';
import { supabase } from '../../../src/lib/supabase';
import { THEME } from '../../../src/constants/theme';
import { useIndustryConfig } from '../../../src/hooks/useIndustryConfig';
import { writeWithSync } from '../../../src/services/OfflineSyncService';
import { 
  LucidePlus, 
  LucideMinus, 
  LucideUser, 
  LucideSearch, 
  LucideCheckCircle,
  LucideX
} from 'lucide-react-native';

const DEPARTMENTS = ['Cutting', 'Stitching', 'Finishing', 'Packing'];

const GRADES = [
  { value: 'A', color: '#10B981' },
  { value: 'B', color: '#60A5FA' },
  { value: 'C', color: '#F59E0B' },
  { value: 'Rejected', color: '#EF4444' },
];

export default function QuickLogScreen() {
  const router = useRouter();
  const { t } = usePersona();
  const { canLogProduction } = useBridgeStatus();
  const tConfig = useIndustryConfig();
  const workerTerm = tConfig.worker;
  const currency = tConfig.currency;
  const fmt = tConfig.fmt;

  if (!canLogProduction) {
    return (
      <ScreenContainer style={{ flex: 1 }}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScreenHeader title={`${tConfig.production} Log`} showBack={true} />
        <EmptyState
          icon="🔒"
          title="Access Denied"
          description={`You do not have permission to log ${tConfig.production.toLowerCase()}. Please contact your factory administrator.`}
        />
      </ScreenContainer>
    );
  }
  
  const [karigarSearch, setKarigarSearch] = useState('');
  const [allKarigars, setAllKarigars] = useState<any[]>([]);
  const [filteredKarigars, setFilteredKarigars] = useState<any[]>([]);
  const [selectedKarigar, setSelectedKarigar] = useState<any>(null);
  const [recentKarigars, setRecentKarigars] = useState<any[]>([]);
  const [units, setUnits] = useState('1');
  const [grade, setGrade] = useState('A');
  const [department, setDepartment] = useState(DEPARTMENTS[1]); // Default Stitching
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [todaySummary, setTodaySummary] = useState({ total: 0, a: 0, b: 0, c: 0, rejected: 0 });

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadRecentKarigars();
    loadAllKarigars();
    loadTodaySummary();
  }, []);

  useEffect(() => {
    if (!karigarSearch.trim()) {
      setFilteredKarigars([]);
      return;
    }
    const query = karigarSearch.toLowerCase();
    const matches = allKarigars.filter(k => 
      k.name.toLowerCase().includes(query) || 
      (k.karigar_code || k.code || '').toLowerCase().includes(query)
    );
    setFilteredKarigars(matches);
  }, [karigarSearch, allKarigars]);

  const loadRecentKarigars = async () => {
    const raw = await getSafeStorage('recent_karigars');
    const data = raw ? JSON.parse(raw) : null;
    if (data) setRecentKarigars(data);
  };

  const loadAllKarigars = async () => {
    try {
      const session = useAuthStore.getState().session;
      let profileId = session?.user?.id;
      if (!profileId) {
        const profile = await getSafeStorage('noxis_profile', null);
        if (profile) {
          const parsed = JSON.parse(profile);
          profileId = parsed?.id;
        }
      }
      if (!profileId) return;

      // Query karigars and today's production logs in parallel
      const [kRes, logsRes] = await Promise.all([
        supabase
          .from('karigars')
          .select('*')
          .eq('business_id', profileId)
          .eq('status', 'active'),
        supabase
          .from('karigar_production_logs')
          .select('karigar_id, units_produced')
          .eq('business_id', profileId)
          .eq('log_date', today)
      ]);

      if (kRes.data) {
        const prodMap = new Map<string, number>();
        if (logsRes.data) {
          for (const log of logsRes.data) {
            const current = prodMap.get(log.karigar_id) || 0;
            prodMap.set(log.karigar_id, current + (log.units_produced || 0));
          }
        }

        const pieceRateOnly = kRes.data.filter(k => 
          k.wage_type === 'piece_rate' ||
          k.payment_type === 'piece_rate'
        );

        const enriched = pieceRateOnly.map((k: any) => ({
          ...k,
          today_units: prodMap.get(k.id) || 0
        }));

        setAllKarigars(enriched);
      }
    } catch (err) {
      console.warn('Error loading workers for production logging:', err);
    }
  };

  const loadTodaySummary = async () => {
    try {
      const session = useAuthStore.getState().session;
      let profileId = session?.user?.id;
      if (!profileId) {
        const profile = await getSafeStorage('noxis_profile', null);
        if (profile) {
          const parsed = JSON.parse(profile);
          profileId = parsed?.id;
        }
      }
      if (!profileId) return;

      const { data, error } = await supabase
        .from('karigar_production_logs')
        .select('units_produced, grade')
        .eq('business_id', profileId)
        .eq('log_date', today);

      if (data && !error) {
        let total = 0;
        let a = 0;
        let b = 0;
        let c = 0;
        let rejected = 0;
        for (const row of data) {
          const qtyVal = row.units_produced || 0;
          total += qtyVal;
          if (row.grade === 'A') a += qtyVal;
          else if (row.grade === 'B') b += qtyVal;
          else if (row.grade === 'C') c += qtyVal;
          else if (row.grade === 'Rejected') rejected += qtyVal;
        }
        setTodaySummary({ total, a, b, c, rejected });
      }
    } catch (err) {
      console.warn('Error loading today summary:', err);
    }
  };

  const saveRecentKarigar = async (karigar: any) => {
    let updated = [karigar, ...recentKarigars.filter(k => k.id !== karigar.id)];
    updated = updated.slice(0, 5);
    setRecentKarigars(updated);
    await AsyncStorage.setItem('recent_karigars', JSON.stringify(updated));
  };

  const earnings = useMemo(() => {
    const n = parseInt(units) || 0;
    return n * (selectedKarigar?.piece_rate || 0);
  }, [units, selectedKarigar]);

  const handleSubmit = async () => {
    const qtyVal = parseInt(units) || 0;
    if (!selectedKarigar || qtyVal <= 0 || !grade) return;
    
    setIsSubmitting(true);

    try {
      const session = useAuthStore.getState().session;
      let businessId = session?.user?.id;
      if (!businessId) {
        const profile = await getSafeStorage('noxis_profile', null);
        if (profile) {
          const parsed = JSON.parse(profile);
          businessId = parsed?.id;
        }
      }
      if (!businessId) throw new Error('No business profile found');

      const result = await writeWithSync(
        'karigar_production_logs',
        {
          business_id: businessId,
          karigar_id: selectedKarigar.id,
          log_date: today,
          units_produced: qtyVal,
          grade: grade,
          earnings: earnings,
          department: department,
          piece_rate_used: selectedKarigar.piece_rate || 0,
        },
        {
          notifyHub: 'PRODUCTION_LOGGED',
        }
      );

      if (!result.success) {
        setSuccessMsg('Saved to offline queue');
      } else {
        setSuccessMsg('Production logged');
      }
      saveRecentKarigar(selectedKarigar);
      setShowSuccess(true);
      loadTodaySummary();
      loadAllKarigars();
    } catch (err: any) {
      console.error('[QuickLog] Save failed:', err.message);
      Alert.alert('Error', 'Failed to log production.');
    }

    setTimeout(() => {
      setShowSuccess(false);
      setIsSubmitting(false);
      setUnits('1');
      setSelectedKarigar(null);
      setKarigarSearch('');
      router.back();
    }, 1500);
  };

  const adjustUnits = (amount: number) => {
    setUnits(prev => {
      const current = parseInt(prev) || 0;
      const next = Math.max(0, current + amount);
      return String(next);
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScreenContainer style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <Stack.Screen options={{ 
          headerShown: false,
        }} />
        <ScreenHeader title={`${new Date().toLocaleDateString()} ${tConfig.production} Log`} showBack={true} />

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
        >
          {/* Karigar Selector */}
          <View style={styles.section}>
            <View style={styles.searchBar}>
              <LucideSearch size={20} color="#6b7280" />
              <TextInput
                style={styles.searchInput}
                placeholder={t('quick_log.search_karigar') || `Search ${tConfig.worker}...`}
                placeholderTextColor="#6b7280"
                value={karigarSearch}
                onChangeText={setKarigarSearch}
              />
              {karigarSearch.length > 0 && (
                <TouchableOpacity onPress={() => setKarigarSearch('')}>
                  <LucideX size={18} color="#6b7280" />
                </TouchableOpacity>
              )}
            </View>

            {/* Filtered Search Results Dropdown */}
            {karigarSearch.length > 0 && !selectedKarigar && (
              <View style={styles.searchResults}>
                {filteredKarigars.map(k => (
                  <TouchableOpacity 
                    key={k.id} 
                    style={styles.searchItem}
                    onPress={() => {
                      setSelectedKarigar(k);
                      setKarigarSearch('');
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.searchItemName}>{k.name}</Text>
                      <Text style={styles.searchItemCode}>{k.karigar_code || k.code || `K-${k.id.slice(0, 4).toUpperCase()}`}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.searchItemRate}>
                        {currency} {(k.piece_rate || 0).toLocaleString()}/pc
                      </Text>
                      <Text style={styles.searchItemUnits}>
                        {k.today_units} units today
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {filteredKarigars.length === 0 && (
                  <View style={styles.noResultsBox}>
                    <Text style={styles.noResultsText}>No matching active {tConfig.worker.toLowerCase()} found</Text>
                  </View>
                )}
              </View>
            )}

            {recentKarigars.length > 0 && !selectedKarigar && !karigarSearch && (
              <View style={styles.chipContainer}>
                {recentKarigars.map(k => (
                  <TouchableOpacity 
                    key={k.id} 
                    style={styles.chip} 
                    onPress={() => setSelectedKarigar(k)}
                  >
                    <Text style={styles.chipText}>{k.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {selectedKarigar && (
              <View style={styles.selectedKarigarRow}>
                <View style={styles.karigarInfo}>
                  <LucideUser color={THEME.colors.gold} size={24} />
                  <View>
                    <Text style={styles.selectedKarigarName}>{selectedKarigar.name}</Text>
                    <Text style={styles.selectedKarigarRate}>Piece Rate: {currency} {(selectedKarigar.piece_rate || 0).toLocaleString()}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedKarigar(null)}>
                  <Text style={styles.changeText}>{t('common.change') || 'Change'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Qty Input */}
          <View style={styles.qtySection}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => adjustUnits(-1)}>
              <LucideMinus color="#fff" size={32} />
            </TouchableOpacity>
            
            <View style={styles.qtyDisplay}>
              <TextInput
                style={styles.qtyValue}
                value={units}
                onChangeText={setUnits}
                keyboardType="numeric"
              />
              <Text style={styles.qtyLabel}>{tConfig.productionUnit || 'Units'}</Text>
            </View>

            <TouchableOpacity style={styles.qtyBtn} onPress={() => adjustUnits(1)}>
              <LucidePlus color="#fff" size={32} />
            </TouchableOpacity>
          </View>

          {/* Live Earnings Preview */}
          {units.length > 0 && selectedKarigar && (
            <View style={styles.earningsPreview}>
              <Text style={styles.earningsLabel}>
                Estimated Earnings
              </Text>
              <Text style={styles.earningsAmount}>
                {fmt(earnings)}
              </Text>
              <Text style={styles.earningsBreakdown}>
                {units} × {fmt(selectedKarigar?.piece_rate || 0)}/pc
              </Text>
            </View>
          )}

          {/* Grade Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SELECT GRADE</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
              {GRADES.map(g => (
                <TouchableOpacity
                  key={g.value}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: grade === g.value ? g.color + '80' : 'rgba(255,255,255,0.08)',
                    backgroundColor: grade === g.value ? g.color + '15' : 'transparent',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setGrade(g.value);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={{
                    color: grade === g.value ? g.color : '#6b7280',
                    fontSize: 12,
                    fontWeight: '700',
                    fontFamily: THEME.fonts.monoBold
                  }}>
                    {grade === g.value ? '✓ ' : ''}{g.value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Department Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DEPARTMENT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deptScroll}>
              {DEPARTMENTS.map(d => (
                <TouchableOpacity 
                  key={d} 
                  style={[styles.deptChip, department === d && styles.deptChipActive]}
                  onPress={() => setDepartment(d)}
                >
                  <Text style={[styles.deptText, department === d && styles.deptTextActive]}>{d.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Today's Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryCardTitle}>Today's Logged Production</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatLabel}>Total Units</Text>
                <Text style={styles.summaryStatValue}>{todaySummary.total.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatLabel}>Grade A</Text>
                <Text style={[styles.summaryStatValue, { color: '#10B981' }]}>{todaySummary.a.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatLabel}>Grade B</Text>
                <Text style={[styles.summaryStatValue, { color: '#60A5FA' }]}>{todaySummary.b.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatLabel}>Grade C</Text>
                <Text style={[styles.summaryStatValue, { color: '#F59E0B' }]}>{todaySummary.c.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatLabel}>Rejected</Text>
                <Text style={[styles.summaryStatValue, { color: '#EF4444' }]}>{todaySummary.rejected.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Pinned Submit Button outside ScrollView */}
        <View style={styles.footerContainer}>
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              (!selectedKarigar || parseInt(units) <= 0) && styles.submitButtonDisabled,
              showSuccess && styles.submitButtonSuccess
            ]}
            onPress={handleSubmit}
            disabled={!selectedKarigar || parseInt(units) <= 0 || isSubmitting || showSuccess}
          >
            {showSuccess ? (
              <View style={styles.successRow}>
                <LucideCheckCircle color="#fff" size={24} />
                <Text style={styles.submitButtonText}>{t('common.logged') || 'Logged!'}</Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>
                {t('quick_log.submit_label') || `Log ${units} ${tConfig.productionUnit} — Grade ${grade}`}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <SuccessOverlay
        message={successMsg}
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
    paddingBottom: 40,
  },
  section: {
    gap: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontFamily: THEME.fonts.mono
  },
  searchResults: {
    backgroundColor: THEME.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    padding: 8,
    maxHeight: 200,
  },
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.bg,
  },
  searchItemName: {
    color: '#fff',
    fontWeight: '600',
  },
  searchItemCode: {
    color: '#4B5563',
    fontFamily: THEME.fonts.mono,
    fontSize: 10,
  },
  searchItemRate: {
    color: THEME.colors.gold,
    fontSize: 12,
    fontFamily: THEME.fonts.mono,
  },
  searchItemUnits: {
    color: '#60A5FA',
    fontSize: 10,
    marginTop: 2,
  },
  noResultsBox: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    color: THEME.colors.textMuted,
    fontSize: 12,
    fontFamily: THEME.fonts.mono,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: THEME.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  chipText: {
    color: THEME.colors.textPrimary,
    fontSize: 13,
  },
  selectedKarigarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(197, 160, 89, 0.08)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.colors.gold,
  },
  karigarInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedKarigarName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedKarigarRate: {
    color: THEME.colors.gold,
    fontSize: 11,
    fontFamily: THEME.fonts.mono,
    marginTop: 2
  },
  changeText: {
    color: THEME.colors.blue,
    fontWeight: '600',
    fontSize: 12,
    fontFamily: THEME.fonts.monoBold
  },
  qtySection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    backgroundColor: 'rgba(96, 165, 250, 0.05)',
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.15)',
  },
  qtyBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyDisplay: {
    alignItems: 'center',
    minWidth: 100,
  },
  qtyValue: {
    color: '#fff',
    fontSize: 54,
    fontFamily: THEME.fonts.monoExtraBold,
    textAlign: 'center',
  },
  qtyLabel: {
    color: THEME.colors.blue,
    fontSize: 11,
    fontFamily: THEME.fonts.monoBold,
    textTransform: 'uppercase',
    marginTop: -4,
  },
  earningsPreview: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 4,
  },
  earningsLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  earningsAmount: {
    color: '#10B981',
    fontSize: 28,
    fontWeight: '900',
    fontFamily: THEME.fonts.monoExtraBold,
  },
  earningsBreakdown: {
    color: '#6B7280',
    fontSize: 11,
    fontFamily: THEME.fonts.mono,
  },
  sectionTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontFamily: THEME.fonts.monoBold,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  deptScroll: {
    flexDirection: 'row',
  },
  deptChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: THEME.colors.surface,
    marginRight: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  deptChipActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  deptText: {
    color: THEME.colors.textSecondary,
    fontWeight: '600',
    fontFamily: THEME.fonts.monoBold,
    fontSize: 12
  },
  deptTextActive: {
    color: '#000',
  },
  footerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    backgroundColor: '#09090b',
  },
  submitButton: {
    backgroundColor: THEME.colors.blue,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: THEME.colors.surface,
    opacity: 0.5,
  },
  submitButtonSuccess: {
    backgroundColor: '#10B981',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: THEME.fonts.monoBold,
  },
  successRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryCard: {
    backgroundColor: '#0F1114',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  summaryCardTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryStat: {
    minWidth: '45%',
    gap: 2,
  },
  summaryStatLabel: {
    fontSize: 9,
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: THEME.fonts.monoBold,
  },
});
