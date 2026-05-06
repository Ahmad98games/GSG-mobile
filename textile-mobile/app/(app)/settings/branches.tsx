import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { usePersona } from '../../../src/hooks/usePersona';
import { BranchService } from '../../../src/services/BranchService';
import { useBranchStore } from '../../../src/store/BranchStore';
import { BridgeStatusBar } from '../../../src/components/shell/BridgeStatusBar';
import { FeatureLock } from '../../../src/components/tier/FeatureLock';

/**
 * BRANCH SWITCHER (M6)
 * Implements multi-branch context isolation and PIN-based escalation.
 */
export default function BranchSwitcher() {
  const router = useRouter();
  const { t } = usePersona();
  const [loading, setLoading] = useState(false);
  const { branches, currentBranchId } = useBranchStore();
  const [pinModal, setPinModal] = useState<{ visible: boolean, targetId: string | null }>({ visible: false, targetId: null });
  const [pin, setPin] = useState('');

  useEffect(() => {
    refreshBranches();
  }, []);

  const refreshBranches = async () => {
    setLoading(true);
    try {
      await BranchService.fetchBranches();
    } catch (e) {
      console.error('[BranchSwitcher] Failed to fetch branches:', e);
    } finally {
      setLoading(false);
    }
  };

  const onSwitch = (branchId: string) => {
    if (branchId === currentBranchId) return;
    setPinModal({ visible: true, targetId: branchId });
  };

  const handlePinSubmit = async () => {
    if (!pinModal.targetId) return;
    setLoading(true);
    try {
      await BranchService.switchBranch(pinModal.targetId, pin);
      setPinModal({ visible: false, targetId: null });
      setPin('');
      router.replace('/(app)/dashboard');
    } catch (e) {
      alert('Branch Switch Failed. Verify PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: t('BRANCH_SWITCHER'), 
          headerStyle: { backgroundColor: THEME.colors.bg }, 
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: '900' }
        }} 
      />
      <BridgeStatusBar />

      <FeatureLock feature="multiLocation" requiredTier="elite">
        <FlatList
          data={branches}
          keyExtractor={(item) => item.branch_id}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text style={styles.sectionTitle}>{t('AVAILABLE_BRANCHES')}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.branchCard, item.branch_id === currentBranchId && styles.activeCard]} 
              onPress={() => onSwitch(item.branch_id)}
              activeOpacity={0.7}
            >
              <View style={styles.branchInfo}>
                <Text style={styles.branchName}>
                  {item.name} {item.is_hq && <Text style={styles.hqBadge}> [HQ]</Text>}
                </Text>
                <Text style={styles.branchCity}>{item.city}</Text>
                <Text style={styles.roleTag}>{item.user_role_at_branch.toUpperCase()}</Text>
              </View>
              {item.branch_id === currentBranchId ? (
                <Ionicons name="checkmark-circle" size={28} color={THEME.colors.blue} />
              ) : (
                <Ionicons name="swap-horizontal" size={24} color="#4B5563" />
              )}
            </TouchableOpacity>
          )}
          refreshing={loading}
          onRefresh={refreshBranches}
          contentContainerStyle={styles.list}
        />
      </FeatureLock>

      <Modal visible={pinModal.visible} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="shield" size={40} color={THEME.colors.gold} />
              <Text style={styles.modalTitle}>{t('ESCALATION_REQUIRED')}</Text>
              <Text style={styles.modalSub}>{t('ENTER_BRANCH_PIN_DESC')}</Text>
            </View>

            <TextInput 
              style={styles.pinInput} 
              secureTextEntry 
              keyboardType="numeric" 
              maxLength={4}
              value={pin}
              onChangeText={setPin}
              autoFocus
              placeholder="0000"
              placeholderTextColor="#374151"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => { setPinModal({ visible: false, targetId: null }); setPin(''); }}
              >
                <Text style={styles.cancelText}>{t('CANCEL')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.submitBtn, pin.length < 4 && { opacity: 0.5 }]} 
                onPress={handlePinSubmit}
                disabled={pin.length < 4 || loading}
              >
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>{t('CONFIRM')}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  header: { padding: 20 },
  sectionTitle: { color: THEME.colors.textSecondary, fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 16 },
  list: { paddingBottom: 40 },
  branchCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: THEME.colors.surface, 
    marginHorizontal: 20, 
    marginBottom: 12, 
    padding: 20, 
    borderRadius: 24, 
    borderWidth: 1, 
    borderColor: THEME.colors.border
  },
  activeCard: { borderColor: THEME.colors.blue, backgroundColor: '#1E293B' },
  branchInfo: { flex: 1 },
  branchName: { color: 'white', fontSize: 18, fontWeight: '700' },
  hqBadge: { color: THEME.colors.gold, fontSize: 10, fontWeight: '900' },
  branchCity: { color: THEME.colors.textSecondary, fontSize: 12, marginTop: 4 },
  roleTag: { color: THEME.colors.gold, fontSize: 8, fontWeight: 'bold', marginTop: 8, letterSpacing: 1 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: THEME.colors.surface, width: '85%', padding: 30, borderRadius: 32, borderWidth: 1, borderColor: THEME.colors.border },
  modalHeader: { alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: '900', marginTop: 12 },
  modalSub: { color: THEME.colors.textSecondary, fontSize: 12, textAlign: 'center', marginTop: 8, lineHeight: 18 },
  pinInput: { 
    backgroundColor: '#0F172A', 
    color: 'white', 
    fontSize: 36, 
    textAlign: 'center', 
    padding: 20, 
    borderRadius: 20, 
    marginTop: 10, 
    fontFamily: THEME.fonts.monoBold,
    letterSpacing: 12,
    borderWidth: 1,
    borderColor: '#334155'
  },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 },
  cancelBtn: { flex: 0.45, padding: 16, alignItems: 'center' },
  cancelText: { color: THEME.colors.textSecondary, fontWeight: 'bold' },
  submitBtn: { flex: 0.45, backgroundColor: THEME.colors.blue, padding: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: 'white', fontWeight: 'bold' }
});
