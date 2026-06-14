import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { THEME, COMMON_STYLES } from '../../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '../../../../src/lib/supabase';
import { Decimal } from 'decimal.js';
// @ts-ignore
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../../../../src/utils/storage';
import { SyncEngine } from '../../../../src/lib/SyncEngine';
import { useAuthStore } from '../../../../src/store/AuthStore';
import { useTranslation } from 'react-i18next';

export default function JobOrderDetail() {
  const { t } = useTranslation();
  const { code } = useLocalSearchParams();
  const router = useRouter();
  const { nodeId } = useAuthStore();
  
  const [suitsReceived, setSuitsReceived] = useState('');
  const [tukraReported, setTukraReported] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [thresholds, setThresholds] = useState({
    wastage: new Decimal('0.04'),
    shrinkage: new Decimal('0.065'),
    tolerance: new Decimal('0.5')
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const raw = await getSafeStorage('chori_guard_settings');
        const cached = raw ? JSON.parse(raw) : null;
        if (cached) {
          const { data, expiry } = cached;
          if (Date.now() < expiry) {
            applySettings(data);
          }
        }

        const { data: settings } = await supabase.from('system_settings').select('key, value');
        if (settings) {
          const settingsMap = Object.fromEntries(settings.map((s: any) => [s.key, s.value]));
          applySettings(settingsMap);
          await AsyncStorage.setItem('chori_guard_settings', JSON.stringify({
            data: settingsMap,
            expiry: Date.now() + 3600000 // 1 hour TTL
          }));
        }
      } catch (e) {
        console.error('Settings fetch failed:', e);
      }
    };

    const applySettings = (map: any) => {
      setThresholds({
        wastage: new Decimal(map.chori_guard_wastage_pct || '4.0').div(100),
        shrinkage: new Decimal(map.chori_guard_shrinkage_pct || '6.5').div(100),
        tolerance: new Decimal(map.chori_guard_tolerance_gaz || '0.5')
      });
    };

    loadSettings();
  }, []);

  const { data: job, isLoading, refetch } = useQuery({
    queryKey: ['job-order', code],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_orders')
        .select('*, articles(*), profiles(full_name)')
        .eq('code', code)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  const auditMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.functions.invoke('run-chori-guard', {
        body: payload
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.result === 'PASS') {
        Alert.alert(t('audit.pass_heading'), t('audit.pass_message'));
        router.back();
      } else {
        Alert.alert(t('audit.alert_heading'), t('audit.alert_message'));
      }
    }
  });

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      allowsEditing: false,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!suitsReceived || !tukraReported) {
      Alert.alert(t('common.error'), t('audit.error_missing_fields', { defaultValue: 'Enter suits received and remnant tukra.' }));
      return;
    }

    if (!job) return;

    const netState = await NetInfo.fetch();
    
    const auditPayload = {
      job_order_id: job.id,
      suits_received: parseInt(suitsReceived),
      tukra_reported: new Decimal(tukraReported).toNumber(),
      photo_url: photo,
      submitted_at: new Date().toISOString(),
      submitted_by_node: nodeId,
      wastage_threshold: thresholds.wastage.toNumber(),
      shrinkage_threshold: thresholds.shrinkage.toNumber(),
      tolerance_threshold: thresholds.tolerance.toNumber()
    };

    if (!netState.isConnected) {
      // Queue for later
      await SyncEngine.enqueue('JOB_AUDIT_SUBMIT', auditPayload);
      
      // Update local UI (Simulated)
      Alert.alert(
        t('common.offline'),
        t('audit.offline_saved'),
        [{ text: t('common.confirm'), onPress: () => router.back() }]
      );
      
      // Local status simulation: in a real app, we'd update a local SQLite/AsyncStorage copy of the jobs
      return;
    }

    // Online submission
    auditMutation.mutate(auditPayload);
  };

  if (isLoading || !job) return (
    <View style={[COMMON_STYLES.container, styles.centered]}>
      <ActivityIndicator color={THEME.colors.gold} size="large" />
    </View>
  );

  return (
    <ScrollView style={COMMON_STYLES.container} contentContainerStyle={styles.content}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.label}>{t('production.article_label', { defaultValue: 'ARTICLE' })}</Text>
        <Text style={styles.title}>{job.articles?.name || t('production.generic_article', { defaultValue: 'GENERIC ARTICLE' })}</Text>
        <Text style={styles.subTitle}>
          {job.articles?.desi_color_name || 'N/A'} // {job.articles?.size_protocol || 'N/A'}
        </Text>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('production.gaz_issued')}</Text>
          <Text style={styles.infoValue}>{job.gaz_issued}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>{t('production.target_suits')}</Text>
          <Text style={styles.infoValue}>{job.target_suits}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Audit Form */}
      <Text style={styles.formTitle}>{t('audit.title')}</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{t('audit.suits_received_label')}</Text>
        <TextInput
          style={styles.largeInput}
          value={suitsReceived}
          onChangeText={setSuitsReceived}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={THEME.colors.border}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{t('audit.tukra_label')}</Text>
        <TextInput
          style={styles.largeInput}
          value={tukraReported}
          onChangeText={setTukraReported}
          keyboardType="decimal-pad"
          placeholder="0.000"
          placeholderTextColor={THEME.colors.border}
        />
      </View>

      <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
        <Ionicons name="camera" size={24} color={photo ? THEME.colors.status.success : THEME.colors.gold} />
        <Text style={[styles.photoText, photo && { color: THEME.colors.status.success }]}>
          {photo ? t('audit.photo_captured', { defaultValue: 'EVIDENCE CAPTURED' }) : t('audit.add_photo')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.submitBtn, auditMutation.isPending && { opacity: 0.7 }]} 
        onPress={handleSubmit}
        disabled={auditMutation.isPending}
      >
        {auditMutation.isPending ? (
          <ActivityIndicator color={THEME.colors.background} />
        ) : (
          <Text style={styles.submitText}>{t('audit.submit_button')}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingBottom: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 32, paddingTop: 20 },
  label: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 2, marginBottom: 4 },
  title: { color: 'white', fontFamily: THEME.fonts.interBold, fontSize: 28 },
  subTitle: { color: THEME.colors.text.muted, fontSize: 14, marginTop: 4 },
  infoGrid: { flexDirection: 'row', gap: 40, marginBottom: 32 },
  infoItem: { flex: 1 },
  infoLabel: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.mono, fontSize: 10, marginBottom: 4 },
  infoValue: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 18 },
  divider: { height: 1, backgroundColor: THEME.colors.border, marginBottom: 32 },
  formTitle: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 16, marginBottom: 24, letterSpacing: 1 },
  inputContainer: { marginBottom: 24 },
  inputLabel: { color: THEME.colors.text.muted, fontFamily: THEME.fonts.mono, fontSize: 10, marginBottom: 8 },
  largeInput: { 
    color: THEME.colors.gold, 
    fontFamily: THEME.fonts.monoBold, 
    fontSize: 48, 
    borderBottomWidth: 2, 
    borderBottomColor: THEME.colors.border,
    paddingBottom: 8,
  },
  photoBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    backgroundColor: THEME.colors.surface, 
    padding: 16, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    marginBottom: 40,
    marginTop: 10,
  },
  photoText: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 12 },
  submitBtn: { 
    backgroundColor: THEME.colors.gold, 
    paddingVertical: 18, 
    borderRadius: 4, 
    alignItems: 'center',
    shadowColor: THEME.colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  submitText: { color: THEME.colors.background, fontFamily: THEME.fonts.monoBold, fontSize: 16, letterSpacing: 1 }
});
