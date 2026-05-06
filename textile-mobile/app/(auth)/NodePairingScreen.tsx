import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { THEME, COMMON_STYLES } from '../../src/constants/DesignSystem';
import { meshTCPClient } from '../../src/lib/mesh/tcp-client';
import { decodePairingQR } from '../../src/lib/mesh/mesh-protocol';

/**
 * NODE PAIRING SCREEN (v4.0)
 * Lead Systems Engineer Implementation for Gold She Mesh.
 * Focus: High-contrast, industrial efficiency, zero-friction pairing.
 */
export default function NodePairingScreen() {
  const [mode, setMode] = useState<'IDLE' | 'SCAN' | 'IP_ENTRY'>('IDLE');
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('5000');
  const [status, setStatus] = useState<'IDLE' | 'CONNECTING' | 'PAIRING' | 'SYNCING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState<string | null>(null);
  
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  useEffect(() => {
    const onStateChange = (state: string) => {
      if (state === 'CONNECTED') setStatus('SYNCING');
      if (state === 'DISCONNECTED' && status === 'CONNECTING') {
        setStatus('ERROR');
        setError('HUB_UNREACHABLE');
      }
    };

    const onConfig = (config: any) => {
      setStatus('SUCCESS');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => router.replace('/(app)'), 1500);
    };

    meshTCPClient.on('state-change', onStateChange);
    meshTCPClient.on('config-downloaded', onConfig);

    return () => {
      meshTCPClient.off('state-change', onStateChange);
      meshTCPClient.off('config-downloaded', onConfig);
    };
  }, [status]);

  const initiatePairing = (targetIp: string, targetPort: number, code?: string) => {
    setStatus('CONNECTING');
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    meshTCPClient.connect(targetIp, targetPort, code);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    try {
      const payload = decodePairingQR(data);
      if (payload.hubIp) {
        initiatePairing(payload.hubIp, payload.hubPort, payload.code);
      }
    } catch (e) {
      Alert.alert('SCAN ERROR', 'Invalid pairing QR format.');
    }
  };

  const renderContent = () => {
    if (status !== 'IDLE' && status !== 'ERROR') {
      return (
        <View style={styles.statusContainer}>
          <ActivityIndicator size="large" color={THEME.colors.blue} />
          <Text style={styles.statusText}>{status.toUpperCase()}...</Text>
        </View>
      );
    }

    if (mode === 'SCAN') {
      if (!permission?.granted) {
        return (
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionText}>GRANT CAMERA ACCESS</Text>
          </TouchableOpacity>
        );
      }
      return (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
          <TouchableOpacity style={styles.backBtn} onPress={() => setMode('IDLE')}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
      );
    }

    if (mode === 'IP_ENTRY') {
      return (
        <View style={styles.form}>
          <Text style={styles.label}>HUB IP ADDRESS</Text>
          <TextInput
            style={styles.input}
            value={ip}
            onChangeText={setIp}
            placeholder="192.168.1.10"
            placeholderTextColor={THEME.colors.muted}
            keyboardType="numeric"
            autoFocus
          />
          <Text style={styles.label}>PORT</Text>
          <TextInput
            style={styles.input}
            value={port}
            onChangeText={setPort}
            placeholder="5000"
            placeholderTextColor={THEME.colors.muted}
            keyboardType="numeric"
          />
          <TouchableOpacity 
            style={styles.connectBtn}
            onPress={() => initiatePairing(ip, parseInt(port))}
          >
            <Text style={styles.connectBtnText}>ESTABLISH CONNECTION</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtnText} onPress={() => setMode('IDLE')}>
            <Text style={{color: THEME.colors.slate}}>GO BACK</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.options}>
        <TouchableOpacity style={styles.optionBtn} onPress={() => setMode('SCAN')}>
          <Ionicons name="qr-code-outline" size={48} color={THEME.colors.blue} />
          <Text style={styles.optionTitle}>SCAN HUB QR</Text>
          <Text style={styles.optionSub}>Fastest industrial bonding</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionBtn} onPress={() => setMode('IP_ENTRY')}>
          <Ionicons name="terminal-outline" size={48} color={THEME.colors.slate} />
          <Text style={styles.optionTitle}>ENTER HUB IP</Text>
          <Text style={styles.optionSub}>Manual static configuration</Text>
        </TouchableOpacity>
        
        {status === 'ERROR' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={COMMON_STYLES.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>GOLD SHE MESH</Text>
        <Text style={styles.title}>NODE PAIRING</Text>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      <View style={styles.footer}>
        <Text style={styles.version}>SYSTEM v4.0.2 // SECURE MESH</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  brand: {
    color: THEME.colors.blue,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 12,
    letterSpacing: 4,
  },
  title: {
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.manropeBold,
    fontSize: 32,
    marginTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  options: {
    gap: 16,
  },
  optionBtn: {
    backgroundColor: THEME.colors.surface,
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
  },
  optionTitle: {
    color: THEME.colors.text.primary,
    fontFamily: THEME.fonts.manropeBold,
    fontSize: 20,
    marginTop: 16,
  },
  optionSub: {
    color: THEME.colors.text.secondary,
    fontFamily: THEME.fonts.inter,
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    backgroundColor: THEME.colors.surface,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  label: {
    color: THEME.colors.text.secondary,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 10,
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: THEME.colors.background,
    color: THEME.colors.text.primary,
    padding: 16,
    borderRadius: 8,
    fontFamily: THEME.fonts.mono,
    fontSize: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  connectBtn: {
    backgroundColor: THEME.colors.blue,
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectBtnText: {
    color: 'white',
    fontFamily: THEME.fonts.manropeBold,
    fontSize: 16,
  },
  backBtnText: {
    alignItems: 'center',
    marginTop: 16,
  },
  cameraContainer: {
    height: 400,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 12,
    borderRadius: 24,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusText: {
    color: THEME.colors.blue,
    fontFamily: THEME.fonts.monoBold,
    fontSize: 14,
    marginTop: 24,
    letterSpacing: 2,
  },
  errorBox: {
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.colors.status.danger,
    marginTop: 16,
  },
  errorText: {
    color: THEME.colors.status.danger,
    fontFamily: THEME.fonts.mono,
    fontSize: 12,
    textAlign: 'center',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  version: {
    color: THEME.colors.muted,
    fontFamily: THEME.fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
  },
  permissionBtn: {
    backgroundColor: THEME.colors.surface,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  permissionText: {
    color: THEME.colors.blue,
    fontFamily: THEME.fonts.manropeBold,
  }
});
