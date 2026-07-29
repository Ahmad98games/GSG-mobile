import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { THEME } from '../../../../src/constants/theme';
import { usePersona } from '../../../../src/hooks/usePersona';
import { CctvDataService } from '../../../../src/services/CctvDataService';
import { BridgeStatusBar } from '../../../../src/components/shell/BridgeStatusBar';
import { formatDistanceToNow } from 'date-fns';
import { ScreenHeader } from '../../../../src/components/navigation/ScreenHeader';

/**
 * CAMERA DETAIL (M7)
 * Deep-dive into a specific camera node's telemetry and history.
 */
export default function CameraDetail() {
  const { cameraId } = useLocalSearchParams();
  const router = useRouter();
  const { t } = usePersona();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [camera, setCamera] = useState<any>(null);

  useEffect(() => {
    loadCameraData();
  }, [cameraId]);

  const loadCameraData = async () => {
    setLoading(true);
    try {
      const [history, cameras] = await Promise.all([
        CctvDataService.fetchDetectionHistory({ cameraNodeId: cameraId as string }),
        CctvDataService.fetchCameraStatus()
      ]);
      setEvents(history.events || []);
      const cam = cameras.find((c: any) => c.camera_id === cameraId);
      setCamera(cam);
    } catch (e) {
      console.error('[CameraDetail] Load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderEvent = ({ item }: { item: any }) => {
    const classColor = item.detected_class === 'fire' ? THEME.colors.critical : 
                       item.detected_class === 'person' ? THEME.colors.blue : THEME.colors.gold;

    return (
      <View style={styles.eventRow}>
        <Image 
          source={{ uri: item.thumbnail_url }} 
          style={styles.thumbnail} 
          cachePolicy="disk"
          contentFit="cover"
          transition={200}
        />
        <View style={styles.eventContent}>
          <View style={styles.row}>
            <View style={[styles.badge, { backgroundColor: classColor + '20' }]}>
              <Text style={[styles.badgeText, { color: classColor }]}>{item.detected_class.toUpperCase()}</Text>
            </View>
            <Text style={styles.confidence}>{Math.round(item.confidence * 100)}%</Text>
          </View>
          <Text style={styles.cameraLabel}>{item.zone_label || 'Active Area'}</Text>
          <Text style={styles.timestamp}>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false, title: camera?.label || t('CAMERA_DETAIL'), 
          headerStyle: { backgroundColor: THEME.colors.bg }, 
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '900' }
        }} 
      />
      <ScreenHeader title="Page" showBack={true} />
      <BridgeStatusBar />

      {camera && (
        <View style={styles.statsHeader}>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: camera.status === 'online' ? THEME.colorStatus.online : THEME.colorStatus.offline }]} />
            <Text style={styles.statusText}>{camera.status.toUpperCase()}</Text>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BITRATE</Text>
              <Text style={styles.statValue}>{camera.bitrate_kbps.toFixed(0)} <Text style={styles.statUnit}>kbps</Text></Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>BRIGHTNESS</Text>
              <Text style={styles.statValue}>{Math.round(camera.avg_brightness * 100)}%</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>AI STATUS</Text>
              <Text style={[styles.statValue, { color: camera.ai_enabled ? THEME.colors.blue : THEME.colors.textSecondary }]}>
                {camera.ai_enabled ? 'ACTIVE' : 'OFF'}
              </Text>
            </View>
          </View>
          
          <Text style={styles.cameraInfo}>{camera.brand} • {camera.model_number} • {camera.location}</Text>
        </View>
      )}

      <FlatList
        data={events}
        keyExtractor={item => item.event_id}
        renderItem={renderEvent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadCameraData} tintColor={THEME.colors.gold} />}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={styles.sectionTitle}>{t('DETECTION_HISTORY').toUpperCase()}</Text>
          </View>
        )}
        ListEmptyComponent={() => !loading && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('NO_DETECTIONS_FOR_CAMERA')}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  statsHeader: { padding: 20, backgroundColor: THEME.colors.surface, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { color: 'white', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: THEME.colors.bg, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: THEME.colors.border },
  statLabel: { color: THEME.colors.textSecondary, fontSize: 8, fontWeight: 'bold', letterSpacing: 1 },
  statValue: { color: 'white', fontSize: 16, fontWeight: '700', marginTop: 4, fontFamily: THEME.fonts.mono },
  statUnit: { fontSize: 10, color: THEME.colors.textSecondary },
  cameraInfo: { color: THEME.colors.textSecondary, fontSize: 9, marginTop: 16, textAlign: 'center', letterSpacing: 0.5 },
  listHeader: { padding: 20, paddingBottom: 10 },
  sectionTitle: { color: THEME.colors.textSecondary, fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  list: { paddingBottom: 40 },
  eventRow: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: THEME.colors.border, alignItems: 'center' },
  thumbnail: { width: 72, height: 72, borderRadius: 14, backgroundColor: THEME.colors.bg },
  eventContent: { flex: 1, marginLeft: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  confidence: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.mono },
  cameraLabel: { color: 'white', fontSize: 15, fontWeight: '700', marginTop: 6 },
  timestamp: { color: THEME.colors.textSecondary, fontSize: 10, marginTop: 4, fontFamily: THEME.fonts.mono },
  empty: { marginTop: 40, alignItems: 'center' },
  emptyText: { color: THEME.colors.textSecondary, fontSize: 12, fontWeight: '600' }
});
