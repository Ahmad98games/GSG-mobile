import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ActivityIndicator, 
  Alert,
  PanResponder
} from 'react-native';
import { CameraView } from 'expo-camera';
import { useScanner } from '../hooks/useScanner';
import { THEME, COMMON_STYLES } from '../constants/DesignSystem';
import { TacticalButton } from '../components/TacticalButton';
import { EmergencyButton } from '../components/EmergencyButton';
import { queueManager } from '../services/OfflineQueueManager';
import { useConnection } from '../store/ConnectionContext';
import { useAuthStore } from '../store/AuthStore';
import { energyShield } from '../services/EnergyShieldService';
import { feedback } from '../services/FeedbackService';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { supabase } from "@/lib/supabase";

/**
 * TACTICAL INWARD SCREEN
 * Optimized for rapid stock arrival and batch registration.
 */
export default function InwardScan() {
  const { nodeId } = useAuthStore();
  const { permission, requestPermission } = useScanner();
  const { status, queueCount } = useConnection();
  const isSyncing = status === 'SYNCING';
  const [scannedData, setScannedData] = useState<{ id: string; name: string; type: 'BATCH' | 'GENERIC' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(true);

  // Energy Shield: Reset idle timer on mount and activity
  useEffect(() => {
    energyShield.resetIdleTimer();
  }, []);

  const handleUserActivity = () => {
    energyShield.resetIdleTimer();
  };

  if (!permission) return <View style={COMMON_STYLES.container} />;

  if (!permission.granted) {
    return (
      <View style={[COMMON_STYLES.container, styles.centered]}>
        <Ionicons name="camera-outline" size={64} color={THEME.colors.gold} />
        <Text style={styles.permissionTitle}>CAMERA REQUIRED</Text>
        <TacticalButton title="ENABLE CAMERA" onPress={requestPermission} style={styles.permissionBtn} />
      </View>
    );
  }

  const handleScan = async ({ data }: { data: string }) => {
    if (!isScanning) return;
    handleUserActivity();
    setIsScanning(false);
    setIsProcessing(true);
    feedback.success();

    try {
      if (data.startsWith('GS-BATCH')) {
        const batchId = data.split(':')[1];
        const { data: batch, error } = await supabase
          .from('products')
          .select('id, item_name')
          .eq('qr_code', batchId)
          .single();

        if (error || !batch) throw new Error('BATCH_NOT_FOUND');
        setScannedData({ id: batch.id, name: batch.item_name, type: 'BATCH' });
      } else {
        setScannedData({ id: data, name: 'Generic Item', type: 'GENERIC' });
      }
    } catch (err) {
      feedback.error();
      Alert.alert('SCAN ERROR', 'Unrecognized protocol or missing metadata.');
      setIsScanning(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmInward = async () => {
    if (!scannedData || !nodeId) return;
    handleUserActivity();
    setIsProcessing(true);

    try {
      await queueManager.addToQueue('INWARD_STOCK', {
        batch_id: scannedData.id,
        quantity: 1,
        performed_by: nodeId,
        note: 'MOBILE_INWARD_PROTOCOL_v3.5'
      });

      feedback.success();
      setScannedData(null);
      setIsScanning(true);
    } catch (err) {
      feedback.error();
      Alert.alert('SYNC_ERROR', 'Operation failed to queue.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={COMMON_STYLES.container} onStartShouldSetResponderCapture={() => { handleUserActivity(); return false; }}>
      {/* Sync Status Banner */}
      {isSyncing && (
        <View style={styles.syncBanner}>
          <ActivityIndicator size="small" color="black" />
          <Text style={styles.syncText}>SYNCING {queueCount} PENDING ACTIONS...</Text>
        </View>
      )}

      <View style={styles.viewport}>
        {isScanning ? (
          <CameraView 
            style={StyleSheet.absoluteFillObject} 
            onBarcodeScanned={handleScan}
            barcodeScannerSettings={{ barcodeTypes: ['qr', 'code128'] }}
          />
        ) : (
          <View style={styles.frozenView}>
             <Ionicons name="checkmark-circle" size={80} color={THEME.colors.status.success} />
             <Text style={styles.frozenText}>{scannedData?.type === 'BATCH' ? 'PROTOCOL_MATCH' : 'GENERIC_BARCODE'}</Text>
          </View>
        )}
        
        <View style={styles.overlay}>
           <View style={styles.reticle} />
        </View>
      </View>

      <View style={styles.controlPanel}>
        {scannedData ? (
          <View style={styles.card}>
            <Text style={styles.label}>DISCOVERED ASSET</Text>
            <Text style={styles.assetName}>{scannedData.name}</Text>
            <Text style={styles.assetId}>{scannedData.id}</Text>
            
            <View style={styles.actions}>
              <TacticalButton 
                title="CANCEL" 
                variant="ghost" 
                onPress={() => { handleUserActivity(); setScannedData(null); setIsScanning(true); }} 
                style={{ flex: 1 }}
              />
              <TacticalButton 
                title="INWARD" 
                onPress={confirmInward} 
                loading={isProcessing}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.idleState}>
             <ActivityIndicator color={THEME.colors.blue} />
             <Text style={styles.idleText}>AWAITING PROTOCOL SCAN...</Text>
             {queueCount > 0 && !isSyncing && (
               <Text style={styles.pendingOfflineText}>{queueCount} PENDING OFFLINE</Text>
             )}
          </View>
        )}
      </View>

      <EmergencyButton />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: 'center', alignItems: 'center', padding: 40 },
  permissionTitle: { color: THEME.colors.gold, fontFamily: THEME.fonts.manropeBold, marginTop: 20 },
  permissionBtn: { marginTop: 40, width: '100%' },
  
  syncBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.colors.gold, paddingVertical: 8, gap: 10 },
  syncText: { color: 'black', fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 1 },

  viewport: { flex: 0.6, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
  reticle: { width: 250, height: 250, borderWidth: 2, borderColor: THEME.colors.blue, borderRadius: 20, opacity: 0.5 },
  
  frozenView: { flex: 1, backgroundColor: THEME.colors.background, justifyContent: 'center', alignItems: 'center' },
  frozenText: { color: THEME.colors.status.success, fontFamily: THEME.fonts.monoBold, marginTop: 20, fontSize: 12 },

  controlPanel: { flex: 0.4, padding: 24, backgroundColor: THEME.colors.background },
  card: { ...COMMON_STYLES.card, flex: 1, justifyContent: 'space-between' },
  label: { color: THEME.colors.muted, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 2 },
  assetName: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.manropeBold, fontSize: 24, marginTop: 8 },
  assetId: { color: THEME.colors.blue, fontFamily: THEME.fonts.mono, fontSize: 12, marginTop: 4 },
  
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  
  idleState: { flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5 },
  idleText: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, fontSize: 10, marginTop: 16 },
  pendingOfflineText: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 9, marginTop: 8 }
});
