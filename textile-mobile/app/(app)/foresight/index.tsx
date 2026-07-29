'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { supabase } from '../../../src/lib/supabase';
import { getSafeStorage } from '../../../src/utils/storage';
import { useAuthStore } from '../../../src/store/AuthStore';
import { useBridgeStatusStore } from '../../../src/stores/BridgeStatusStore';
import { THEME } from '../../../src/constants/theme';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { SkeletonRow } from '../../../src/components/ui/SkeletonRow';

interface Prediction {
  id: string;
  title: string;
  detail: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  status: string;
  created_at: string;
}

export default function ForesightScreen() {
  const router = useRouter();
  const { businessId } = useBridgeStatusStore();

  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPredictions = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);

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
      if (!profileId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('foresight_predictions')
        .select('*')
        .eq('business_id', profileId)
        .eq('status', 'active')
        .order('confidence', { ascending: false })
        .limit(10);

      if (data && !error) {
        setPredictions(data as Prediction[]);
      }
    } catch (err) {
      console.error('Error loading predictions:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPredictions(true);
  };

  const handleResolve = async (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const { error } = await supabase
        .from('foresight_predictions')
        .update({ status: 'resolved' })
        .eq('id', id);

      if (error) throw error;

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPredictions(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to resolve prediction:', err);
      Alert.alert('Error', 'Failed to resolve prediction.');
    }
  };

  const IMPACT_COLORS: Record<string, string> = {
    critical: '#EF4444',
    high: '#F59E0B',
    medium: '#60A5FA',
    low: '#10B981',
  };

  return (
    <ScreenContainer style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="Foresight Predictions" showBack={true} />

      {loading ? (
        <View style={{ padding: 16 }}>
          <SkeletonRow lines={5} height={120} />
        </View>
      ) : predictions.length === 0 ? (
        <EmptyState
          icon="🧠"
          title="All clear"
          description="Foresight has no active predictions or warnings at this moment."
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#60A5FA"
            />
          }
        >
          {predictions.map(item => {
            const impactColor = IMPACT_COLORS[item.impact] || '#6B7280';
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.badge, { backgroundColor: impactColor + '15', borderColor: impactColor + '40' }]}>
                    <Text style={[styles.badgeText, { color: impactColor }]}>
                      {item.impact.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.confidenceText}>
                    {(item.confidence * 100).toFixed(0)}% confidence
                  </Text>
                </View>

                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.detail} numberOfLines={2}>{item.detail}</Text>

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                  <Text style={styles.hintText}>🖥 View draft actions in PC Hub</Text>
                  <TouchableOpacity
                    style={styles.resolveBtn}
                    onPress={() => handleResolve(item.id)}
                  >
                    <Text style={styles.resolveText}>Mark Resolved</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  scroll: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#0F1114',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
    fontFamily: THEME.fonts.monoBold,
  },
  confidenceText: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: THEME.fonts.mono,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detail: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hintText: {
    fontSize: 10,
    color: '#4B5563',
  },
  resolveBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  resolveText: {
    fontSize: 11,
    color: '#E5E7EB',
    fontWeight: '600',
  },
});
