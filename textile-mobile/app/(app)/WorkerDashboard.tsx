import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { IndustrialSyncIndicator } from '../../src/components/IndustrialSyncIndicator';
import { useVocabulary } from '../../src/store/VocabularyContext';
import { useConnection } from '../../src/store/ConnectionContext';
import { useDiagnosticStore } from '../../src/store/DiagnosticsStore';
import { ScreenHeader } from '../../src/components/navigation/ScreenHeader';

const COLORS = {
  bg: '#09090b',
  surface: '#18181b',
  accent: '#84cc16', // Cyber-Lime
  pending: '#ea580c', // Deep Orange
  critical: '#ef4444', // Red
  blue: '#60a5fa',   // Electric Blue
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  border: '#27272a',
};

export default function WorkerDashboard() {
  const { config, getLabel } = useVocabulary();
  const { isOnline: isConnected } = useConnection();
  const { isLowBatteryMode: isOverheating } = useDiagnosticStore();
  const router = useRouter();
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  const getHealthHUD = () => {
    if (!isConnected) {
      return { text: 'HUB: OFFLINE', color: COLORS.critical };
    }
    
    switch (config?.systemHealth) {
      case 'CAMERA_DOWN':
        return { text: 'HUB: ONLINE | CCTV: DISCONNECTED', color: COLORS.pending };
      case 'ACTIVE':
      default:
        return { text: 'HUB: ONLINE | CCTV: ACTIVE', color: COLORS.accent };
    }
  };

  const health = getHealthHUD();

  const MenuButton = ({ label, subLabel, icon, color, onPress }: any) => (
    <TouchableOpacity 
      style={[styles.menuBtn, { borderColor: color }]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <View style={styles.btnContent}>
        <Text style={styles.btnLabel}>{label.toUpperCase()}</Text>
        <Text style={styles.btnSub}>{subLabel.toUpperCase()}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <IndustrialSyncIndicator />
      
      {/* GLOBAL HEALTH HUD */}
      <View style={[styles.healthBar, { borderColor: health.color }]}>
        <View style={[styles.healthDot, { backgroundColor: health.color }]} />
        <Text style={[styles.healthText, { color: health.color }]}>
          {health.text}
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader title="Worker Control" subtitle="SYSTEM INDUSTRIAL MODULE" showBack={true} />

        <View style={styles.grid}>
          <MenuButton 
            label={`${getLabel('action')} ${getLabel('unit')}`}
            subLabel="INDUSTRIAL NUMPAD ENTRY"
            icon="add-circle"
            color={COLORS.accent}
            onPress={() => router.push('/(app)/WorkerActionScreen')}
          />

          <MenuButton 
            label="SHIFT AUDIT"
            subLabel="VERIFY SYNC STATUS"
            icon="list-circle"
            color={COLORS.blue}
            onPress={() => router.push('/(app)/ShiftAuditScreen')}
          />

          {!isConnected && (
            <TouchableOpacity 
              style={styles.repairBtn} 
              onPress={() => setShowPairingModal(true)}
            >
              <Ionicons name="qr-code" size={24} color="white" />
              <Text style={styles.repairBtnText}>RE-PAIR NODE</Text>
            </TouchableOpacity>
          )}

          <MenuButton 
            label={`SCAN ${getLabel('batch')}`}
            subLabel="IDENTITY RESOLVER"
            icon="scan-circle"
            color={COLORS.textSecondary}
            onPress={() => router.push('/(app)/scanner')}
          />
        </View>

        <View style={styles.footer}>
          {isOverheating && (
            <View style={styles.overheatBox}>
              <Ionicons name="warning" size={20} color="white" />
              <Text style={styles.overheatText}>DEVICE OVERHEATING - PERFORMANCE THROTTLED</Text>
            </View>
          )}
          <View style={styles.secureBadge}>
            <Ionicons name="shield-checkmark" size={16} color={COLORS.accent} />
            <Text style={styles.secureText}>SYSTEM SECURE // E2E ENCRYPTED</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={1}
            onPress={() => {
              const now = Date.now();
              if (now - lastTap < 500) {
                const newCount = tapCount + 1;
                setTapCount(newCount);
                if (newCount >= 3) {
                  router.push('/(app)/Diagnostics');
                  setTapCount(0);
                }
              } else {
                setTapCount(1);
              }
              setLastTap(now);
            }}
          >
            <Text style={styles.footerText}>
              HUB_NODE_CLIENT // {config?.unit || 'STATION'} // v2.0
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* RE-PAIRING MODAL */}
      <Modal visible={showPairingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="alert-circle" size={64} color={COLORS.critical} />
            <Text style={styles.modalTitle}>HUB DISCONNECTED</Text>
            <Text style={styles.modalSub}>THE HUB IP MAY HAVE CHANGED OR WI-FI IS DOWN.</Text>
            
            <TouchableOpacity 
              style={styles.scanBtn}
              onPress={() => {
                setShowPairingModal(false);
                router.push('/(auth)/pairing');
              }}
            >
              <Text style={styles.scanBtnText}>RE-SCAN QR CODE</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.closeBtn}
              onPress={() => setShowPairingModal(false)}
            >
              <Text style={styles.closeBtnText}>STAY OFFLINE</Text>
            </TouchableOpacity>

            <Text style={styles.modalNote}>PENDING QUEUE WILL BE PRESERVED</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  healthBar: {
    height: 32,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    gap: 10,
  },
  healthDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  healthText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 24,
  },
  industryTag: {
    color: COLORS.accent,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 2,
  },
  title: {
    color: COLORS.textPrimary,
    fontWeight: '900',
    fontSize: 32,
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  menuBtn: {
    height: 100,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  repairBtn: {
    height: 60,
    backgroundColor: COLORS.critical,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 4,
  },
  repairBtnText: {
    color: 'white',
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  btnContent: {
    flex: 1,
  },
  btnLabel: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  btnSub: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(132, 204, 22, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(132, 204, 22, 0.2)',
  },
  secureText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    width: '100%',
    padding: 30,
    borderRadius: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.critical,
    fontSize: 24,
    fontWeight: '900',
    marginTop: 20,
    letterSpacing: 1,
  },
  modalSub: {
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
    lineHeight: 20,
  },
  scanBtn: {
    backgroundColor: COLORS.critical,
    width: '100%',
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  scanBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  closeBtn: {
    marginTop: 20,
    padding: 10,
  },
  closeBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    fontSize: 14,
  },
  modalNote: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: '800',
    marginTop: 40,
    letterSpacing: 1,
  },
  overheatBox: {
    backgroundColor: COLORS.critical,
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
  },
  overheatText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  }
});
