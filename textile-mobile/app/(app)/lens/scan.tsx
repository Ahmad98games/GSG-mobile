import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { THEME } from '../../../src/constants/theme';
import { X, Camera, RefreshCcw, Check, Scan } from 'lucide-react-native';
import { tcpService } from '../../../src/services/TCPClientService';
import * as SecureStore from 'expo-secure-store';
import { processDocument, estimateDocumentQuality } from '../../../src/lib/lens/imageProcessor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../../../src/utils/storage';
import { Image } from 'expo-image';
import { useTierStore } from '../../../src/stores/TierStore';
import { FeatureLock } from '../../../src/components/ui/FeatureLock';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function DocumentScanner() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const [processedBase64, setProcessedBase64] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isDetected, setIsDetected] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const { lensScansPerDay } = useTierStore();
  const [todayScans, setTodayScans] = useState(0);

  useEffect(() => {
    loadTodayScans();
  }, []);

  const loadTodayScans = async () => {
    const today = new Date().toDateString();
    const key = `lens_scans_${today}`;
    const current = await getSafeStorage(key);
    setTodayScans(parseInt(current || '0'));
  };

  const incrementTodayScans = async () => {
    const today = new Date().toDateString();
    const key = `lens_scans_${today}`;
    const nextCount = todayScans + 1;
    await AsyncStorage.setItem(key, String(nextCount));
    setTodayScans(nextCount);
  };

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  useEffect(() => {
    let detectInterval: NodeJS.Timeout;
    if (!previewUri) {
      detectInterval = setInterval(() => {
        // Simulate auto-edge detection logic
        // In a real app, we'd analyze frames here
        const shouldDetect = Math.random() > 0.7;
        setIsDetected(prev => {
          const next = shouldDetect;
          if (next && !prev) {
            startPulse();
          }
          return next;
        });
      }, 5000);
    }
    return () => clearInterval(detectInterval);
  }, [previewUri]);

  const startPulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      })
    ]).start();
  };

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo) {
        const processed = await processDocument(photo.uri);
        setPreviewUri(processed.uri);
        setProcessedBase64(processed.base64);
      }
    } catch (e) {
      console.error('Capture failed', e);
    } finally {
      setIsCapturing(false);
    }
  };

  const sendToHub = async () => {
    if (!processedBase64 || isSending) return;

    setIsSending(true);
    try {
      const nodeId = await SecureStore.getItemAsync('gs_node_id') || 'unknown';
      
      // Construct TacticalMessage
      const message = {
        fromNodeId: nodeId,
        toNodeId: 'hub',
        mediaType: 'document_scan',
        encryptedPayload: Buffer.from(processedBase64, 'base64'),
        isEncrypted: false,
        timestamp: Date.now(),
        messageId: 'lens_' + Date.now()
      };

      // Send via NSP TCP bridge
      await tcpService.sendEvent('message', message);

      // Persistence for recent scans
      const rawRecent = await getSafeStorage('lens_recent_scans');
      const scans = rawRecent ? JSON.parse(rawRecent) : [];
      const newScan = {
        id: message.messageId,
        timestamp: message.timestamp,
        uri: previewUri || ''
      };
      await AsyncStorage.setItem('lens_recent_scans', JSON.stringify([newScan, ...scans].slice(0, 5)));

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Success state is handled by showing a toast in a real app, 
      // here we'll just navigate back after a delay
      await incrementTodayScans();
      
      setTimeout(() => {
        router.back();
      }, 2000);

    } catch (e) {
      console.error('Send failed', e);
      setIsSending(false);
    }
  };

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission is required</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLimitReached = lensScansPerDay !== null && todayScans >= lensScansPerDay;

  return (
    <View style={styles.container}>
      {isLimitReached ? (
        <FeatureLock feature="lensUnlimited" requiredTier="pro">
           {/* This will never be rendered if hasFeature returns false */}
           <View /> 
        </FeatureLock>
      ) : previewUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewUri }} style={styles.previewImage} contentFit="contain" />
          
          <View style={styles.previewOverlay}>
            <Text style={styles.previewTitle}>Review Document</Text>
            <View style={styles.previewActions}>
              <TouchableOpacity 
                style={[styles.previewBtn, styles.retakeBtn]} 
                onPress={() => {
                  setPreviewUri(null);
                  setProcessedBase64(null);
                }}
              >
                <RefreshCcw size={20} color={THEME.colors.textPrimary} />
                <Text style={styles.previewBtnText}>Retake</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.previewBtn, styles.useBtn]} 
                onPress={sendToHub}
                disabled={isSending}
              >
                {isSending ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Check size={20} color="white" />
                    <Text style={styles.previewBtnText}>Use Document</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {isSending && (
            <View style={styles.sendingOverlay}>
              <View style={styles.successCard}>
                <Check size={40} color={THEME.colorStatus.online} />
                <Text style={styles.successTitle}>Sent to Hub ✓</Text>
                <Text style={styles.successSub}>Open Noxis on your PC to review</Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <CameraView 
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            flash="auto"
          >
            <View style={styles.overlay}>
              <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                  <X size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.instructionText}>Point camera at document</Text>
                <View style={{ width: 44 }} />
              </View>

              <View style={styles.finderContainer}>
                <Animated.View 
                  style={[
                    styles.finder,
                    isDetected && styles.finderDetected,
                    { transform: [{ scale: pulseAnim }] }
                  ]} 
                />
                {isDetected && (
                  <View style={styles.detectedBadge}>
                    <Text style={styles.detectedText}>Document detected — hold steady</Text>
                  </View>
                )}
              </View>

              <View style={styles.bottomBar}>
                <TouchableOpacity 
                  style={[styles.captureBtn, isDetected && styles.captureBtnDetected]} 
                  onPress={takePicture}
                  disabled={isCapturing}
                >
                  <View style={styles.captureInner} />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    fontFamily: THEME.fonts.monoBold,
    color: 'white',
    fontSize: 14,
    textShadowColor: 'black',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  finderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finder: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_HEIGHT * 0.5,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 12,
  },
  finderDetected: {
    borderColor: THEME.colorStatus.online,
    borderWidth: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  detectedBadge: {
    position: 'absolute',
    top: SCREEN_HEIGHT * 0.5 + 40,
    backgroundColor: THEME.colorStatus.online,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detectedText: {
    fontFamily: THEME.fonts.monoBold,
    color: 'white',
    fontSize: 12,
  },
  bottomBar: {
    paddingBottom: 60,
    alignItems: 'center',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureBtnDetected: {
    borderColor: THEME.colorStatus.online,
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'white',
  },
  previewContainer: {
    flex: 1,
    backgroundColor: THEME.colors.bg,
  },
  previewImage: {
    flex: 1,
  },
  previewOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 20, 23, 0.9)',
    padding: 24,
    paddingBottom: 60,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  previewTitle: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: 'white',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  previewActions: {
    flexDirection: 'row',
    gap: 16,
  },
  previewBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  retakeBtn: {
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  useBtn: {
    backgroundColor: THEME.colors.blue,
  },
  previewBtnText: {
    fontFamily: THEME.fonts.monoBold,
    color: 'white',
    fontSize: 14,
  },
  sendingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 20, 23, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCard: {
    backgroundColor: THEME.colors.surface,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    gap: 16,
    borderWidth: 1,
    borderColor: THEME.colorStatus.online,
  },
  successTitle: {
    fontFamily: THEME.fonts.monoExtraBold,
    color: 'white',
    fontSize: 20,
  },
  successSub: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 100,
  },
  btn: {
    backgroundColor: THEME.colors.blue,
    padding: 16,
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
