'use client'
import React, { useState, useEffect,
  useCallback } from 'react'
import {
  View, Text, StyleSheet, TouchableOpacity,
  Vibration, Alert,
} from 'react-native'
import { CameraView, useCameraPermissions }
  from 'expo-camera'
import { router } from 'expo-router'
import * as Haptics from 'expo-haptics'
import { supabase }
  from '@/lib/supabase'
import { useBridgeStatusStore }
  from '@/stores/BridgeStatusStore'
import { useIndustryConfig }
  from '@/hooks/useIndustryConfig'
import { writeWithSync }
  from '@/services/OfflineSyncService'

type ScanMode =
  'lookup' | 'stock_in' | 'stock_out'

export default function ScannerScreen() {
  const [permission, requestPermission] =
    useCameraPermissions()
  const { businessId, currency } =
    useBridgeStatusStore()
  const { t, fmt } = useIndustryConfig()

  const [scanned, setScanned] = useState(false)
  const [scanResult, setScanResult] =
    useState<any>(null)
  const [mode, setMode] =
    useState<ScanMode>('lookup')
  const [qty, setQty] = useState('1')

  const handleBarcodeScan = useCallback(
    async ({ data }: { data: string }) => {
      if (scanned) return
      setScanned(true)

      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      )
      Vibration.vibrate(100)

      // Look up the SKU by barcode or SKU code
      const { data: sku } = await supabase
        .from('skus')
        .select('*')
        .eq('business_id', businessId)
        .or(`sku_code.eq.${data},barcode.eq.${data}`)
        .single()

      if (!sku) {
        setScanResult({
          found: false,
          code: data,
        })
        return
      }

      setScanResult({ found: true, sku })

      // Log the scan
      await writeWithSync(
        'scan_logs',
        {
          business_id: businessId,
          sku_id: sku.id,
          barcode: data,
          scan_type: mode,
          scanned_at: new Date().toISOString(),
        },
        { notifyHub: 'SCAN_COMPLETED' }
      )
    },
    [scanned, businessId, mode]
  )

  const adjustStock = async (
    skuId: string,
    change: number
  ) => {
    const { data: current } = await supabase
      .from('skus')
      .select('qty_on_hand')
      .eq('id', skuId)
      .single()

    if (!current) return

    const newQty = Math.max(
      0,
      current.qty_on_hand + change
    )

    const { error } = await supabase
      .from('skus')
      .update({ qty_on_hand: newQty })
      .eq('id', skuId)

    if (!error) {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      )
      setScanResult((prev: any) => ({
        ...prev,
        sku: {
          ...prev.sku,
          qty_on_hand: newQty,
        }
      }))

      await writeWithSync(
        'stock_adjustments',
        {
          business_id: businessId,
          sku_id: skuId,
          quantity_change: change,
          new_quantity: newQty,
          reason: mode === 'stock_in'
            ? 'Received via scan'
            : 'Dispatched via scan',
          adjusted_at: new Date().toISOString(),
        },
        { notifyHub: 'STOCK_UPDATED' }
      )
    }
  }

  if (!permission) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permText}>
          Requesting camera permission...
        </Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permTitle}>
          Camera Access Needed
        </Text>
        <Text style={styles.permText}>
          Noxis needs camera access to scan
          barcodes and QR codes.
        </Text>
        <TouchableOpacity
          style={styles.permBtn}
          onPress={requestPermission}
        >
          <Text style={styles.permBtnText}>
            Allow Camera
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Mode selector */}
      <View style={styles.modeBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        {(
          [
            ['lookup', '🔍 Lookup'],
            ['stock_in', '📥 Stock In'],
            ['stock_out', '📤 Stock Out'],
          ] as const
        ).map(([m, label]) => (
          <TouchableOpacity
            key={m}
            style={[
              styles.modeBtn,
              mode === m && styles.modeBtnActive,
            ]}
            onPress={() => {
              setMode(m)
              setScanned(false)
              setScanResult(null)
            }}
          >
            <Text style={[
              styles.modeBtnText,
              mode === m && styles.modeBtnTextActive,
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Camera */}
      {!scanResult ? (
        <View style={styles.cameraContainer}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: [
                'qr', 'code128', 'code39',
                'ean13', 'ean8', 'upc_a',
              ],
            }}
            onBarcodeScanned={handleBarcodeScan}
          >
            {/* Scan frame overlay */}
            <View style={styles.scanOverlay}>
              <View style={styles.scanFrame}>
                <View style={[
                  styles.corner,
                  styles.cornerTL
                ]} />
                <View style={[
                  styles.corner,
                  styles.cornerTR
                ]} />
                <View style={[
                  styles.corner,
                  styles.cornerBL
                ]} />
                <View style={[
                  styles.corner,
                  styles.cornerBR
                ]} />
              </View>
              <Text style={styles.scanHint}>
                Point at a barcode or QR code
              </Text>
            </View>
          </CameraView>
        </View>
      ) : !scanResult.found ? (
        /* Not found */
        <View style={styles.resultCard}>
          <Text style={styles.resultIcon}>
            ❓
          </Text>
          <Text style={styles.resultTitle}>
            Not Found
          </Text>
          <Text style={styles.resultSubtitle}>
            Code: {scanResult.code}
          </Text>
          <Text style={styles.resultHint}>
            This barcode is not linked to
            any {t.item} in your inventory.
            Add the barcode in Noxis Hub.
          </Text>
          <TouchableOpacity
            style={styles.scanAgainBtn}
            onPress={() => {
              setScanned(false)
              setScanResult(null)
            }}
          >
            <Text style={styles.scanAgainText}>
              Scan Again
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Found */
        <View style={styles.resultCard}>
          <Text style={styles.resultIcon}>
            📦
          </Text>
          <Text style={styles.resultTitle}>
            {scanResult.sku.name}
          </Text>
          <Text style={styles.resultCode}>
            {scanResult.sku.sku_code}
          </Text>

          <View style={styles.qtyDisplay}>
            <Text style={styles.qtyLabel}>
              Current Stock
            </Text>
            <Text style={styles.qtyValue}>
              {scanResult.sku.qty_on_hand}{' '}
              {scanResult.sku.unit}
            </Text>
            {scanResult.sku.reorder_level > 0 &&
              scanResult.sku.qty_on_hand <=
              scanResult.sku.reorder_level && (
              <Text style={styles.lowStockBadge}>
                ⚠ LOW STOCK
              </Text>
            )}
          </View>

          {(mode === 'stock_in' ||
            mode === 'stock_out') && (
            <View style={styles.adjustRow}>
              <TouchableOpacity
                style={styles.adjustQtyBtn}
                onPress={() => setQty(
                  String(Math.max(
                    1, parseInt(qty) - 1
                  ))
                )}
              >
                <Text style={styles.adjustQtyBtnText}>
                  −
                </Text>
              </TouchableOpacity>
              <Text style={styles.qtyInput}>
                {qty}
              </Text>
              <TouchableOpacity
                style={styles.adjustQtyBtn}
                onPress={() => setQty(
                  String(parseInt(qty) + 1)
                )}
              >
                <Text style={styles.adjustQtyBtnText}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.actionBtns}>
            {mode !== 'lookup' && (
              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  {
                    backgroundColor: mode === 'stock_in'
                      ? '#10B981' : '#EF4444'
                  }
                ]}
                onPress={() => adjustStock(
                  scanResult.sku.id,
                  mode === 'stock_in'
                    ? parseInt(qty)
                    : -parseInt(qty)
                )}
              >
                <Text style={styles.confirmBtnText}>
                  {mode === 'stock_in'
                    ? `✓ Add ${qty} to Stock`
                    : `✓ Remove ${qty} from Stock`}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.scanAgainBtn}
              onPress={() => {
                setScanned(false)
                setScanResult(null)
                setQty('1')
              }}
            >
              <Text style={styles.scanAgainText}>
                Scan Another
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
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
    padding: 40,
    gap: 16,
  },
  modeBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0C0F',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    padding: 6,
    marginRight: 4,
  },
  backText: {
    color: '#60A5FA',
    fontSize: 20,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modeBtnActive: {
    backgroundColor: 'rgba(96,165,250,0.15)',
    borderColor: 'rgba(96,165,250,0.4)',
  },
  modeBtnText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '600',
  },
  modeBtnTextActive: {
    color: '#60A5FA',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  scanOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  scanFrame: {
    width: 240,
    height: 240,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#60A5FA',
    borderWidth: 3,
  },
  cornerTL: {
    top: 0, left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  cornerTR: {
    top: 0, right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  cornerBL: {
    bottom: 0, left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  cornerBR: {
    bottom: 0, right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },
  scanHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
  },
  resultCard: {
    flex: 1,
    backgroundColor: '#0A0C0F',
    padding: 32,
    alignItems: 'center',
    gap: 12,
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  resultCode: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  resultSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  resultHint: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  qtyDisplay: {
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  qtyLabel: {
    fontSize: 10,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  qtyValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  lowStockBadge: {
    fontSize: 10,
    color: '#F59E0B',
    fontWeight: '700',
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 8,
  },
  adjustQtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustQtyBtnText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
  },
  qtyInput: {
    fontSize: 28,
    fontWeight: '800',
    color: '#60A5FA',
    fontFamily: 'monospace',
    minWidth: 60,
    textAlign: 'center',
  },
  actionBtns: {
    width: '100%',
    gap: 10,
    marginTop: 16,
  },
  confirmBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  scanAgainBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  scanAgainText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  permTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  permText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  permBtn: {
    backgroundColor: '#60A5FA',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  permBtnText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '700',
  },
})
