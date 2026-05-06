import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useVocabulary } from '../../../src/store/VocabularyContext';
import { tcpService } from '../../../src/services/TCPClientService';
import { IndustrialSyncIndicator } from '../../../src/components/IndustrialSyncIndicator';

// PILLAR 5: DARK INDUSTRIAL THEME
const COLORS = {
  bg: '#09090b',
  surface: '#18181b',
  accent: '#84cc16', // Cyber-Lime
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#27272a',
};

export default function InwardHome() {
  const router = useRouter();
  const { getLabel } = useVocabulary();
  const [arrivals, setArrivals] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // NUKE SUPABASE: Request data exclusively from Hub
  const fetchFromHub = () => {
    setIsRefreshing(true);
    tcpService.sendMessage({ type: 'REQ_INWARD_DATA' });
    // Timeout safety for refreshing state
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  useEffect(() => {
    const handleData = (data: any[]) => {
      setArrivals(data);
      setIsRefreshing(false);
    };

    tcpService.on('inwardDataReceived', handleData);
    fetchFromHub(); // Initial fetch

    return () => {
      tcpService.off('inwardDataReceived', handleData);
    };
  }, []);

  const renderArrivalCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/(app)/scanner`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.arrivalCode}>{item.code}</Text>
        <Ionicons name="time-outline" size={16} color={COLORS.accent} />
      </View>

      <Text style={styles.masterName}>
        {getLabel('worker').toUpperCase()}: {item.master_name || 'UNKNOWN'}
      </Text>
      
      <Text style={styles.articleName}>
        {item.article_name || 'GENERIC ITEM'}
      </Text>
      
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>EXPECTED</Text>
          <Text style={styles.statValue}>{item.target_suits} UNITS</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* GLOBAL SYNC STATUS BAR */}
      <IndustrialSyncIndicator />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{getLabel('unit').toUpperCase()} DOCK</Text>
          <Text style={styles.subtitle}>Slave Mode: Monitoring Hub Broadcast</Text>
        </View>
        
        {/* FIX: Massive 80px touch target for scan button */}
        <TouchableOpacity 
          style={styles.scanBtn} 
          onPress={() => router.push('/(app)/scanner')}
        >
          <Ionicons name="scan" size={32} color={COLORS.bg} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={arrivals}
        keyExtractor={React.useCallback((item: any) => item.id, [])}
        renderItem={renderArrivalCard}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={fetchFromHub} 
            tintColor={COLORS.accent} 
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="cube-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>DOCK IS CLEAR</Text>
            <Text style={styles.emptySub}>Awaiting Hub dispatch...</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
  },
  title: {
    color: COLORS.accent,
    fontWeight: '900',
    fontSize: 24, // Pillar 5: 18px min font
    letterSpacing: 2,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  scanBtn: {
    backgroundColor: COLORS.accent,
    width: 80, // ARCHITECT DIRECTIVE: 80px target
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // Elevation for industrial feel
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  listContent: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 140, // Generous touch area
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  arrivalCode: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  masterName: {
    color: COLORS.accent,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: 4,
  },
  articleName: {
    color: COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 22, // Pillar 5: 18px min font
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 16,
  },
  stat: {
    flexDirection: 'column',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    color: COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 18,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontWeight: '900',
    fontSize: 20,
    marginTop: 20,
  },
  emptySub: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 8,
  }
});
