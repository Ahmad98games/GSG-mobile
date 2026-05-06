import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Decimal } from 'decimal.js';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../../src/lib/supabase';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

const GOLD = '#C6A756';
const RED = '#C44B4B';
const GREEN = '#3D9970';

export default function JobOrderDetail() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [suits, setSuits] = useState('');
  const [tukra, setTukra] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch Job Metadata
  const { data: job, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_orders')
        .select(`
          *,
          article:articles(name, code, expected_gaz_per_suit)
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const auditMutation = useMutation({
    mutationFn: async (payload: any) => {
      // Module 5: Chori Guard Protocol
      const { data, error } = await supabase.functions.invoke('run-chori-guard', {
        body: payload,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.result === 'RED_ALERT') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(t('audit.alert_heading'), `${t('audit.alert_message')}: ${data.message}`);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(t('audit.pass_heading'), t('audit.pass_message', { defaultValue: 'Job order marked as SUBMITTED' }));
        queryClient.invalidateQueries({ queryKey: ['job_orders'] });
        router.back();
      }
    },
  });

  const handleSubmit = async () => {
    if (!suits || !tukra) return;
    setSubmitting(true);

    try {
      // Decimal.js strict math
      const suitsVal = new Decimal(suits);
      const tukraVal = new Decimal(tukra);

      await auditMutation.mutateAsync({
        job_id: id,
        suits_received: suitsVal.toNumber(),
        reported_tukra: tukraVal.toNumber(),
      });
    } catch (err: any) {
      Alert.alert(t('common.error'), err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <ActivityIndicator color={GOLD} style={{ marginTop: 100 }} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Article Header */}
      <View style={styles.hero}>
        <Text style={styles.label}>{t('production.article_label', { defaultValue: 'ARTICLE PROTOCOL' })}</Text>
        <Text style={styles.title}>{job.article?.name}</Text>
        <Text style={styles.code}>{job.article?.code}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t('production.gaz_issued')}</Text>
          <Text style={styles.statValue}>{job.gaz_issued?.toFixed(3)}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>{t('production.target_suits')}</Text>
          <Text style={styles.statValue}>{job.total_quantity}</Text>
        </View>
      </View>

      {/* Chori Guard Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>{t('audit.title')}</Text>
        
        <Text style={styles.inputLabel}>{t('audit.suits_received_label')} (+)</Text>
        <TextInput
          style={styles.hugeInput}
          value={suits}
          onChangeText={setSuits}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#333"
        />

        <Text style={styles.inputLabel}>{t('audit.tukra_label')} (GZ)</Text>
        <TextInput
          style={styles.hugeInput}
          value={tukra}
          onChangeText={setTukra}
          keyboardType="decimal-pad"
          placeholder="0.000"
          placeholderTextColor="#333"
        />

        <TouchableOpacity 
          style={styles.submitBtn} 
          onPress={handleSubmit}
          disabled={submitting || !suits || !tukra}
        >
          {submitting ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.btnText}>{t('audit.submit_button', { defaultValue: 'EXECUTE AUDIT' })}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0A0A', paddingTop: 60 },
  hero: { paddingHorizontal: 24, marginBottom: 32 },
  label: { color: GOLD, fontSize: 10, fontWeight: '900', letterSpacing: 4, marginBottom: 4 },
  title: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  code: { color: '#888', fontSize: 12, fontWeight: '800', fontFamily: 'JetBrains Mono', letterSpacing: 2 },
  
  statsGrid: { flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginBottom: 40 },
  statBox: { flex: 1, backgroundColor: '#111', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#1F1F1F' },
  statLabel: { color: '#888', fontSize: 8, fontWeight: '900', letterSpacing: 1, marginBottom: 4 },
  statValue: { color: '#FFF', fontSize: 18, fontWeight: '900', fontFamily: 'JetBrains Mono' },
  
  form: { paddingHorizontal: 24 },
  formTitle: { color: GOLD, fontSize: 12, fontWeight: '900', letterSpacing: 4, marginBottom: 32 },
  inputLabel: { color: '#888', fontSize: 9, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  hugeInput: { fontSize: 64, color: '#FFF', fontWeight: '900', fontFamily: 'JetBrains Mono', marginBottom: 24, borderBottomWidth: 1, borderColor: '#1F1F1F', paddingVertical: 12 },
  submitBtn: { backgroundColor: GOLD, height: 72, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  btnText: { color: '#000', fontSize: 14, fontWeight: '900', letterSpacing: 2 },
});
