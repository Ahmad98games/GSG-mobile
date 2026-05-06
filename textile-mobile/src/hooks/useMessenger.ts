import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/AuthStore';
import type { MessengerChannel, MessengerMessage } from '../lib/types';
import { SyncEngine } from '../lib/SyncEngine';
import * as Crypto from 'expo-crypto';

/**
 * SOVEREIGN TACTICAL MESSENGER HOOK (v3.0)
 * Reactive state management for channels, messages, and presence.
 * Integrated with SyncEngine for industrial-grade offline reliability.
 */

export function useMessenger() {
  const { nodeId } = useAuthStore();
  const [channels, setChannels] = useState<MessengerChannel[]>([]);
  const [activeChannel, setActiveChannel] = useState<MessengerChannel | null>(null);
  const [messages, setMessages] = useState<MessengerMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const reconnectAttempts = useRef(0);
  const channelRef = useRef<any>(null);

  // 1. Fetch available channels and DMs
  const fetchChannels = useCallback(async () => {
    if (!nodeId) return;

    try {
      const { data: channelData, error } = await supabase
        .from('messenger_channels')
        .select(`
          *,
          channel_members!inner(member_id)
        `)
        .eq('channel_members.member_id', nodeId);

      if (!error && channelData) {
        setChannels(channelData as any);
        // Default to #all-nodes if available
        const allNodes = channelData.find(c => c.name === '#all-nodes' || c.name === 'all-nodes');
        if (allNodes && !activeChannel) setActiveChannel(allNodes as any);
      }
    } catch (e) {
      console.error('Fetch Channels Error:', e);
    } finally {
      setIsLoading(false);
    }
  }, [nodeId, activeChannel]);

  // 2. Fetch messages for active channel
  const fetchMessages = useCallback(async (channelId: string) => {
    const { data, error } = await supabase
      .from('messenger_messages')
      .select(`
        *,
        message_reads(reader_id, read_at)
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setMessages(data.map((m: any) => ({ ...m, read_receipts: m.message_reads })) as any);
      
      // Mark as read
      if (nodeId && data.length > 0) {
          await supabase.from('message_reads').upsert(
              data.map((m: any) => ({
                  message_id: m.id,
                  reader_id: nodeId,
                  reader_type: 'NODE'
              })),
              { onConflict: 'message_id, reader_id' }
          );
      }
    }
  }, [nodeId]);

  useEffect(() => {
    fetchChannels();
  }, [fetchChannels]);

  useEffect(() => {
    if (!activeChannel) return;

    fetchMessages(activeChannel.id);

    const subscribe = () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      channelRef.current = supabase
        .channel(`chat:${activeChannel.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          table: 'messenger_messages',
          schema: 'public',
          filter: `channel_id=eq.${activeChannel.id}`
        }, (payload) => {
          // Verify it's not our own optimistic message already in state
          setMessages(prev => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [payload.new as any, ...prev];
          });
          
          // Mark received message as read
          if (nodeId) {
             supabase.from('message_reads').upsert({
                message_id: payload.new.id,
                reader_id: nodeId,
                reader_type: 'NODE'
             }).then(({ error }) => {
                if (error) console.error('[CHAT] Mark as read error:', error);
             });
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            reconnectAttempts.current = 0;
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            reconnectAttempts.current++;
            console.warn(`[CHAT] Reconnecting in ${delay}ms (Attempt ${reconnectAttempts.current})`);
            setTimeout(subscribe, delay);
          }
        });
    };

    subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [activeChannel, fetchMessages, nodeId]);

  // 3. Send Message (Optimistic + Offline Queue)
  const sendMessage = async (content: string, type: MessengerMessage['message_type'] = 'TEXT', metadata: any = {}) => {
    if (!activeChannel || !nodeId) return false;
    
    const optimisticId = Crypto.randomUUID();
    const messagePayload = {
      id: optimisticId,
      channel_id: activeChannel.id,
      sender_type: 'NODE',
      sender_id: nodeId,
      message_type: type,
      content,
      ...metadata,
      created_at: new Date().toISOString()
    };

    // 1. Update UI immediately
    setMessages(prev => [messagePayload as any, ...prev]);

    try {
      // 2. Queue for persistent delivery
      await SyncEngine.enqueue('SEND_MESSAGE', messagePayload);
      return true;
    } catch (err) {
      console.error('[CHAT] Send failure:', err);
      return false;
    }
  };

  return {
    channels,
    activeChannel,
    setActiveChannel,
    messages,
    isLoading,
    isSending,
    sendMessage,
    refreshChannels: fetchChannels
  };
}
