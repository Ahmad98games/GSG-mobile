import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Shield, Box, DollarSign, MessageSquare, Lock, Wifi, Check, Trash2, Clock } from 'lucide-react-native';
import { THEME } from '../../../src/constants/theme';
import { usePersona } from '../../../src/hooks/usePersona';
import { openMeshDb } from '../../../src/lib/db/meshDb';
import { formatDistanceToNow } from 'date-fns';

import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';

const PAGE_SIZE = 50;

type NotificationEvent = {
  id: string;
  event_type: string;
  title: string;
  body: string;
  displayed_at: string;
  suppressed: number;
  acknowledged_at: string | null;
  notifee_id: string;
  payload: string;
};

const TYPE_CONFIG: Record<string, { icon: any, color: string }> = {
  sentinel_breach: { icon: Shield, color: THEME.colors.critical },
  low_stock: { icon: Box, color: '#F59E0B' },
  payment_received: { icon: DollarSign, color: '#10B981' },
  tactical_message: { icon: MessageSquare, color: THEME.colors.blue },
  system_lock: { icon: Lock, color: THEME.colors.critical },
  heartbeat_alert: { icon: Wifi, color: THEME.colors.textSecondary },
};

export default function NotificationHistory() {
  const { t } = usePersona();
  const [activeFilter, setActiveFilter] = useState('All');
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastFetchAt, setLastFetchAt] = useState(0);

  const fetchNotifications = useCallback(async (isInitial = true) => {
    if (loading || (!isInitial && !hasMore)) return;

    const now = Date.now();
    if (isInitial && notifications.length > 0 && (now - lastFetchAt < 30000)) {
      return;
    }

    setLoading(true);

    try {
      const db = await openMeshDb();
      let query = 'SELECT * FROM notification_log';
      const params: any[] = [];

      const conditions = [];
      if (activeFilter !== 'All') {
        const typeMap: Record<string, string> = {
          'Security': 'sentinel_breach',
          'Stock': 'low_stock',
          'Payments': 'payment_received',
          'Messages': 'tactical_message',
          'System': 'system_lock'
        };
        conditions.push('event_type = ?');
        params.push(typeMap[activeFilter]);
      }

      if (!isInitial && notifications.length > 0) {
        conditions.push('displayed_at < ?');
        params.push(notifications[notifications.length - 1].displayed_at);
      }

      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      query += ' ORDER BY displayed_at DESC LIMIT ?';
      params.push(PAGE_SIZE);

      const result = await db.getAllAsync<NotificationEvent>(query, params);
      
      if (isInitial) {
        setNotifications(result);
        setLastFetchAt(now);
      } else {
        setNotifications(prev => [...prev, ...result]);
      }
      
      setHasMore(result.length === PAGE_SIZE);
    } catch (e) {
      console.error('[NotificationHistory] Fetch failed:', e);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, notifications, loading, hasMore, lastFetchAt]);

  useEffect(() => {
    fetchNotifications(true);
  }, [activeFilter]);

  const handleClearAll = async () => {
    try {
      const db = await openMeshDb();
      await db.runAsync("UPDATE notification_log SET acknowledged_at = datetime('now') WHERE acknowledged_at IS NULL");
      setLastFetchAt(0);
      fetchNotifications(true);
    } catch (e) {
      console.error('[NotificationHistory] Clear failed:', e);
    }
  };

  const keyExtractor = useCallback((item: NotificationEvent) => item.id, []);
  const getItemLayout = useCallback((_: any, index: number) => ({
    length: 72,
    offset: 72 * index,
    index
  }), []);

  const renderItem = ({ item }: { item: NotificationEvent }) => {
    const config = TYPE_CONFIG[item.event_type] || TYPE_CONFIG.heartbeat_alert;
    const Icon = config.icon;
    const isSuppressed = item.suppressed === 1;
    const isAcked = item.acknowledged_at !== null;

    return (
      <View style={[styles.row, isSuppressed && { opacity: 0.6 }]}>
        <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
          <Icon size={20} color={config.color} />
        </View>
        
        <View style={styles.itemBody}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            {isSuppressed && (
              <View style={styles.suppressedBadge}>
                <Text style={styles.suppressedText}>{t('notifications.suppressed_label').toUpperCase()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.itemText} numberOfLines={2}>{item.body}</Text>
        </View>

        <View style={styles.itemRight}>
          {isAcked ? (
            <Check size={16} color="#10B981" />
          ) : (
            <Text style={styles.timeText}>
              {formatDistanceToNow(new Date(item.displayed_at), { addSuffix: true }).replace('about ', '')}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const filters = ['All', 'Security', 'Stock', 'Payments', 'Messages', 'System'];

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      <ScreenHeader 
        title="Notifications" 
        showBack={true} 
        rightAction={{
          label: "Clear",
          onPress: handleClearAll,
          color: THEME.colors.critical || "#EF4444"
        }}
      />

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map(filter => (
            <TouchableOpacity 
              key={filter} 
              style={[styles.filterTab, activeFilter === filter && styles.activeTab]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
                {filter.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={() => fetchNotifications(false)}
        onEndReachedThreshold={0.5}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
        getItemLayout={getItemLayout}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Clock size={48} color={THEME.colors.border} strokeWidth={1} />
            <Text style={styles.emptyText}>{t('notifications.empty_history')}</Text>
          </View>
        )}
        contentContainerStyle={notifications.length === 0 && { flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  clearBtn: {
    padding: 8,
  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
    paddingVertical: 12,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: THEME.radius.full,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  activeTab: {
    backgroundColor: THEME.colors.blue,
    borderColor: THEME.colors.blue,
  },
  filterText: {
    color: THEME.colors.textSecondary,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
  },
  activeFilterText: {
    color: 'black',
  },
  row: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1D21',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBody: {
    flex: 1,
    gap: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemTitle: {
    color: THEME.colors.textPrimary,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  itemText: {
    color: THEME.colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  itemRight: {
    alignItems: 'flex-end',
    minWidth: 60,
  },
  timeText: {
    color: THEME.colors.textSecondary,
    fontFamily: THEME.fonts.mono,
    fontSize: 10,
  },
  suppressedBadge: {
    backgroundColor: THEME.colors.border,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  suppressedText: {
    color: THEME.colors.textSecondary,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    color: THEME.colors.textSecondary,
    fontFamily: THEME.fonts.mono,
    fontSize: 12,
  }
});
