import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { usePersona } from '../../../src/hooks/usePersona';
import { CctvDataService } from '../../../src/services/CctvDataService';
import { BridgeStatusBar } from '../../../src/components/shell/BridgeStatusBar';
import { formatDistanceToNow } from 'date-fns';
import { FeatureLock } from '../../../src/components/tier/FeatureLock';

/**
 * SECURITY LOG (M7)
 * Unified timeline for industrial AI vision events.
 */
export default function SecurityLog() {
  const router = useRouter();
  const { t } = usePersona();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [filterClass, setFilterClass] = useState<string>('');

  useEffect(() => {
    loadDetections();
  }, [filterClass]);

  const loadDetections = async () => {
    setLoading(true);
    try {
      const res = await CctvDataService.fetchDetectionHistory({ detectedClass: filterClass });
      setEvents(res.events || []);
    } catch (e) {
      console.error('[SecurityLog] Load failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderEvent = ({ item }: { item: any }) => {
    const classColor = item.detected_class === 'fire' ? THEME.colors.critical : 
                       item.detected_class === 'person' ? THEME.colors.blue : THEME.colors.gold;

    return (
      <TouchableOpacity 
        style={styles.eventRow}
        activeOpacity={0.8}
        onPress={() => router.push(`/(app)/cctv/${item.camera_node_id || item.event_id}`)}
      >
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
          <Text style={styles.cameraLabel}>{item.camera_label}</Text>
          <Text style={styles.locationText}>{item.install_location}</Text>
          {item.zone_label && <Text style={styles.zoneText}>{t('ZONE')}: {item.zone_label}</Text>}
        </View>
        <Text style={styles.timestamp}>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: t('SECURITY_LOG'), 
          headerStyle: { backgroundColor: THEME.colors.bg }, 
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '900' }
        }} 
      />
      <BridgeStatusBar />
      
      <View style={styles.filterContainer}>
        <FlatList
          data={React.useMemo(() => ['', 'person', 'fire', 'vehicle', 'animal'], [])}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={React.useCallback((item: string) => item, [])}
          removeClippedSubviews={true}
          renderItem={({ item: cls }) => (
            <TouchableOpacity 
              style={[styles.filterChip, filterClass === cls && styles.filterChipActive]}
              onPress={() => setFilterClass(cls)}
            >
              <Text style={[styles.filterText, filterClass === cls && styles.filterTextActive]}>
                {cls === '' ? 'ALL' : cls.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterScroll}
        />
      </View>

      <FeatureLock feature="aiDetection" requiredTier="pro">
        <FlatList
          data={events}
          keyExtractor={React.useCallback((item: any) => item.event_id, [])}
          renderItem={renderEvent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadDetections} tintColor={THEME.colors.gold} />}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={8}
          ListEmptyComponent={() => !loading && (
            <View style={styles.empty}>
              <Ionicons name="shield-checkmark" size={48} color={THEME.colors.surface} />
              <Text style={styles.emptyText}>{t('NO_DETECTIONS_PERIOD')}</Text>
            </View>
          )}
          contentContainerStyle={styles.list}
        />
      </FeatureLock>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  filterContainer: { paddingVertical: 12 },
  filterScroll: { paddingHorizontal: 20, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: THEME.colors.surface, borderWidth: 1, borderColor: THEME.colors.border },
  filterChipActive: { backgroundColor: THEME.colors.gold + '20', borderColor: THEME.colors.gold },
  filterText: { color: THEME.colors.textSecondary, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  filterTextActive: { color: THEME.colors.gold },
  list: { paddingBottom: 40 },
  eventRow: { flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: THEME.colors.border, alignItems: 'center' },
  thumbnail: { width: 64, height: 64, borderRadius: 12, backgroundColor: THEME.colors.surface },
  eventContent: { flex: 1, marginLeft: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  confidence: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.mono },
  cameraLabel: { color: 'white', fontSize: 15, fontWeight: '700', marginTop: 6 },
  locationText: { color: THEME.colors.textSecondary, fontSize: 11, marginTop: 2 },
  zoneText: { color: THEME.colors.blue, fontSize: 10, fontWeight: 'bold', marginTop: 4, letterSpacing: 0.5 },
  timestamp: { color: THEME.colors.textSecondary, fontSize: 9, fontFamily: THEME.fonts.mono },
  empty: { marginTop: 120, alignItems: 'center' },
  emptyText: { color: THEME.colors.textSecondary, fontWeight: 'bold', marginTop: 16, letterSpacing: 1 }
});
