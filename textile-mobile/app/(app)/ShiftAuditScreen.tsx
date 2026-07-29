import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Eye } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { queueManager } from '../../src/services/OfflineQueueManager';
import type { QueueItem } from '../../src/services/OfflineQueueManager';
import { tcpService } from '../../src/services/TCPClientService';
import { useVocabulary } from '../../src/store/VocabularyContext';
import { useConnection } from '../../src/store/ConnectionContext';
import { IndustrialSyncIndicator } from '../../src/components/IndustrialSyncIndicator';
import { ScreenHeader } from '../../src/components/navigation/ScreenHeader';

const COLORS = {
  bg: '#09090b',
  surface: '#18181b',
  accent: '#84cc16', // Cyber-Lime
  pending: '#ea580c', // Deep Orange
  blue: '#60a5fa',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#27272a',
};

export default function ShiftAuditScreen() {
  const { getLabel } = useVocabulary();
  const { queueCount, isOnline } = useConnection();
  const [history, setHistory] = useState<QueueItem[]>([]);
  const pulseAnim = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    // Initial Load
    setHistory(queueManager.getHistory());

    // Subscribe to queue updates
    const handleUpdate = () => {
      setHistory(queueManager.getHistory());
    };
    queueManager.on('update', handleUpdate);

    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();

    return () => {
      queueManager.off('update', handleUpdate);
      pulse.stop();
    };
  }, []);

  const handleForceSync = async () => {
    // PILLAR 5: Heavy haptic on force sync
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (isOnline) {
      await tcpService.drainQueue();
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const renderItem = ({ item }: { item: QueueItem }) => {
    const isDone = item.status === 'DONE';

    return (
      <View style={[styles.card, { borderColor: isDone ? COLORS.accent : COLORS.pending }]}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardType}>{item.type.replace('_', ' ')}</Text>
          <Text style={styles.cardVal}>{item.payload.amount} {getLabel('unit').toUpperCase()}</Text>
          <Text style={styles.cardTs}>{new Date(item.ts).toLocaleTimeString()}</Text>
        </View>

        <View style={styles.statusContainer}>
          {isDone && (
            <View style={styles.evidenceBadge}>
              <Eye size={14} color={COLORS.accent} strokeWidth={3} />
              <Text style={styles.evidenceText}>CCTV</Text>
            </View>
          )}
          <Animated.View 
            style={[
              styles.statusIndicator, 
              { backgroundColor: isDone ? COLORS.accent : COLORS.pending },
              !isDone && { opacity: pulseAnim }
            ]}
          >
            <Ionicons 
              name={isDone ? "checkmark-circle" : "time"} 
              size={24} 
              color={COLORS.bg} 
            />
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <IndustrialSyncIndicator />

      <ScreenHeader title={`${getLabel('unit').toUpperCase()} AUDIT`} subtitle={`VERIFY ${getLabel('bulk').toUpperCase()} DATA BEFORE CLOCK-OUT`} showBack={true} />

      <FlatList
        data={history}
        keyExtractor={item => item.uuid}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>NO {getLabel('unit').toUpperCase()} LOGGED TODAY</Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        {/* MASSIVE 80px FORCE SYNC BUTTON */}
        <TouchableOpacity 
          style={[styles.syncBtn, !isOnline && styles.syncBtnOffline]}
          onPress={handleForceSync}
          activeOpacity={0.8}
        >
          <Ionicons name="sync" size={32} color={COLORS.bg} />
          <Text style={styles.syncBtnText}>SYNC {getLabel('bulk').toUpperCase()} ({queueCount})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    color: COLORS.accent,
    fontWeight: '900',
    fontSize: 28,
    letterSpacing: 2,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  list: {
    padding: 20,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 100,
  },
  cardInfo: {
    flex: 1,
  },
  cardType: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardVal: {
    color: COLORS.textPrimary,
    fontSize: 24, // Pillar 5: 18px+
    fontWeight: '900',
    marginTop: 4,
  },
  cardTs: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'monospace',
  },
  statusContainer: {
    alignItems: 'center',
    gap: 8,
  },
  evidenceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.2)',
  },
  evidenceText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statusIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  syncBtn: {
    backgroundColor: COLORS.blue,
    height: 80, // ARCHITECT DIRECTIVE: 80px target
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  syncBtnOffline: {
    backgroundColor: COLORS.surface,
    opacity: 0.5,
  },
  syncBtnText: {
    color: COLORS.bg,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  empty: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontWeight: '800',
    fontSize: 16,
  }
});
