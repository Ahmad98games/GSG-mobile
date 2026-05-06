import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { useProductStore } from '../store/useProductStore';
import { supabase } from '../lib/supabase';

export const useTacticalSync = () => {
  const { setFlashMessage, addMessage, isLinked } = useProductStore();

  useEffect(() => {
    if (!isLinked) return;

    // 1. Inventory Updates Listener
    const inventorySub = supabase
      .channel('inventory_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
        const msg = `[SYSTEM]: BATCH ${payload.new.qr_code} UPDATED BY ADMIN`;
        setFlashMessage(msg);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        
        // Auto-clear after 5s
        setTimeout(() => setFlashMessage(null), 5000);
      })
      .subscribe();

    // 2. Node Security Heartbeat (Optional but tactical)
    const securitySub = supabase
      .channel('security_protocols')
      .on('broadcast', { event: 'force_lock' }, () => {
        // Handle remote lock if needed
      })
      .subscribe();

    return () => {
      supabase.removeChannel(inventorySub);
      supabase.removeChannel(securitySub);
    };
  }, [isLinked, setFlashMessage]);
};
