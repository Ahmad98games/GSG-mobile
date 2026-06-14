'use client';

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  FlatList,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../../../src/utils/storage';
import { usePersona } from '../../../src/hooks/usePersona';
import { NspService } from '../../../src/services/NspService';
import { queueManager } from '../../../src/services/OfflineQueueManager';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { useAuthStore } from '../../../src/store/AuthStore';
import { supabase } from '../../../src/lib/supabase';
import { THEME } from '../../../src/constants/theme';
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
  { id: 'A', label: 'Grade A', color: '#10B981' },
  { id: 'B', label: 'Grade B', color: '#60A5FA' },
  { id: 'C', label: 'Grade C', color: '#F59E0B' },
  { id: 'R', label: 'Rejected', color: '#EF4444' },
];

export default function QuickLogScreen() {
  const router = useRouter();
  const { t } = usePersona();
  const { workerTerm, currency } = useBridgeStatus();
  
  const [karigarSearch, setKarigarSearch] = useState('');
  const [allKarigars, setAllKarigars] = useState<any[]>([]);
  const [filteredKarigars, setFilteredKarigars] = useState<any[]>([]);
  const [selectedKarigar, setSelectedKarigar] = useState<any>(null);
  const [recentKarigars, setRecentKarigars] = useState<any[]>([]);
  const [qty, setQty] = useState(1);
  const [grade, setGrade] = useState('A');
  const [department, setDepartment] = useState(DEPARTMENTS[1]); // Default Stitching
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadRecentKarigars();
    loadAllKarigars();
  }, []);

  useEffect(() => {
    if (!karigarSearch.trim()) {
      setFilteredKarigars([]);
      return;
    }
    const query = karigarSearch.toLowerCase();
    const matches = allKarigars.filter(k => 
      k.name.toLowerCase().includes(query) || 
      (k.karigar_code || '').toLowerCase().includes(query)
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

      const { data, error } = await supabase
        .from('karigars')
        .select('*')
        .eq('business_id', profileId)
        .eq('status', 'active');

      if (data && !error) {
        // Only piece-rate karigars
        const pieceRateOnly = data.filter(k => 
          k.payment_type === 'piece_rate' || 
          k.payment_type === 'piece' || 
          k.piece_rate > 0 ||
          k.payment_type === undefined ||
          k.payment_type === null
        );
        setAllKarigars(pieceRateOnly);
      }
    } catch (err) {
      console.warn('Error loading workers for production logging:', err);
    }
  };

  const saveRecentKarigar = async (karigar: any) => {
    let updated = [karigar, ...recentKarigars.filter(k => k.id !== karigar.id)];
    updated = updated.slice(0, 5);
    setRecentKarigars(updated);
    await AsyncStorage.setItem('recent_karigars', JSON.stringify(updated));
  };

  const handleSubmit = async () => {
    if (!selectedKarigar || qty <= 0 || !grade) return;
    
    // 1. Instantly trigger Success UI states (Optimistic Update)
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    saveRecentKarigar(selectedKarigar);
    setShowSuccess(true);

    const payload = {
      log_production_req: {
        karigar_id: selectedKarigar.id,
        qty,
        grade,
        department,
        timestamp: Date.now()
      }
    };

    setQty(1);

    setTimeout(() => {
      setShowSuccess(false);
    }, 1500);

    // 2. Dispatch network call in background
    NspService.send(payload).catch(async (err) => {
      console.warn('[QuickLog] Send failed, enqueuing offline request:', err);
      // 3. Fallback to enqueuing the request if network call fails
      try {
        await queueManager.enqueueNspEvent(payload);
      } catch (queueErr) {
        console.error('[QuickLog] Failed to enqueue event:', queueErr);
      }
    });
  };

  const adjustQty = (amount: number) => {
    setQty(prev => Math.max(0, prev + amount));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const GradeButton = ({ item }: any) => (
    <TouchableOpacity 
      style={[
        styles.gradeButton, 
        { borderColor: item.color },
        grade === item.id && { backgroundColor: item.color }
      ]}
      onPress={() => {
        setGrade(item.id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }}
    >
      <Text style={[styles.gradeText, grade === item.id && { color: '#fff' }]}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen options={{ 
        title: `${new Date().toLocaleDateString()} Log`,
        headerStyle: { backgroundColor: THEME.colors.bg },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: THEME.fonts.monoBold, fontSize: 12 }
      }} />

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
              placeholder={t('quick_log.search_karigar') || `Search ${workerTerm}...`}
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
                  <Text style={styles.searchItemName}>{k.name}</Text>
                  <Text style={styles.searchItemCode}>{k.karigar_code || k.code || `K-${k.id.slice(0, 4).toUpperCase()}`}</Text>
                </TouchableOpacity>
              ))}
              {filteredKarigars.length === 0 && (
                <View style={styles.noResultsBox}>
                  <Text style={styles.noResultsText}>No matching active {workerTerm.toLowerCase()} found</Text>
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
          <TouchableOpacity style={styles.qtyBtn} onPress={() => adjustQty(-1)}>
            <LucideMinus color="#fff" size={32} />
          </TouchableOpacity>
          
          <View style={styles.qtyDisplay}>
            <TextInput
              style={styles.qtyValue}
              value={qty.toString()}
              onChangeText={(v) => setQty(parseInt(v) || 0)}
              keyboardType="numeric"
            />
            <Text style={styles.qtyLabel}>{t('common.units') || 'Units'}</Text>
          </View>

          <TouchableOpacity style={styles.qtyBtn} onPress={() => adjustQty(1)}>
            <LucidePlus color="#fff" size={32} />
          </TouchableOpacity>
        </View>

        {/* Earnings Preview */}
        {selectedKarigar && qty > 0 && (
          <View style={styles.earningsBox}>
            <Text style={styles.earningsText}>
              Earnings: {currency} {(qty * (selectedKarigar.piece_rate || 0)).toLocaleString()}
            </Text>
          </View>
        )}

        {/* Grade Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT_GRADE</Text>
          <View style={styles.gradeGrid}>
            {GRADES.map(item => <GradeButton key={item.id} item={item} />)}
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

        {/* Submit Button */}
        <TouchableOpacity 
          style={[
            styles.submitButton, 
            (!selectedKarigar || qty <= 0) && styles.submitButtonDisabled,
            showSuccess && styles.submitButtonSuccess
          ]}
          onPress={handleSubmit}
          disabled={!selectedKarigar || qty <= 0 || isSubmitting || showSuccess}
        >
          {showSuccess ? (
            <View style={styles.successRow}>
              <LucideCheckCircle color="#fff" size={24} />
              <Text style={styles.submitButtonText}>{t('common.logged') || 'Logged!'}</Text>
            </View>
          ) : (
            <Text style={styles.submitButtonText}>
              {t('quick_log.submit_label') || `Log ${qty} Units — Grade ${grade}`}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.mono,
    fontSize: 11,
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
  earningsBox: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  earningsText: {
    fontSize: 13,
    color: '#10B981',
    fontFamily: THEME.fonts.monoBold,
  },
  sectionTitle: {
    color: THEME.colors.textSecondary,
    fontSize: 10,
    fontFamily: THEME.fonts.monoBold,
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  gradeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gradeButton: {
    flex: 1,
    minWidth: '45%',
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: THEME.fonts.monoBold
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
  submitButton: {
    backgroundColor: THEME.colors.blue,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
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
});
