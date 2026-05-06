import { useCallback, useState, useEffect, useRef } from 'react';
import { useCameraPermissions } from 'expo-camera';
import type { ScanningResult } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

import { useProductStore } from '../store/useProductStore';
import { supabase } from '../lib/supabase';
import type { RootStackParamList } from '../lib/types';

export const useScanner = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  // Camera closes via its own ref when scanner screen unmounts.
  // The combined 20-minute timer is removed to allow separate BT 30s disconnect.
  
  const { 
    linkNode, 
    setScannedBatch, 
    setError,
    isLinked 
  } = useProductStore();

  const lastScanTime = useRef<number>(0);
  
  const handleBarCodeScanned = useCallback(async (result: ScanningResult) => {
    const now = Date.now();
    if (now - lastScanTime.current < 500) return;
    lastScanTime.current = now;

    const data = result.data.trim();
    
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // --- PROTOCOL 1: NODE LINKING (The Digital Key) ---
      if (data.startsWith('GS-NODE-LINK')) {
        const nodeId = data.split(':')[1] || 'UNKNOWN_NODE';
        
        // Link the node locally
        linkNode(nodeId);
        
        // Broadcast metadata to Supabase for PC acknowledgement
        await supabase.channel('device_linking').send({
          type: 'broadcast',
          event: 'handshake',
          payload: { 
            nodeId, 
            timestamp: Date.now(),
            device: 'MOBILE_NODE_01' 
          },
        });
        
        return;
      }

      // If not linked, block all other protocols
      if (!isLinked && !data.startsWith('GS-NODE-LINK')) {
        throw new Error("UNAUTHORIZED NODE - SCAN GATEKEEPER QR TO SYNC");
      }

      // --- PROTOCOL 2: BATCH OPERATIONS ---
      if (data.startsWith('GS-BATCH')) {
        const batchId = data.split(':')[1];
        const { data: batch, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('qr_code', batchId || data)
          .single();

        if (fetchError || !batch) throw new Error("Invalid Batch Protocol");

        setScannedBatch({
          id: batch.id,
          item_name: batch.item_name,
          item_category: batch.item_category,
          current_gaz: batch.total_gaz,
        });
        
        // Protocol-specific navigation
        // navigation.navigate('Scanner'); // Already here
        return;
      }

      // --- PROTOCOL 3: QUICK SALE / SUIT ---
      if (data.startsWith('GS-SUIT')) {
        navigation.navigate('Ledger', {});
        return;
      }

      // Legacy fallback for raw QR codes
      const { data: legacyBatch, error: legacyError } = await supabase
        .from('products')
        .select('*')
        .eq('qr_code', data)
        .single();

      if (!legacyError && legacyBatch) {
        setScannedBatch({
          id: legacyBatch.id,
          item_name: legacyBatch.item_name,
          item_category: legacyBatch.item_category,
          current_gaz: legacyBatch.total_gaz,
        });
      } else {
        throw new Error("UNRECOGNIZED PROTOCOL");
      }

    } catch (err: unknown) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError(err instanceof Error ? err.message : "Failed to process protocol");
    }
  }, [isLinked, linkNode, setScannedBatch, setError, navigation]);

  return {
    permission,
    requestPermission,
    handleBarCodeScanned,
    isIdle: false, // Legacy compatibility
    wakeUp: () => {} // Legacy compatibility
  };
};
