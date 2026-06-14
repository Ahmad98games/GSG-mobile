'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { Stack } from 'expo-router';
import { supabase } from '../../../src/lib/supabase';
import { getSafeStorage } from '../../../src/utils/storage';
import { useBridgeStatusStore } from '../../../src/store/BridgeStatusStore';
import { queueManager } from '../../../src/services/OfflineQueueManager';
import { useAuthStore } from '../../../src/store/AuthStore';
import { THEME } from '../../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

type AttendanceStatus = 'present' | 'absent' | 'half' | null;

interface KarigarRow {
  id: string;
  name: string;
  karigar_code: string;
  status: AttendanceStatus;
  saving: boolean;
}

export default function AttendanceScreen() {
  const { currency, workerTerm, workerTermPlural } = useBridgeStatusStore();
  const [karigars, setKarigars] = useState<KarigarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadKarigars();
  }, []);

  const loadKarigars = async () => {
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

      // Load karigars and today's attendance in parallel
      const [k, a] = await Promise.all([
        supabase.from('karigars')
          .select('id, name, karigar_code')
          .eq('business_id', profileId)
          .eq('status', 'active')
          .order('name'),
        supabase.from('attendance_logs')
          .select('karigar_id, status')
          .eq('business_id', profileId)
          .eq('attendance_date', today),
      ]);

      if (k.error) throw k.error;
      if (a.error) throw a.error;

      const attended = new Map(
        (a.data || []).map(r => [r.karigar_id, r.status])
      );

      setKarigars((k.data || []).map(kar => ({
        id: kar.id,
        name: kar.name,
        karigar_code: kar.karigar_code || `K-${kar.id.slice(0, 4).toUpperCase()}`,
        status: (attended.get(kar.id) || null) as AttendanceStatus,
        saving: false,
      })));
    } catch (err) {
      console.error('Error loading workers:', err);
      Alert.alert('Error', `Could not load ${workerTermPlural.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = useCallback(
    async (karigarId: string, newStatus: AttendanceStatus) => {
      // Optimistic update
      setKarigars(prev => prev.map(k =>
        k.id === karigarId
          ? { ...k, status: newStatus, saving: true }
          : k
      ));

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

        if (!profileId) throw new Error('No profile');

        // Attempt upsert to Supabase
        const { error } = await supabase
          .from('attendance_logs')
          .upsert({
            business_id: profileId,
            karigar_id: karigarId,
            attendance_date: today,
            status: newStatus,
          }, {
            onConflict: 'business_id,karigar_id,attendance_date'
          });

        if (error) throw error;

      } catch (err) {
        console.warn('Attendance save failed/offline, queuing to queueManager:', err);
        
        // Revert on failure to database
        setKarigars(prev => prev.map(k =>
          k.id === karigarId
            ? { ...k, status: null, saving: false }
            : k
        ));

        // Enqueue to offline manager
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

          if (profileId) {
            await queueManager.enqueueNspEvent({
              attendance_log_req: {
                business_id: profileId,
                karigar_id: karigarId,
                attendance_date: today,
                status: newStatus,
                timestamp: Date.now()
              }
            });
            // Re-apply the status optimistically with offline confirmation
            setKarigars(prev => prev.map(k =>
              k.id === karigarId
                ? { ...k, status: newStatus, saving: false }
                : k
            ));
            Alert.alert(
              'Offline',
              'Saved locally. Will sync when connected to Hub.'
            );
          }
        } catch (queueErr) {
          console.error('Offline queuing failed:', queueErr);
          Alert.alert('Error', 'Failed to save attendance.');
        }
      } finally {
        setKarigars(prev => prev.map(k =>
          k.id === karigarId
            ? { ...k, saving: false }
            : k
        ));
      }
    },
    [today]
  );

  const STATUS_CONFIG = {
    present: { label: 'P', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    absent:  { label: 'A', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    half:    { label: 'H', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  };

  const renderKarigar = ({ item }: { item: KarigarRow }) => (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.code}>{item.karigar_code}</Text>
      </View>
      <View style={styles.buttons}>
        {(['present', 'absent', 'half'] as const).map(s => {
          const cfg = STATUS_CONFIG[s];
          const active = item.status === s;
          return (
            <TouchableOpacity
              key={s}
              style={[
                styles.statusBtn,
                active && {
                  backgroundColor: cfg.bg,
                  borderColor: cfg.color,
                }
              ]}
              onPress={() => markAttendance(item.id, active ? null : s)}
              disabled={item.saving}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.statusBtnText,
                { color: active ? cfg.color : '#6B7280' }
              ]}>
                {cfg.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const presentCount = karigars.filter(k => k.status === 'present').length;
  const totalCount = karigars.length;

  return (
    <>
      <Stack.Screen options={{
        title: 'Mark Attendance',
        headerShown: true,
        headerStyle: {
          backgroundColor: THEME.colors.bg
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontFamily: THEME.fonts.monoBold,
          fontSize: 12
        }
      }} />
      <View style={styles.container}>
        {/* Summary bar */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {presentCount} present  ·  {totalCount - presentCount} remaining  ·  {today}
          </Text>
        </View>

        {loading ? (
          <View style={styles.skeleton}>
            {[1, 2, 3, 4, 5].map(i => (
              <View key={i} style={styles.skeletonRow} />
            ))}
          </View>
        ) : karigars.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={48} color={THEME.colors.textMuted} />
            <Text style={styles.emptyText}>
              No {workerTermPlural.toLowerCase()} registered yet.
            </Text>
            <Text style={styles.emptyHint}>
              Add {workerTermPlural.toLowerCase()} in Noxis Hub on your PC.
            </Text>
          </View>
        ) : (
          <FlatList
            data={karigars}
            keyExtractor={item => item.id}
            renderItem={renderKarigar}
            contentContainerStyle={{
              paddingBottom: 24
            }}
            initialNumToRender={15}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: THEME.colors.bg 
  },
  summary: { 
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border
  },
  summaryText: { 
    fontSize: 11,
    color: THEME.colors.textSecondary, 
    textAlign: 'center',
    fontFamily: THEME.fonts.mono
  },
  row: { 
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 16,
    paddingVertical: 14, 
    gap: 12 
  },
  avatar: { 
    width: 40, 
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(96,165,250,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.2)',
    alignItems: 'center',
    justifyContent: 'center' 
  },
  avatarText: { 
    fontSize: 13, 
    fontWeight: '700',
    color: '#60A5FA',
    fontFamily: THEME.fonts.monoBold
  },
  info: { 
    flex: 1 
  },
  name: { 
    fontSize: 14, 
    fontWeight: '600',
    color: '#FFFFFF' 
  },
  code: { 
    fontSize: 11, 
    color: THEME.colors.textSecondary,
    fontFamily: THEME.fonts.mono,
    marginTop: 2
  },
  buttons: { 
    flexDirection: 'row', 
    gap: 8 
  },
  statusBtn: { 
    width: 38, 
    height: 38,
    borderRadius: 8, 
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.colors.surface
  },
  statusBtnText: { 
    fontSize: 13,
    fontWeight: '900',
    fontFamily: THEME.fonts.monoBold
  },
  separator: { 
    height: 1,
    backgroundColor: THEME.colors.border,
    marginLeft: 68 
  },
  skeleton: { 
    padding: 16, 
    gap: 12 
  },
  skeletonRow: { 
    height: 56,
    backgroundColor: THEME.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  empty: { 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center', 
    padding: 40,
    gap: 12
  },
  emptyText: { 
    fontSize: 14, 
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    fontFamily: THEME.fonts.mono
  },
  emptyHint: { 
    fontSize: 11, 
    color: THEME.colors.textMuted,
    textAlign: 'center',
    fontFamily: THEME.fonts.mono
  },
});
