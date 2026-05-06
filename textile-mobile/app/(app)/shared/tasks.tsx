import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Modal 
} from 'react-native';
import { supabase } from '../../../src/lib/supabase';
import { useAuthStore } from '../../../src/store/AuthStore';
import { THEME, COMMON_STYLES } from '../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SyncEngine } from '../../../src/lib/SyncEngine';

/**
 * TACTICAL NODE TASKS (v3.0)
 * Real-time tasking and urgent alert management for industrial mobile nodes.
 */

export default function NodeTasks() {
  const { nodeId } = useAuthStore();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [urgentTask, setUrgentTask] = useState<any>(null);

  useEffect(() => {
    if (!nodeId) return;

    // 1. Fetch initial tasks
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('node_tasks')
        .select('*')
        .eq('target_node_id', nodeId)
        .order('created_at', { ascending: false });

      if (!error && data) setTasks(data);
      setIsLoading(false);
    };

    fetchTasks();

    // 2. Real-time subscription
    const channel = supabase.channel(`tasks:${nodeId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'node_tasks' 
      }, (payload) => {
        const newTask = payload.new;
        if (newTask.target_node_id === nodeId) {
          setTasks(prev => [newTask, ...prev]);
          
          if (newTask.task_type === 'URGENT_ALERT') {
            setUrgentTask(newTask);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            // Flash-vibrate pattern for urgent alerts
            const pattern = [0, 500, 200, 500];
            // Haptics.vibrateAsync(2000); // Simple vibration
          } else {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'node_tasks'
      }, (payload) => {
        setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [nodeId]);

  const acknowledgeTask = async (taskId: string) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'ACKNOWLEDGED' } : t));
      if (urgentTask?.id === taskId) setUrgentTask(null);

      await SyncEngine.enqueue('TASK_ACKNOWLEDGE', { task_id: taskId });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      console.error('Task Ack Error:', err);
    }
  };

  const renderTask = ({ item }: { item: any }) => (
    <View style={[styles.taskCard, item.status === 'ACKNOWLEDGED' && styles.taskAck]}>
      <View style={styles.taskHeader}>
        <Ionicons 
            name={item.task_type === 'URGENT_ALERT' ? "alert-circle" : "clipboard-outline"} 
            size={20} 
            color={item.task_type === 'URGENT_ALERT' ? THEME.colors.status.danger : THEME.colors.blue} 
        />
        <Text style={styles.taskType}>{item.task_type}</Text>
        <Text style={styles.taskTime}>{new Date(item.created_at).toLocaleTimeString()}</Text>
      </View>
      
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskBody}>{item.body?.message || 'New tactical directive from PC.'}</Text>
      
      {item.status !== 'ACKNOWLEDGED' && (
        <TouchableOpacity style={styles.ackBtn} onPress={() => acknowledgeTask(item.id)}>
          <Text style={styles.ackBtnText}>ACKNOWLEDGE</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={COMMON_STYLES.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TACTICAL DIRECTIVES</Text>
        <Text style={styles.headerSub}>NODE {nodeId?.slice(0, 8)} COMMAND STACK</Text>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={isLoading ? <ActivityIndicator color={THEME.colors.blue} style={{ marginTop: 50 }} /> : (
          <View style={styles.empty}>
            <Ionicons name="shield-checkmark-outline" size={60} color={THEME.colors.surfaceLighter} />
            <Text style={styles.emptyText}>ALL DIRECTIVES EXECUTED</Text>
          </View>
        )}
      />

      {/* URGENT ALERT TAKEOVER */}
      <Modal visible={!!urgentTask} animationType="slide" transparent={false}>
        <View style={styles.urgentWrapper}>
          <View style={styles.urgentBanner}>
            <Ionicons name="warning" size={100} color={THEME.colors.status.danger} />
            <Text style={styles.urgentTitle}>URGENT COMMAND ALERT</Text>
            <View style={styles.urgentDivider} />
          </View>

          <View style={styles.urgentContent}>
             <Text style={styles.urgentTaskTitle}>{urgentTask?.title}</Text>
             <Text style={styles.urgentTaskBody}>{urgentTask?.body?.message}</Text>
             <Text style={styles.urgentSource}>ISSUED BY: COMMAND CENTER [PC]</Text>
          </View>

          <TouchableOpacity 
            style={styles.urgentAckBtn} 
            onPress={() => acknowledgeTask(urgentTask.id)}
          >
            <Text style={styles.urgentAckText}>ACKNOWLEDGE & DISMISS</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { padding: 24, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  headerTitle: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.manropeBold, fontSize: 20, letterSpacing: 1 },
  headerSub: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, fontSize: 9, marginTop: 4 },
  list: { padding: 16 },
  taskCard: { backgroundColor: THEME.colors.surface, padding: 20, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: THEME.colors.border },
  taskAck: { opacity: 0.5, borderColor: 'transparent' },
  taskHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
  taskType: { color: THEME.colors.text.secondary, fontFamily: THEME.fonts.monoBold, fontSize: 10, flex: 1 },
  taskTime: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, fontSize: 9 },
  taskTitle: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.manropeBold, fontSize: 16, marginBottom: 8 },
  taskBody: { color: THEME.colors.text.secondary, fontFamily: THEME.fonts.inter, fontSize: 14, lineHeight: 20 },
  ackBtn: { backgroundColor: THEME.colors.blue, paddingVertical: 12, borderRadius: 8, marginTop: 16, alignItems: 'center' },
  ackBtnText: { color: THEME.colors.background, fontFamily: THEME.fonts.manropeBold, fontSize: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100, opacity: 0.3 },
  emptyText: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, marginTop: 20 },

  urgentWrapper: { flex: 1, backgroundColor: THEME.colors.background, padding: 32, justifyContent: 'center' },
  urgentBanner: { alignItems: 'center', marginBottom: 40 },
  urgentTitle: { color: THEME.colors.status.danger, fontFamily: THEME.fonts.manropeBold, fontSize: 28, textAlign: 'center', marginTop: 24 },
  urgentDivider: { width: 100, height: 4, backgroundColor: THEME.colors.status.danger, marginTop: 20, borderRadius: 2 },
  urgentContent: { marginBottom: 60 },
  urgentTaskTitle: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.manropeBold, fontSize: 24, textAlign: 'center', marginBottom: 20 },
  urgentTaskBody: { color: THEME.colors.text.secondary, fontFamily: THEME.fonts.inter, fontSize: 18, textAlign: 'center', lineHeight: 28 },
  urgentSource: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 12, textAlign: 'center', marginTop: 40 },
  urgentAckBtn: { backgroundColor: THEME.colors.status.danger, paddingVertical: 20, borderRadius: 12, alignItems: 'center' },
  urgentAckText: { color: 'white', fontFamily: THEME.fonts.manropeBold, fontSize: 16, letterSpacing: 2 }
});
