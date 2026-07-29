'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
import { useAuthStore } from '../../../src/store/AuthStore';
import { THEME } from '../../../src/constants/theme';
import * as Haptics from 'expo-haptics';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';
import { ScreenContainer } from '../../../src/components/ui/ScreenContainer';
import { SuccessOverlay } from '../../../src/components/ui/SuccessOverlay';
import { EmptyState } from '../../../src/components/ui/EmptyState';
import { ErrorState } from '../../../src/components/ui/ErrorState';
import { SkeletonRow } from '../../../src/components/ui/SkeletonRow';
import { useIndustryConfig } from '../../../src/hooks/useIndustryConfig';
import { writeWithSync } from '../../../src/services/OfflineSyncService';

type AttendanceStatus = 'present' | 'absent' | 'half' | null;

interface KarigarRow {
  id: string;
  name: string;
  karigar_code: string;
  status: AttendanceStatus;
}

interface AttendanceRowProps {
  item: KarigarRow;
  activeTab: 'today' | 'history';
  saving: boolean;
  onMarkAttendance: (id: string, newStatus: AttendanceStatus) => void;
  renderHistoryCell: (karigarId: string, date: string) => React.ReactNode;
  last14Days: string[];
}

const AttendanceRow = React.memo(function AttendanceRow({
  item,
  activeTab,
  saving,
  onMarkAttendance,
  renderHistoryCell,
  last14Days
}: AttendanceRowProps) {
  const STATUS_CONFIG = {
    present: { label: 'P', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    absent:  { label: 'A', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
    half:    { label: 'H', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  };

  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.slice(0, 2).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.code}>{item.karigar_code}</Text>
      </View>
      
      {activeTab === 'today' ? (
        <View style={styles.buttons}>
          {saving ? (
            <View style={{ width: 130, height: 38, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="small" color={THEME.colors.gold} />
            </View>
          ) : (
            (['present', 'absent', 'half'] as const).map(s => {
              const cfg = STATUS_CONFIG[s];
              const active = item.status === s;
              const anyActive = item.status !== null;
              const dimmed = anyActive && !active;

              return (
                <TouchableOpacity
                  key={s}
                  style={[
                    styles.statusBtn,
                    active && {
                      backgroundColor: cfg.color,
                      borderColor: cfg.color,
                    },
                    dimmed && {
                      opacity: 0.3,
                    }
                  ]}
                  onPress={() => onMarkAttendance(item.id, active ? null : s)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.statusBtnText,
                    { color: active ? '#0A0A0A' : '#6B7280' }
                  ]}>
                    {cfg.label}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      ) : (
        <View style={styles.historyCells}>
          {last14Days.map(date => renderHistoryCell(item.id, date))}
        </View>
      )}
    </View>
  );
}, (prev, next) => {
  return prev.item.id === next.item.id &&
         prev.item.status === next.item.status &&
         prev.saving === next.saving &&
         prev.item.name === next.item.name &&
         prev.item.karigar_code === next.item.karigar_code &&
         prev.activeTab === next.activeTab;
});

export default function AttendanceScreen() {
  const { canMarkAttendance } = useBridgeStatusStore();
  const t = useIndustryConfig();
  const [karigars, setKarigars] = useState<KarigarRow[]>([]);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'today' | 'history'>('today');
  const [saving, setSaving] = useState<Set<string>>(new Set());

  const today = new Date().toISOString().split('T')[0];

  const historyMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const log of historyLogs) {
      map.set(`${log.karigar_id}_${log.attendance_date}`, log.status);
    }
    return map;
  }, [historyLogs]);

  const last14Days = useMemo(() => {
    const dates = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  }, []);

  const renderHistoryCell = useCallback((karigarId: string, date: string) => {
    const record = historyMap.get(`${karigarId}_${date}`);
    const color = record === 'present'
      ? '#10B981'
      : record === 'absent'
      ? '#EF4444'
      : record === 'half'
      ? '#F59E0B'
      : '#1F2937';

    return (
      <View
        key={date}
        style={{
          width: 12,
          height: 12,
          borderRadius: 2,
          backgroundColor: color,
          margin: 1,
        }}
      />
    );
  }, [historyMap]);

  useEffect(() => {
    if (canMarkAttendance) {
      loadKarigars();
    }
  }, [canMarkAttendance]);

  const loadKarigars = async () => {
    setLoading(true);
    setError(null);
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

      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

      // Load karigars, today's attendance, and history in parallel
      const [k, a, h] = await Promise.all([
        supabase.from('karigars')
          .select('id, name, karigar_code')
          .eq('business_id', profileId)
          .eq('status', 'active')
          .order('name'),
        supabase.from('attendance_logs')
          .select('karigar_id, status')
          .eq('business_id', profileId)
          .eq('attendance_date', today),
        supabase.from('attendance_logs')
          .select('karigar_id, attendance_date, status')
          .eq('business_id', profileId)
          .gte('attendance_date', thirtyDaysAgo)
          .order('attendance_date', { ascending: false }),
      ]);

      if (k.error) throw k.error;
      if (a.error) throw a.error;
      if (h.error) throw h.error;

      const attended = new Map(
        (a.data || []).map(r => [r.karigar_id, r.status])
      );

      setHistoryLogs(h.data || []);

      setKarigars((k.data || []).map(kar => ({
        id: kar.id,
        name: kar.name,
        karigar_code: kar.karigar_code || `K-${kar.id.slice(0, 4).toUpperCase()}`,
        status: (attended.get(kar.id) || null) as AttendanceStatus,
      })));
    } catch (err) {
      console.error('Error loading workers:', err);
      setError('Could not load workers. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = useCallback(
    async (karigarId: string, status: AttendanceStatus) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Optimistic update
      setKarigars(prev => prev.map(k =>
        k.id === karigarId ? { ...k, status } : k
      ));

      // Optimistically update history logs too
      setHistoryLogs(prev => {
        const filtered = prev.filter(log => !(log.karigar_id === karigarId && log.attendance_date === today));
        if (status) {
          filtered.push({
            karigar_id: karigarId,
            attendance_date: today,
            status: status
          });
        }
        return filtered;
      });

      setSaving(prev => new Set([...prev, karigarId]));

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

        const result = await writeWithSync(
          'attendance_logs',
          {
            business_id: profileId,
            karigar_id: karigarId,
            attendance_date: today,
            status,
          },
          {
            operation: 'upsert',
            conflictColumns: ['business_id', 'karigar_id', 'attendance_date'],
            notifyHub: 'ATTENDANCE_LOGGED',
          }
        );

        if (!result.success) {
          setSuccessMsg('Saved to offline queue');
        } else {
          setSuccessMsg('Attendance saved');
        }
        setShowSuccess(true);

      } catch (err) {
        console.error('Attendance save failed:', err);
        // Revert on failure to database
        setKarigars(prev => prev.map(k =>
          k.id === karigarId ? { ...k, status: null } : k
        ));
        Alert.alert('Error', 'Failed to save attendance.');
      } finally {
        setSaving(prev => {
          const next = new Set(prev);
          next.delete(karigarId);
          return next;
        });
      }
    },
    [today]
  );

  const markAllPresent = async () => {
    const unmarked = karigars.filter(k => !k.status);
    if (unmarked.length === 0) {
      Alert.alert('Info', 'All workers already marked');
      return;
    }

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

      Alert.alert(
        'Mark All Present',
        `Mark ${unmarked.length} unmarked workers as present?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Mark All Present',
            onPress: async () => {
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success
              );

              // Optimistic update of local state
              setKarigars(prev => prev.map(k => 
                !k.status ? { ...k, status: 'present' } : k
              ));

              // Optimistically update history logs too
              setHistoryLogs(prev => {
                const next = [...prev];
                for (const k of unmarked) {
                  const idx = next.findIndex(log => log.karigar_id === k.id && log.attendance_date === today);
                  if (idx !== -1) {
                    next[idx] = { karigar_id: k.id, attendance_date: today, status: 'present' };
                  } else {
                    next.push({ karigar_id: k.id, attendance_date: today, status: 'present' });
                  }
                }
                return next;
              });

              for (const k of unmarked) {
                writeWithSync(
                  'attendance_logs',
                  {
                    business_id: profileId,
                    karigar_id: k.id,
                    attendance_date: today,
                    status: 'present',
                  },
                  {
                    operation: 'upsert',
                    conflictColumns: [
                      'business_id',
                      'karigar_id',
                      'attendance_date'
                    ],
                    notifyHub: 'ATTENDANCE_LOGGED',
                  }
                );
              }

              setSuccessMsg('Bulk attendance saved');
              setShowSuccess(true);
            }
          }
        ]
      );
    } catch (err) {
      console.error('Bulk mark present failed:', err);
      Alert.alert('Error', 'Failed to save bulk attendance.');
    }
  };

  const renderKarigar = useCallback(({ item }: { item: KarigarRow }) => (
    <AttendanceRow 
      item={item} 
      activeTab={activeTab}
      saving={saving.has(item.id)}
      onMarkAttendance={markAttendance}
      renderHistoryCell={renderHistoryCell}
      last14Days={last14Days}
    />
  ), [activeTab, saving, markAttendance, renderHistoryCell, last14Days]);

  const presentCount = karigars.filter(k => k.status === 'present').length;
  const absentCount = karigars.filter(k => k.status === 'absent').length;

  if (!canMarkAttendance) {
    return (
      <ScreenContainer style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <ScreenHeader title="Mark Attendance" showBack={false} />
        <EmptyState
          icon="🔒"
          title="Access Denied"
          description="You do not have permission to mark attendance. Please contact your factory administrator."
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <Stack.Screen options={{
        headerShown: false,
      }} />
      <ScreenHeader title="Mark Attendance" showBack={false} />
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'today' && styles.tabActive]}
          onPress={() => setActiveTab('today')}
        >
          <Text style={[styles.tabText, activeTab === 'today' && styles.tabTextActive]}>Today</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'history' && styles.tabActive]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>History (14d)</Text>
        </TouchableOpacity>
      </View>

      {/* Summary bar */}
      <View style={styles.summaryContainer}>
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {presentCount} present  ·  {absentCount} absent
          </Text>
        </View>
        {activeTab === 'today' && karigars.some(k => !k.status) && (
          <TouchableOpacity
            style={styles.bulkBtn}
            onPress={markAllPresent}
          >
            <Text style={styles.bulkBtnText}>⚡ Mark All Present</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <SkeletonRow lines={6} />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={loadKarigars}
        />
      ) : karigars.length === 0 ? (
        <EmptyState
          icon="👷"
          title={`No ${t.workers.toLowerCase()} registered`}
          description={`Add ${t.workers.toLowerCase()} in Noxis Hub on your factory PC first.`}
        />
      ) : (
        <FlatList
          data={karigars}
          extraData={{ activeTab, saving, historyMap }}
          keyExtractor={item => item.id}
          renderItem={renderKarigar}
          contentContainerStyle={{
            paddingBottom: 24
          }}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          getItemLayout={(_data, index) => ({
            length: 72,
            offset: 72 * index,
            index,
          })}
        />
      )}

      {activeTab === 'history' && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>P</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.legendText}>H</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>A</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#1F2937' }]} />
            <Text style={styles.legendText}>None</Text>
          </View>
        </View>
      )}

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
    backgroundColor: THEME.colors.bg 
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#0F1114',
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 2,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  tabText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  summaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  summary: {
    flex: 1,
    alignItems: 'flex-start',
  },
  summaryText: { 
    fontSize: 11,
    color: THEME.colors.textSecondary, 
    fontFamily: THEME.fonts.mono
  },
  bulkBtn: {
    backgroundColor: 'rgba(96,165,250,0.15)',
    borderColor: 'rgba(96,165,250,0.3)',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  bulkBtnText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  row: { 
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 16,
    height: 72,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
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
    borderRadius: 19, 
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
  historyCells: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: THEME.colors.textSecondary,
    fontFamily: THEME.fonts.mono,
  },
});
