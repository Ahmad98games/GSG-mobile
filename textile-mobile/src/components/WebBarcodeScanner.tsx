/**
 * WebBarcodeScanner — shared browser camera barcode reader
 * Uses html5-qrcode (which uses the browser's getUserMedia API).
 * Works on HTTPS (Cloudflare provides this) and Android Chrome.
 * Expo Router will auto-select .web.tsx variants that import this.
 */
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GOLD = '#C6A756';
const BG = '#060708';
const BLUE = '#60A5FA';
const RED = '#EF4444';
const MUTED = '#6B7280';
const SURFACE = '#0F1114';
const BORDER = '#1E2330';

interface Props {
  onScan: (code: string) => void;
  onError?: (msg: string) => void;
  title?: string;
  hint?: string;
  /** Set to true if scanning QR codes only (pairing), false for all barcodes (default) */
  qrOnly?: boolean;
}

export function WebBarcodeScanner({
  onScan,
  onError,
  title = 'INDUSTRIAL DECODER ACTIVE',
  hint = 'Point camera at barcode or QR code',
  qrOnly = false,
}: Props) {
  const idRef = useRef(`wbs-${Math.random().toString(36).slice(2)}`);
  const scannerRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  useEffect(() => {
    let stopped = false;

    const startScanner = async () => {
      try {
        // Dynamic import — html5-qrcode is a browser-only library
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import('html5-qrcode');

        const formats = qrOnly
          ? [Html5QrcodeSupportedFormats.QR_CODE]
          : [
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.AZTEC,
            ];

        const scanner = new Html5Qrcode(idRef.current, { formatsToSupport: formats, verbose: false });
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 180 } },
          (decodedText: string) => {
            if (stopped) return;
            onScan(decodedText);
          },
          () => { /* per-frame failure — ignore */ }
        );

        setPermission('granted');
        setLoading(false);
      } catch (err: any) {
        if (stopped) return;
        setLoading(false);
        const msg: string = err?.message ?? String(err);
        if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('denied')) {
          setPermission('denied');
          const errMsg = `Camera permission denied.\n\nTap the camera icon in your browser's address bar and allow camera access, then refresh.`;
          setError(errMsg);
          onError?.(errMsg);
        } else if (msg.toLowerCase().includes('https') || msg.toLowerCase().includes('secure')) {
          const errMsg = 'Camera requires HTTPS. Make sure you are visiting the secure URL (https://).';
          setError(errMsg);
          onError?.(errMsg);
        } else {
          const errMsg = `Could not start camera: ${msg}`;
          setError(errMsg);
          onError?.(errMsg);
        }
      }
    };

    // Small delay to ensure the DOM element is mounted
    const t = setTimeout(startScanner, 100);

    return () => {
      stopped = true;
      clearTimeout(t);
      scannerRef.current?.stop().catch(() => {});
    };
  }, []);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="camera-outline" size={56} color={RED} />
        <Text style={styles.errorTitle}>CAMERA RESTRICTED</Text>
        <Text style={styles.errorMsg}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => window.location.reload()}>
          <Text style={styles.retryText}>REFRESH PAGE</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Camera viewport */}
      <View style={styles.cameraWrap}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={GOLD} />
            <Text style={styles.loadingText}>INITIALIZING CAMERA...</Text>
          </View>
        )}
        {/* This div is the html5-qrcode mount target */}
        <div
          id={idRef.current}
          style={{
            width: '100%',
            maxWidth: 440,
            borderRadius: 16,
            overflow: 'hidden',
            minHeight: 280,
          }}
        />
        {/* Reticle overlay */}
        {!loading && (
          <View style={styles.reticleWrap} pointerEvents="none">
            <View style={styles.reticle}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />
            </View>
          </View>
        )}
      </View>

      <Text style={styles.hint}>{hint}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BG,
    padding: 20,
  },
  title: {
    color: BLUE,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraWrap: {
    width: '100%',
    maxWidth: 440,
    minHeight: 280,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
    borderWidth: 1,
    borderColor: BORDER,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    zIndex: 10,
    gap: 12,
  },
  loadingText: { color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  reticleWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reticle: { width: 240, height: 160, position: 'relative' },
  corner: { position: 'absolute', width: 36, height: 36, borderColor: GOLD },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 },
  hint: { color: MUTED, fontSize: 12, marginTop: 16, textAlign: 'center' },
  errorContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: BG, padding: 32, gap: 16,
  },
  errorTitle: { color: RED, fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  errorMsg: { color: MUTED, fontSize: 13, textAlign: 'center', lineHeight: 22 },
  retryBtn: {
    backgroundColor: BLUE, paddingVertical: 14, paddingHorizontal: 28,
    borderRadius: 12, marginTop: 8,
  },
  retryText: { color: BG, fontWeight: '900', fontSize: 13, letterSpacing: 1 },
});
