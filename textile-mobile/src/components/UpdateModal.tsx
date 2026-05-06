import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { THEME } from '../constants/DesignSystem';
import { TacticalButton } from './TacticalButton';
import { updateService } from '../services/UpdateService';
import type { VersionInfo } from '../services/UpdateService';
import { Ionicons } from '@expo/vector-icons';

/**
 * MANDATORY UPDATE MODAL
 * Focus: Non-dismissible industrial deployment.
 */

export const UpdateModal = () => {
  const [updateInfo, setUpdateInfo] = useState<VersionInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    check();
  }, []);

  const check = async () => {
    const info = await updateService.checkForUpdates();
    if (info) setUpdateInfo(info);
  };

  const handleUpdate = async () => {
    if (!updateInfo) return;
    setIsDownloading(true);
    
    try {
      await updateService.installUpdate(updateInfo.apk_url, updateInfo.hash, (p) => setProgress(p));
    } catch (e: any) {
      setIsDownloading(false);
      setProgress(0);
      if (e.message === 'CORRUPTED') {
        Alert.alert('DOWNLOAD CORRUPTED', 'The downloaded update file is corrupted. Please try again.');
      } else {
        Alert.alert('UPDATE FAILURE', 'Hub se APK download nahi ho saki. Administrator se rabta karein.');
      }
    }
  };

  if (!updateInfo) return null;

  return (
    <Modal transparent visible={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Ionicons name="cloud-download" size={48} color={THEME.colors.status.danger} />
          <Text style={[styles.title, { color: THEME.colors.status.danger }]}>MANDATORY UPDATE</Text>
          <Text style={styles.message}>
            Behtar performance aur security ke liye update zaroori hai. Update karein taake kaam jari rahe.
          </Text>
          
          <Text style={styles.versionTag}>LATEST: v{updateInfo.latest_version}</Text>

          {isDownloading ? (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
              <Text style={styles.progressText}>{Math.round(progress * 100)}% DOWNLOADING</Text>
            </View>
          ) : (
            <TacticalButton 
              title="UPDATE NOW" 
              onPress={handleUpdate} 
              style={styles.button}
            />
          )}
          
          <Text style={styles.warning}>GOL SHE INDUSTRIAL OS (GS-PROD)</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  container: {
    backgroundColor: THEME.colors.surface,
    width: '100%',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center'
  },
  title: {
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.manropeBold,
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center'
  },
  message: {
    color: THEME.colors.muted,
    fontFamily: THEME.fonts.manrope,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 12
  },
  versionTag: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    marginTop: 16,
    backgroundColor: 'rgba(255,191,36,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4
  },
  button: {
    marginTop: 32,
    width: '100%'
  },
  progressContainer: {
    marginTop: 32,
    width: '100%',
    height: 48,
    backgroundColor: THEME.colors.background,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: THEME.colors.gold,
    opacity: 0.3
  },
  progressText: {
    color: THEME.colors.gold,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 12
  },
  warning: {
    color: THEME.colors.muted,
    fontFamily: THEME.fonts.mono,
    fontSize: 8,
    marginTop: 24,
    opacity: 0.5
  }
});
