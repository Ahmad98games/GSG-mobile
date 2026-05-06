import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { THEME, COMMON_STYLES } from '../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

/**
 * SOVEREIGN AUDIT VERIFICATION (v2.0)
 * Deterministic pass/fail UI for production floor reliability.
 */

export default function AuditResultScreen() {
  const { t } = useTranslation();
  const { status, suits, variance } = useLocalSearchParams<{ status: 'PASS' | 'RED_ALERT', suits: string, variance: string }>();
  const router = useRouter();
  const [showPhotoModal, setShowPhotoModal] = React.useState(status === 'RED_ALERT');

  React.useEffect(() => {
    if (status === 'PASS') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [status]);

  const isPass = status === 'PASS';

  return (
    <View style={[
      styles.container, 
      { backgroundColor: isPass ? THEME.colors.status.success : THEME.colors.status.danger }
    ]}>
      <View style={styles.content}>
        <Ionicons 
          name={isPass ? "checkmark-circle" : "warning"} 
          size={120} 
          color="white" 
        />
        
        <Text style={styles.title}>
          {isPass ? t('audit.pass_heading') : t('audit.alert_heading')}
        </Text>

        <View style={styles.stats}>
          <View style={styles.statLine}>
            <Text style={styles.statLabel}>{t('audit.suits_received_label')}</Text>
            <Text style={styles.statValue}>{suits || '0'}</Text>
          </View>
          {!isPass && (
            <View style={styles.statLine}>
              <Text style={styles.statLabel}>{t('audit.variance_label')}</Text>
              <Text style={styles.statValue}>{variance || '0.00'} GAZ</Text>
            </View>
          )}
        </View>

        {!isPass && (
          <Text style={styles.warningSub}>
            {t('audit.alert_message')}
          </Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => router.replace('/(app)/production')}
          >
            <Text style={styles.primaryBtnText}>{t('common.back')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryBtn}
            onPress={() => router.push('/shared/messages')}
          >
            <Text style={styles.secondaryBtnText}>{t('common.confirm')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* PHOTO EVIDENCE REMINDER */}
      <Modal visible={showPhotoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="camera" size={48} color={THEME.colors.gold} />
            <Text style={styles.modalTitle}>{t('audit.photo_evidence')}</Text>
            <Text style={styles.modalSub}>{isPass ? t('audit.photo_reminder') : t('audit.photo_evidence')}</Text>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalPrimary} onPress={() => setShowPhotoModal(false)}>
                <Text style={styles.modalPrimaryText}>{t('audit.add_photo')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSecondary} onPress={() => setShowPhotoModal(false)}>
                <Text style={styles.modalSecondaryText}>{t('audit.skip_photo')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', padding: 40, width: '100%' },
  title: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 32, textAlign: 'center', marginTop: 24 },
  stats: { marginTop: 40, width: '100%', gap: 16 },
  statLine: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.2)', paddingBottom: 8 },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontFamily: THEME.fonts.mono, fontSize: 12 },
  statValue: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 20 },
  warningSub: { color: 'white', fontFamily: THEME.fonts.interBold, fontSize: 14, textAlign: 'center', marginTop: 24, opacity: 0.9 },
  actions: { marginTop: 60, width: '100%', gap: 16 },
  primaryBtn: { backgroundColor: 'white', paddingVertical: 18, borderRadius: 4, alignItems: 'center' },
  primaryBtnText: { color: 'black', fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  secondaryBtn: { borderWidth: 1, borderColor: 'white', paddingVertical: 18, borderRadius: 4, alignItems: 'center' },
  secondaryBtnText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 40 },
  modalContent: { backgroundColor: THEME.colors.surface, padding: 32, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: THEME.colors.border },
  modalTitle: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 18, marginTop: 16, textAlign: 'center' },
  modalSub: { color: THEME.colors.text.muted, fontSize: 12, textAlign: 'center', marginTop: 12, lineHeight: 18 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 32, width: '100%' },
  modalPrimary: { flex: 1, backgroundColor: THEME.colors.gold, paddingVertical: 12, borderRadius: 4, alignItems: 'center' },
  modalPrimaryText: { color: THEME.colors.background, fontFamily: THEME.fonts.monoBold, fontSize: 12 },
  modalSecondary: { flex: 1, backgroundColor: THEME.colors.border, paddingVertical: 12, borderRadius: 4, alignItems: 'center' },
  modalSecondaryText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 12 }
});
