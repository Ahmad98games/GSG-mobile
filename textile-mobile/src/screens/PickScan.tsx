import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Alert,
  TextInput,
  ActivityIndicator
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from "@/lib/supabase";

/**
 * SURGICAL PICKING SCREEN
 * High-precision verification of batch quantities against order requirements.
 */
export default function PickScan() {
  const { nodeId } = useAuthStore();
  const router = useRouter();
  const { status, queueCount } = useConnection();
  const isSyncing = status === 'SYNCING';
  const params = useLocalSearchParams<{ 
    target_item_name?: string; 
    target_quantity?: string;
    order_id?: string;
  }>();

  const { permission, requestPermission } = useScanner();
  const [currentBatch, setCurrentBatch] = useState<any | null>(null);
  const [pickQuantity, setPickQuantity] = useState(params.target_quantity || '');
  const [isScanning, setIsScanning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        <Ionicons name="shield-checkmark" size={64} color={THEME.colors.blue} />
        <Text style={styles.permissionTitle}>AUTH REQUIRED</Text>
        <TacticalButton title="GRANT CAMERA ACCESS" onPress={requestPermission} style={styles.permissionBtn} />
      </View>
    );
  }

  const handleScan = async ({ data }: { data: string }) => {
    if (!isScanning) return;
    handleUserActivity();
    
    try {
      if (data.startsWith('GS-BATCH')) {
        const batchId = data.split(':')[1];
        setIsScanning(false);
        feedback.success();

        const { data: batch, error } = await supabase
          .from('products')
          .select('*')
          .eq('qr_code', batchId)
          .single();

        if (error || !batch) throw new Error('BATCH_NOT_FOUND');
        
        if (params.target_item_name && !batch.item_name.includes(params.target_item_name)) {
          feedback.error();
          Alert.alert('MISMATCH DETECTED', `Expected: ${params.target_item_name}\nScanned: ${batch.item_name}`);
          setIsScanning(true);
          return;
        }

        setCurrentBatch(batch);
      }
    } catch (err) {
      feedback.error();
      Alert.alert('ERROR', 'Invalid Batch Security Protocol.');
      setIsScanning(true);
    }
  };

  const executePick = async () => {
    if (!currentBatch || !nodeId) return;
    handleUserActivity();
    setIsSubmitting(true);

    try {
      const qty = parseFloat(pickQuantity);
      if (isNaN(qty) || qty <= 0) throw new Error('INVALID_QUANTITY');

      await queueManager.addToQueue('PICK_BATCH', {
        batch_id: currentBatch.id,
        quantity: qty,
        expected_version: currentBatch.version || 1,
        order_id: params.order_id || 'DIRECT_PICK',
        performed_by: nodeId
      });

      feedback.success();
      Alert.alert('PICK REGISTERED', 'Operation queued for synchronization.');
      router.back();
    } catch (err) {
      feedback.error();
      Alert.alert('PICK FAILURE', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
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

      {/* Target Header */}
      <View style={styles.header}>
        <View style={styles.targetInfo}>
          <Text style={styles.label}>TARGET REQUIREMENT</Text>
          <Text style={styles.targetName}>{params.target_item_name || 'MANUAL SELECTION'}</Text>
          <Text style={styles.targetQty}>{params.target_quantity ? `${params.target_quantity} GAZ` : 'QUANTITY PENDING'}</Text>
        </View>
      </View>

      <View style={styles.viewport}>
        {isScanning ? (
          <CameraView 
            style={StyleSheet.absoluteFillObject} 
            onBarcodeScanned={handleScan}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
        ) : (
          <View style={styles.batchResult}>
             <View style={styles.resultHeader}>
                <Ionicons name="cube" size={24} color={THEME.colors.gold} />
                <Text style={styles.resultType}>BATCH_VERIFIED</Text>
             </View>
             <Text style={styles.resultName}>{currentBatch?.item_name}</Text>
             <Text style={styles.resultMeta}>AVAIL: {currentBatch?.total_gaz} GAZ // {currentBatch?.item_category}</Text>
          </View>
        )}
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PICKING QUANTITY (GAZ)</Text>
          <TextInput 
            style={styles.input}
            keyboardType="decimal-pad"
            value={pickQuantity}
            onChangeText={setPickQuantity}
            placeholder="0.00"
            placeholderTextColor={THEME.colors.muted}
            editable={!isScanning}
          />
        </View>

        <View style={styles.actions}>
          <TacticalButton 
            title="RESCAN" 
            variant="ghost" 
            onPress={() => { handleUserActivity(); setIsScanning(true); setCurrentBatch(null); }} 
            style={{ flex: 1 }}
          />
          <TacticalButton 
            title="COMMIT PICK" 
            onPress={executePick} 
            disabled={isScanning || !pickQuantity}
            loading={isSubmitting}
            style={{ flex: 2 }}
          />
        </View>
      </View>

      <EmergencyButton />
    </View>
  );
}

const styles = StyleSheet.create({
  centered: { justifyContent: 'center', alignItems: 'center', padding: 40 },
  permissionTitle: { color: THEME.colors.blue, fontFamily: THEME.fonts.manropeBold, marginTop: 20 },
  permissionBtn: { marginTop: 40, width: '100%' },

  syncBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.colors.gold, paddingVertical: 8, gap: 10 },
  syncText: { color: 'black', fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 1 },

  header: { padding: 24, backgroundColor: THEME.colors.surface, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  label: { color: THEME.colors.muted, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 2 },
  targetInfo: { gap: 4 },
  targetName: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.manropeBold, fontSize: 18, marginTop: 4 },
  targetQty: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 12, marginTop: 2 },

  viewport: { flex: 0.5, backgroundColor: '#000' },
  batchResult: { flex: 1, backgroundColor: THEME.colors.background, padding: 32, justifyContent: 'center' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  resultType: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 2 },
  resultName: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.manropeBold, fontSize: 24 },
  resultMeta: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, fontSize: 12, marginTop: 8 },

  form: { flex: 0.5, padding: 24, justifyContent: 'space-between' },
  inputGroup: { marginTop: 10 },
  inputLabel: { color: THEME.colors.muted, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 1, marginBottom: 12 },
  input: { 
    backgroundColor: THEME.colors.surface, 
    height: 72, 
    borderRadius: 12, 
    paddingHorizontal: 20, 
    fontSize: 32, 
    color: THEME.colors.text.primary, 
    fontFamily: THEME.fonts.monoBold,
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  
  actions: { flexDirection: 'row', gap: 12, marginBottom: 10 }
});
