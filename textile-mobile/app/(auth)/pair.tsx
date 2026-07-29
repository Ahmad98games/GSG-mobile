'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connectViaWebSocket } from '@/services/TCPClientService';
import { smartConnect } from '../../src/services/ConnectionManager';
import { useBridgeStatusStore } from '@/stores/BridgeStatusStore';
import { THEME } from '@/constants/theme';
import { ScreenContainer } from '@/components/ui/ScreenContainer';

export default function PairScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [pairingStatus, setPairingStatus] = useState<'scanning' | 'connecting' | 'connected' | 'failed'>('scanning');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>('');

  const handleQrScan = async ({ data }: { data: string }) => {
    if (pairingStatus !== 'scanning') return;

    try {
      let bridgeData: any = {};

      // Try to parse as JSON first (new format)
      try {
        bridgeData = JSON.parse(data);
      } catch {
        // Fall back to raw URL (old format)
        if (data.startsWith('ws://') || data.startsWith('wss://')) {
          bridgeData = { bridgeUrl: data };
        } else {
          throw new Error('Invalid QR format');
        }
      }

      setPairingStatus('connecting');
      setBusinessName(bridgeData.businessName || 'Hub');

      // Save all known URLs for future reconnect
      await AsyncStorage.setItem(
        'noxis_bridge_data',
        JSON.stringify(bridgeData)
      );

      if (bridgeData.bridgeUrl) {
        await AsyncStorage.setItem('noxis_bridge_url', bridgeData.bridgeUrl);
      }

      // Use smart connect — tries local first, then tunnel
      const result = await smartConnect(bridgeData);

      if (result.success) {
        setPairingStatus('connected');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Now do the full connection with the working URL
        await connectViaWebSocket(result.url);

        setTimeout(() => {
          router.replace('/(app)/dashboard');
        }, 1200);
      } else {
        setPairingStatus('failed');
        setErrorMessage(buildErrorMessage(bridgeData));
      }
    } catch (err: any) {
      setPairingStatus('failed');
      setErrorMessage(
        'Invalid QR code. Scan the QR from ' +
        'Noxis Hub → Settings → Pairing.'
      );
    }
  };

  const buildErrorMessage = (bridgeData: any): string => {
    let msg = 'Could not connect to Hub. Make sure:\n';
    msg += '• Your phone and PC are on the same WiFi (for local connection)\n';
    msg += '• Noxis Hub is running on the PC\n';
    msg += '• No firewall is blocking port 3000/7447\n\n';
    if (bridgeData.tunnelUrl) {
      msg += 'Tunnel URL was also attempted but could not be reached.';
    }
    return msg;
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.statusText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Camera Permission Required</Text>
        <Text style={styles.errorText}>
          Noxis needs access to your camera to scan the Hub pairing QR code.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={requestPermission}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {pairingStatus === 'scanning' ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={handleQrScan}
          >
            <View style={styles.overlay}>
              <View style={styles.header}>
                <Text style={styles.mainTitle}>PAIR WITH NOXIS HUB</Text>
                <Text style={styles.subtitle}>Scan the pairing QR code from the PC Hub</Text>
              </View>
              <View style={styles.frame}>
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>
              <Text style={styles.hint}>Settings → Pairing → Scan QR</Text>
            </View>
          </CameraView>
        </View>
      ) : (
        <View style={styles.statusContainer}>
          {pairingStatus === 'connecting' && (
            <View style={styles.stateBox}>
              <Text style={styles.icon}>⚡</Text>
              <Text style={styles.stateTitle}>BONDING WITH HUB</Text>
              <Text style={styles.stateSubtitle}>Connecting to {businessName}...</Text>
            </View>
          )}

          {pairingStatus === 'connected' && (
            <View style={styles.stateBox}>
              <Text style={[styles.icon, { color: '#10B981' }]}>✓</Text>
              <Text style={styles.stateTitle}>PAIRING SUCCESSFUL</Text>
              <Text style={styles.stateSubtitle}>Redirecting to operations hub...</Text>
            </View>
          )}

          {pairingStatus === 'failed' && (
            <View style={styles.stateBox}>
              <Text style={[styles.icon, { color: '#EF4444' }]}>⚠</Text>
              <Text style={styles.stateTitle}>CONNECTION FAULT</Text>
              <Text style={styles.errorMsg}>{errorMessage}</Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => {
                  setPairingStatus('scanning');
                  setErrorMessage(null);
                }}
              >
                <Text style={styles.retryText}>Retry Scan</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060708',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#060708',
    padding: 20,
    gap: 16,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: THEME.fonts.monoExtraBold,
  },
  subtitle: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  frame: {
    width: 240,
    height: 240,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#60A5FA',
    borderWidth: 3,
  },
  cornerTL: {
    top: 0, left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTR: {
    top: 0, right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  hint: {
    fontSize: 11,
    color: '#60A5FA',
    fontWeight: '700',
    fontFamily: THEME.fonts.monoBold,
    letterSpacing: 1,
  },
  statusText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  btn: {
    backgroundColor: '#60A5FA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  btnText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  statusContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  stateBox: {
    alignItems: 'center',
    gap: 16,
    width: '100%',
  },
  icon: {
    fontSize: 48,
    color: '#60A5FA',
  },
  stateTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    fontFamily: THEME.fonts.monoBold,
  },
  stateSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  errorMsg: {
    fontSize: 12,
    color: '#EF4444',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryBtn: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#60A5FA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#60A5FA',
    fontWeight: '700',
  },
});
