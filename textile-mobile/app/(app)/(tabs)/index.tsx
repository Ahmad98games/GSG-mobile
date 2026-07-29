import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Dimensions,
  Animated,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { BridgeStatusBar } from '../../../src/components/shell/BridgeStatusBar';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { useMessageStore } from '../../../src/store/MessageStore';
import { useAnalyticsStore } from '../../../src/store/AnalyticsStore';
import { formatCurrency } from '../../../src/lib/currency/formatCurrency';
import { meshBus, MeshEvent } from '../../../src/services/MeshEventBus';
import { CctvDataService } from '../../../src/services/CctvDataService';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Haptics from 'expo-haptics';

import { DashboardWidgetSkeleton } from '../../../src/components/ui/SkeletonLoader';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const { connectionState, pairedDeviceCount, tierLimit } = useBridgeStatus();
  const { conversations } = useMessageStore();
  const { todayRevenue } = useAnalyticsStore();
  
  const [loading, setLoading] = useState(false);
  const [cameras, setCameras] = useState<any[]>([]);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [alertData, setAlertData] = useState<any>(null);

  const unreadCount = Array.isArray(conversations) ? conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0) : 0;

  useEffect(() => {
    refreshCameraStatus();
    
    const unsubBreach = meshBus.subscribe(MeshEvent.SENTINEL_BREACH, (payload: any) => {
      setCameras(prev => prev.map(c => 
        c.camera_id === payload.node_id ? { ...c, status: 'breach', last_frame_at: Date.now() } : c
      ));
    });

    const unsubHeartbeat = meshBus.subscribe(MeshEvent.HEARTBEAT_ALERT, (payload: any) => {
      if (payload.alert_type === 'node_offline') {
        setCameras(prev => prev.map(c => 
          c.camera_id === payload.node_id ? { ...c, status: 'offline' } : c
        ));
      }
    });

    const unsubPresence = meshBus.subscribe(MeshEvent.PRESENCE_UPDATE, (payload: any) => {
      setCameras(prev => prev.map(c => 
        c.camera_id === payload.node_id ? { ...c, status: payload.status } : c
      ));
    });

    return () => {
      unsubBreach();
      unsubHeartbeat();
      unsubPresence();
    };
  }, []);

  const refreshCameraStatus = async () => {
    setLoading(true);
    try {
      const res = await CctvDataService.fetchCameraStatus();
      setCameras(res);
    } catch (e) {
      console.error('[Dashboard] Camera fetch failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSystemLock = async () => {
    const auth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Biometric Auth Required for System Lock',
    });

    if (auth.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      const { tcpService } = require('../../../src/services/TCPClientService');
      tcpService.sendEvent('NspEnvelope', {
        system_lock: {
          issued_by_node_id: 'MOBILE_ADMIN',
          reason: 'MANUAL_LOCK',
          timestamp: Date.now(),
          lock: true
        }
      });
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Dashboard', headerShown: false }} />
      <ScreenHeader title="Dashboard" showBack={true} />
      <BridgeStatusBar />
      
      <ScrollView 
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshCameraStatus} tintColor="#C5A059" />}
      >
        <View style={styles.header}>
          <Text style={styles.brand}>OMNORA INDUSTRIAL PRIME</Text>
          <Text style={styles.title}>Operation Hub</Text>
        </View>

        {loading ? (
          <DashboardWidgetSkeleton />
        ) : (
          <>
            {/* WIDGETS */}
            <View style={styles.widgetGrid}>
          <View style={styles.statWidget}>
            <Text style={styles.widgetLabel}>TODAY'S SALES</Text>
            <Text style={styles.statValue}>{formatCurrency(todayRevenue)}</Text>
            <View style={styles.trendRow}>
              <Ionicons name="trending-up" size={14} color="#10B981" />
              <Text style={styles.trendText}>+12.4%</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.statWidget} onPress={() => router.push('/(app)/(tabs)/messages')}>
            <Text style={styles.widgetLabel}>UNREAD MESSAGES</Text>
            <Text style={[styles.statValue, unreadCount > 0 && { color: '#60A5FA' }]}>{unreadCount}</Text>
            <Text style={styles.trendText}>From {conversations.length} threads</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>COMMAND CENTER</Text>
          <View style={styles.commandGrid}>
             <TouchableOpacity style={styles.commandBtn} onPress={() => router.push('/(app)/stock/lookup')}>
               <Ionicons name="scan" size={28} color="white" />
               <Text style={styles.commandLabel}>Stock Lookup</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.commandBtn} onPress={() => router.push('/(app)/khata/new')}>
               <Ionicons name="journal" size={28} color="white" />
               <Text style={styles.commandLabel}>Quick Khata</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.commandBtn} onPress={() => router.push('/(app)/finance')}>
               <Ionicons name="cash" size={28} color="white" />
               <Text style={styles.commandLabel}>Finance</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.commandBtn} onPress={() => router.push('/(app)/cctv')}>
               <Ionicons name="videocam" size={28} color="white" />
               <Text style={styles.commandLabel}>CCTV Log</Text>
             </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>CCTV NODES</Text>
          </View>
          
          <View style={styles.cameraGrid}>
            {cameras.map(cam => (
              <TouchableOpacity 
                key={cam.camera_id} 
                style={styles.cameraCard}
                onPress={() => router.push(`/(app)/cctv/${cam.camera_id}` as any)}
              >
                <View style={styles.cameraHeader}>
                  <Text style={styles.cameraLabel} numberOfLines={1}>{cam.label}</Text>
                  <View style={[styles.statusDot, { backgroundColor: cam.status === 'online' ? '#10B981' : cam.status === 'breach' ? '#EF4444' : '#6B7280' }]} />
                </View>
                <Text style={styles.cameraSub} numberOfLines={1}>{cam.location}</Text>
                <View style={styles.cameraFooter}>
                  <Text style={styles.cameraMeta}>{cam.bitrate_kbps.toFixed(0)}kbps</Text>
                  <Text style={styles.cameraMeta}>{cam.brand}</Text>
                </View>
                {cam.status === 'breach' && <View style={styles.breachIndicator} />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {tierLimit === 'elite' && ( // Elite Only
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SECURITY OVERRIDE</Text>
            <View style={styles.eliteGrid}>
              <TouchableOpacity style={[styles.eliteBtn, { backgroundColor: '#EF4444' }]} onPress={handleSystemLock}>
                <Ionicons name="lock-closed" size={24} color="white" />
                <Text style={styles.eliteLabel}>SYSTEM LOCK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.eliteBtn, { backgroundColor: '#F59E0B' }]}>
                <Ionicons name="notifications" size={24} color="white" />
                <Text style={styles.eliteLabel}>SOUND ALARM</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.bridgeInfo}>
           <Text style={styles.bridgeText}>Hub: {pairedDeviceCount} Nodes Active</Text>
           <Text style={styles.bridgeSubtext}>AES-256-GCM / Tactical Mesh Enabled</Text>
        </View>
        </>
        )}
      </ScrollView>

      {isAlertActive && (
        <View style={styles.alertOverlay}>
           <Text style={styles.alertTitle}>CRITICAL ALERT</Text>
           <Text style={styles.alertBody}>{alertData?.message}</Text>
           <TouchableOpacity style={styles.ackBtn} onPress={() => setIsAlertActive(false)}>
             <Text style={styles.ackText}>ACKNOWLEDGE</Text>
           </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121417' },
  scroll: { padding: 20, paddingTop: 40 },
  header: { marginBottom: 30 },
  brand: { color: '#C5A059', fontWeight: 'bold', fontSize: 10, letterSpacing: 2 },
  title: { color: 'white', fontSize: 32, fontWeight: '900', marginTop: 4 },
  widgetGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statWidget: { 
    width: (width - 52) / 2, 
    backgroundColor: '#1F2937', 
    padding: 16, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#374151'
  },
  widgetLabel: { color: '#9CA3AF', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  statValue: { color: 'white', fontSize: 24, fontWeight: '900', marginVertical: 8, fontFamily: 'JetBrains Mono' },
  trendRow: { flexDirection: 'row', alignItems: 'center' },
  trendText: { color: '#10B981', fontSize: 10, marginLeft: 4, fontWeight: '600' },
  section: { marginBottom: 30 },
  sectionTitle: { color: '#6B7280', fontSize: 12, fontWeight: 'bold', letterSpacing: 2, marginBottom: 16 },
  commandGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  commandBtn: { 
    width: (width - 64) / 2, 
    backgroundColor: '#1F2937', 
    height: 100, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151'
  },
  commandLabel: { color: 'white', marginTop: 8, fontSize: 12, fontWeight: '600' },
  eliteGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  eliteBtn: { 
    flex: 0.48, 
    height: 60, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  eliteLabel: { color: 'white', fontWeight: 'bold', marginLeft: 10 },
  bridgeInfo: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
  bridgeText: { color: '#4B5563', fontSize: 12, fontWeight: 'bold' },
  bridgeSubtext: { color: '#374151', fontSize: 10, marginTop: 4 },
  alertOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(239, 68, 68, 0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: 30 },
  alertTitle: { color: 'white', fontSize: 36, fontWeight: '900' },
  alertBody: { color: 'white', fontSize: 18, textAlign: 'center', marginVertical: 20 },
  ackBtn: { backgroundColor: 'white', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 12 },
  ackText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
  
  // CCTV GRID STYLES
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAll: { color: '#60A5FA', fontSize: 12, fontWeight: 'bold' },
  cameraGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cameraCard: { 
    width: (width - 52) / 2, 
    backgroundColor: '#1F2937', 
    padding: 16, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#374151',
    position: 'relative',
    overflow: 'hidden'
  },
  cameraHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cameraLabel: { color: 'white', fontSize: 13, fontWeight: 'bold', flex: 1, marginRight: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  cameraSub: { color: '#9CA3AF', fontSize: 10, marginTop: 4 },
  cameraFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, opacity: 0.6 },
  cameraMeta: { color: '#9CA3AF', fontSize: 8, fontWeight: 'bold', fontFamily: 'JetBrains Mono' },
  breachIndicator: { 
    position: 'absolute', 
    top: 0, left: 0, right: 0, bottom: 0, 
    borderWidth: 2, 
    borderColor: '#EF4444', 
    borderRadius: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.05)'
  }
});
