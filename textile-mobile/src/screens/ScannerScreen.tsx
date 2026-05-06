import React, { useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useProductStore } from '../store/useProductStore';
import { useAuthStore } from '../store/AuthStore';
import { useScanner } from '../hooks/useScanner';
import { useTransaction } from '../hooks/useTransaction';
import { BatchLedgerView } from '../components/BatchLedgerView';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../lib/types';
import { useTranslation } from 'react-i18next';

/**
 * Senior Engineering Protocol: Pure UI Shell
 * This component is now 'Dumb' - it only handles layout and event delegation. 
 * Business logic resides in hooks/stores.
 */
export const ScannerScreen = () => {
  const { t } = useTranslation();
  // Store consumption
  const { 
    currentBatch, 
    mode, 
    transactionType, 
    error, 
    initiateTransaction, 
    resetSession,
    isLinked 
  } = useProductStore();

  const { nodeRole } = useAuthStore();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { permission, requestPermission, handleBarCodeScanned, isIdle, wakeUp } = useScanner();
  const { confirmAndSave, isSubmitting } = useTransaction();
  
  const [quantity, setQuantity] = React.useState('');
  const inputRef = useRef<TextInput>(null);

  // Idiot-Proof Auto-Focus Lifecycle
  useEffect(() => {
    if (mode === 'QUANTITY_INPUT') {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="lock-closed-outline" size={48} color="#D4AF37" />
        <Text style={styles.permissionTitle}>{t('scanner.security_protocol', { defaultValue: 'SECURITY PROTOCOL' })}</Text>
        <Text style={styles.permissionDesc}>
          {t('scanner.permission_desc', { defaultValue: 'CAMERA ACCESS IS REQUIRED FOR ENTERPRISE SCANNING OPERATIONS.' })}
        </Text>
        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.permissionBtn} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>{t('scanner.initialize_access', { defaultValue: 'INITIALIZE ACCESS' })}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* 60% Camera Viewport */}
      <View style={styles.viewport}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={isIdle ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ["qr", "datamatrix"] }}
        />
        
        {/* Engineering Reticle */}
        <View style={styles.reticle}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
          <View style={styles.scanLine} />
        </View>

        <View style={styles.brandOverlay}>
          <Text style={styles.brandText}>GOLD SHE ELITE</Text>
          <View style={styles.statusBadge}>
            <View style={[styles.dot, isLinked && styles.dotActive]} />
            <Text style={styles.statusText}>{isLinked ? t('scanner.node_linked', { defaultValue: 'NODE LINKED' }) : t('scanner.instruction')}</Text>
          </View>
        </View>
        
        {isIdle && (
          <View style={styles.idleOverlay}>
             <Ionicons name="moon-outline" size={64} color="#D4AF37" />
             <Text style={styles.idleTitle}>{t('scanner.idle_title', { defaultValue: 'SCANNER IDLE' })}</Text>
             <Text style={styles.idleSub}>{t('scanner.idle_sub', { defaultValue: 'TO CONSERVE BATTERY' })}</Text>
             <TouchableOpacity style={styles.wakeBtn} onPress={wakeUp}>
               <Text style={styles.wakeText}>{t('scanner.wake_up', { defaultValue: 'WAKE UP SCANNER' })}</Text>
             </TouchableOpacity>
          </View>
        )}

        {/* UNAUTHORIZED NODE OVERLAY */}
        {!isLinked && (
          <View style={styles.unauthorizedOverlay}>
            <Ionicons name="alert-circle" size={64} color="#dc2626" />
            <Text style={styles.unauthorizedTitle}>{t('scanner.unauthorized', { defaultValue: 'UNAUTHORIZED NODE' })}</Text>
            <Text style={styles.unauthorizedSub}>{t('scanner.scan_gatekeeper', { defaultValue: 'SCAN GATEKEEPER QR TO SYNC' })}</Text>
          </View>
        )}
      </View>

      {/* 40% Control Panel */}
      <View style={styles.panel}>
        <View style={styles.navRow}>
          <TouchableOpacity 
            style={styles.navBtn}
            onPress={() => navigation.navigate('TacticalChat')}
          >
            <Ionicons name="chatbubble-ellipses" size={20} color="#D4AF37" />
            <Text style={styles.navBtnText}>{t('scanner.messenger', { defaultValue: 'MESSENGER' })}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.navBtn}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Ionicons name="stats-chart" size={20} color="#D4AF37" />
            <Text style={styles.navBtnText}>{t('scanner.dashboard', { defaultValue: 'DASHBOARD' })}</Text>
          </TouchableOpacity>
        </View>

        {mode === 'SCANNING' ? (
          <View style={styles.panelInner}>
            {currentBatch ? (
              <BatchLedgerView batch={currentBatch} />
            ) : (
              <View style={styles.infoCard}>
                <Text style={styles.label}>{t('scanner.title')}</Text>
                <Text style={styles.batchTitle}>{t('scanner.instruction')}</Text>
                <Text style={styles.batchSub}>{t('scanner.help_text', { defaultValue: 'SCAN BATCH / SUIT / LINK' })}</Text>
              </View>
            )}

            <View style={styles.actionRow}>
              <TouchableOpacity 
                activeOpacity={0.8}
                disabled={!currentBatch}
                style={[styles.mainBtn, styles.btnIn, !currentBatch && styles.btnDisabled]}
                onPress={() => initiateTransaction('IN')}
              >
                <Ionicons name="add" size={24} color="#000" />
                <Text style={styles.btnText}>{t('production.batch_in', { defaultValue: 'BATCH IN (+)' })}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                activeOpacity={0.8}
                disabled={!currentBatch}
                style={[styles.mainBtn, styles.btnOut, !currentBatch && styles.btnDisabled]}
                onPress={() => initiateTransaction('OUT')}
              >
                <Ionicons name="remove" size={24} color="#000" />
                <Text style={styles.btnText}>{t('production.batch_out', { defaultValue: 'BATCH OUT (-)' })}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.panelInner}>
            <View style={styles.headerRow}>
              <Text style={styles.label}>
                {t('scanner.protocol_action', { defaultValue: 'PROTOCOL ACTION' })} ({transactionType === 'IN' ? t('production.batch_in') : t('production.batch_out')})
              </Text>
              <TouchableOpacity onPress={resetSession}>
                <Text style={styles.cancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              ref={inputRef}
              style={[styles.hugeInput, { fontFamily: 'JetBrainsMono_900Black' }]}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#4B5563"
            />
            
            {error && <Text style={[styles.errorText, { fontFamily: 'JetBrainsMono_700Bold' }]}>{error}</Text>}

            <TouchableOpacity 
              activeOpacity={0.9}
              disabled={isSubmitting || !quantity}
              style={[styles.confirmBtn, (isSubmitting || !quantity) && styles.btnDisabled]}
              onPress={() => confirmAndSave(quantity)}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.confirmBtnText}>{t('common.confirm')}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  viewport: { flex: 0.6, backgroundColor: '#000', overflow: 'hidden' },
  panel: { flex: 0.4, padding: 24, borderTopWidth: 1, borderColor: '#18181b', backgroundColor: '#000' },
  panelInner: { flex: 1, justifyContent: 'space-between' },
  
  // Brand UI
  brandOverlay: { position: 'absolute', top: 60, left: 0, right: 0, alignItems: 'center' },
  brandText: { color: '#C5A059', fontSize: 16, fontWeight: '900', letterSpacing: 8, fontFamily: 'JetBrainsMono_900Black' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(0,0,0,0.8)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 2, borderWidth: 1, borderColor: '#2D3441' },
  statusText: { color: '#fff', fontSize: 8, fontWeight: 'bold', letterSpacing: 2, marginLeft: 6, fontFamily: 'JetBrainsMono_700Bold' },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4B5563' },
  dotActive: { backgroundColor: '#10B981' },

  // Unauthorized Overlay
  unauthorizedOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.9)', 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 100
  },
  unauthorizedTitle: { color: '#dc2626', fontSize: 18, fontWeight: '900', letterSpacing: 4, marginTop: 24 },
  unauthorizedSub: { color: '#52525b', fontSize: 10, fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },

  // Reticle
  reticle: { position: 'absolute', top: '50%', left: '50%', width: 220, height: 220, marginLeft: -110, marginTop: -110, justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 30, height: 30, borderColor: '#C5A059' },
  tl: { top: 0, left: 0, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: 0, right: 0, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: 0, right: 0, borderBottomWidth: 2, borderRightWidth: 2 },
  scanLine: { width: '80%', height: 1, backgroundColor: '#C5A059', opacity: 0.1 },

  // Navigation
  navRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  navBtn: { flex: 1, height: 48, backgroundColor: '#1A1D21', borderRadius: 4, borderWidth: 1, borderColor: '#2D3441', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  navBtnText: { color: '#C5A059', fontSize: 10, fontWeight: '900', letterSpacing: 1, fontFamily: 'JetBrainsMono_700Bold' },

  // Components
  infoCard: { backgroundColor: '#18181b', padding: 20, borderRadius: 4, borderWidth: 1, borderColor: '#27272a' },
  label: { color: '#52525b', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8 },
  batchTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  batchSub: { color: '#D4AF37', fontSize: 10, fontWeight: '800', marginTop: 4, letterSpacing: 1 },
  
  actionRow: { flexDirection: 'row', gap: 16 },
  mainBtn: { flex: 1, height: 80, borderRadius: 4, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 },
  btnIn: { backgroundColor: '#C5A059' },
  btnOut: { backgroundColor: '#1A1D21', borderWidth: 1, borderColor: '#C5A059' },
  btnText: { color: '#000', fontSize: 11, fontWeight: '900', letterSpacing: 1, fontFamily: 'JetBrainsMono_900Black' },
  btnDisabled: { opacity: 0.2 },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cancelText: { color: '#dc2626', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  hugeInput: { fontSize: 64, color: '#fff', fontWeight: '900', textAlign: 'center', paddingVertical: 10 },
  errorText: { color: '#ef4444', fontSize: 10, textAlign: 'center', marginBottom: 10, fontWeight: 'bold' },
  
  confirmBtn: { backgroundColor: '#C5A059', height: 60, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  confirmBtnText: { color: '#000', fontSize: 12, fontWeight: '900', letterSpacing: 2, fontFamily: 'JetBrainsMono_900Black' },

  // Permissions
  permissionContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 40 },
  permissionTitle: { color: '#D4AF37', fontSize: 14, fontWeight: '900', letterSpacing: 4, marginTop: 24 },
  permissionDesc: { color: '#52525b', fontSize: 10, textAlign: 'center', marginTop: 12, lineHeight: 18, letterSpacing: 1 },
  permissionBtn: { marginTop: 40, backgroundColor: '#18181b', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 4, borderWidth: 1, borderColor: '#27272a' },
  permissionBtnText: { color: '#D4AF37', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
  idleOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center', zIndex: 110 },
  idleTitle: { color: '#D4AF37', fontSize: 18, fontWeight: '900', letterSpacing: 4, marginTop: 24 },
  idleSub: { color: '#52525b', fontSize: 10, fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },
  wakeBtn: { marginTop: 40, backgroundColor: '#D4AF37', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 4 },
  wakeText: { color: '#000', fontSize: 10, fontWeight: 'bold', letterSpacing: 2 },
});
