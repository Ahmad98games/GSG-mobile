/**
 * lens/scan.web.tsx — Web variant of /(app)/lens/scan
 * Document scanner using browser camera (file capture or getUserMedia).
 * Sends captured image as base64 to Hub via tcpService.sendEvent.
 */
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { tcpService } from '../../../src/services/TCPClientService';
import { getSafeStorage } from '../../../src/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { THEME } from '../../../src/constants/theme';

export default function LensScanWebScreen() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [base64Data, setBase64Data] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const capturePhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      // Strip the data URL prefix to get raw base64
      const b64 = result.split(',')[1];
      setBase64Data(b64);
    };
    reader.readAsDataURL(file);
  };

  // Exact same sendToHub logic as native lens/scan.tsx
  const sendToHub = async () => {
    if (!base64Data || isSending) return;
    setIsSending(true);

    try {
      const rawNodeId = await getSafeStorage('gs_node_id');
      const nodeId = rawNodeId || 'MOBILE_WEB';

      const message = {
        fromNodeId: nodeId,
        toNodeId: 'hub',
        mediaType: 'document_scan',
        encryptedPayload: base64Data,
        isEncrypted: false,
        timestamp: Date.now(),
        messageId: `lens_${Date.now()}`,
      };

      await tcpService.sendEvent('message', message);

      // Persist recent scan record
      const rawRecent = await getSafeStorage('lens_recent_scans');
      const scans = rawRecent ? JSON.parse(rawRecent) : [];
      await AsyncStorage.setItem(
        'lens_recent_scans',
        JSON.stringify([{ id: message.messageId, timestamp: message.timestamp }, ...scans].slice(0, 5))
      );

      setSent(true);
      setTimeout(() => router.back(), 2000);
    } catch (e) {
      console.error('Send failed', e);
    } finally {
      setIsSending(false);
    }
  };

  const retake = () => {
    setPreviewUrl(null);
    setBase64Data(null);
    setSent(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <View style={styles.container}>
      {/* Hidden file input — accept images from camera on mobile */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {sent ? (
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={56} color={THEME.colorStatus.online} />
            <Text style={styles.successTitle}>Sent to Hub ✓</Text>
            <Text style={styles.successSub}>Open Noxis on your PC to review</Text>
          </View>
        </View>
      ) : previewUrl ? (
        <View style={styles.previewContainer}>
          <img
            src={previewUrl}
            alt="Document preview"
            style={{ width: '100%', height: '60%', objectFit: 'contain', backgroundColor: '#000' }}
          />
          <View style={styles.previewOverlay}>
            <Text style={styles.previewTitle}>Review Document</Text>
            <View style={styles.previewActions}>
              <TouchableOpacity style={[styles.previewBtn, styles.retakeBtn]} onPress={retake}>
                <Ionicons name="refresh" size={20} color={THEME.colors.textPrimary} />
                <Text style={styles.previewBtnText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.previewBtn, styles.useBtn]} onPress={sendToHub} disabled={isSending}>
                {isSending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="white" />
                    <Text style={styles.previewBtnText}>Send to Hub</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.captureContainer}>
          <TouchableOpacity style={styles.topBar} onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.centerContent}>
            <View style={styles.docFrame}>
              <Ionicons name="document-outline" size={80} color="rgba(255,255,255,0.3)" />
            </View>
            <Text style={styles.instructionText}>Point camera at document and capture</Text>
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.captureBtn} onPress={capturePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
            <Text style={styles.hintText}>Tap to open camera</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  captureContainer: { flex: 1, justifyContent: 'space-between' },
  topBar: { paddingTop: 60, paddingLeft: 20, width: 56, height: 100, justifyContent: 'center' },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 24 },
  docFrame: {
    width: 240, height: 300, borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)', borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  instructionText: { color: 'white', fontSize: 14, textAlign: 'center', fontFamily: THEME.fonts.monoBold },
  bottomBar: { paddingBottom: 60, alignItems: 'center', gap: 12 },
  captureBtn: { width: 72, height: 72, borderRadius: 36, borderWidth: 4, borderColor: 'white', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'white' },
  hintText: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  previewContainer: { flex: 1, backgroundColor: THEME.colors.bg },
  previewOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(18,20,23,0.95)', padding: 24, paddingBottom: 48,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
  },
  previewTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  previewActions: { flexDirection: 'row', gap: 16 },
  previewBtn: { flex: 1, height: 56, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  retakeBtn: { backgroundColor: THEME.colors.surface, borderWidth: 1, borderColor: THEME.colors.border },
  useBtn: { backgroundColor: THEME.colors.blue },
  previewBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  successOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(18,20,23,0.9)' },
  successCard: { backgroundColor: THEME.colors.surface, padding: 32, borderRadius: 24, alignItems: 'center', gap: 16, borderWidth: 1, borderColor: THEME.colorStatus.online },
  successTitle: { color: 'white', fontSize: 20, fontWeight: '900' },
  successSub: { color: THEME.colors.textSecondary, fontSize: 12, textAlign: 'center' },
});
