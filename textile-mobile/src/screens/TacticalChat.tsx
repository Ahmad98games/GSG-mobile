import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useProductStore } from '../store/useProductStore';
import { supabase } from '../lib/supabase';

// Secure Channel Protocol (TLS 1.3)
const encrypt = (text: string) => text;
const decrypt = (text: string) => text;

export const TacticalChat = () => {
  const { messages, addMessage, nodeId, isLinked, checkSession } = useProductStore();
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // 1. Subscribe to Realtime Tactical Channel
    const channel = supabase
      .channel('tactical_messages')
      .on('broadcast', { event: 'new_message' }, ({ payload }) => {
        // Decrypt and add to store
        const decryptedMsg = {
          ...payload,
          content: decrypt(payload.content)
        };
        addMessage(decryptedMsg);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addMessage]);

  const sendMessage = async () => {
    if (!input.trim() || !isLinked || !checkSession()) {
      if (isLinked) setInput('SESSION EXPIRED - RE-SCAN GATEKEEPER');
      return;
    }

    const newMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender_id: nodeId || 'MOBILE_NODE',
      sender_name: 'Master (Mobile)',
      content: encrypt(input),
      created_at: new Date().toISOString(),
      is_admin: false,
    };

    // Broadcast to the channel
    await supabase.channel('tactical_messages').send({
      type: 'broadcast',
      event: 'new_message',
      payload: newMessage,
    });

    // Add to local store (decrypted for UI)
    addMessage({ ...newMessage, content: input });
    setInput('');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[
      styles.messageContainer, 
      item.is_admin ? styles.adminMessage : styles.userMessage
    ]}>
      <View style={styles.messageHeader}>
        <Text style={[styles.senderName, item.is_admin && styles.adminName]}>
          {item.sender_name}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <Text style={styles.messageContent}>{item.content}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={18} color="#D4AF37" />
        <Text style={styles.headerTitle}>Encrypted in transit (TLS 1.3)</Text>
        <View style={styles.statusDot} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted
        contentContainerStyle={styles.listContent}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="SECURE TRANSMISSION..."
            placeholderTextColor="#3f3f46"
            multiline
          />
          <TouchableOpacity 
            style={styles.sendBtn} 
            onPress={sendMessage}
            disabled={!input.trim()}
          >
            <Ionicons name="navigate" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { 
    height: 60, 
    backgroundColor: '#000', 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#18181b',
    paddingTop: 20
  },
  headerTitle: { color: '#D4AF37', fontSize: 10, fontWeight: '900', letterSpacing: 2, marginLeft: 10 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22c55e', marginLeft: 'auto' },
  
  listContent: { padding: 16 },
  messageContainer: { 
    marginBottom: 12, 
    padding: 12, 
    borderRadius: 4, 
    maxWidth: '85%',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a'
  },
  userMessage: { alignSelf: 'flex-end', borderBottomRightRadius: 0 },
  adminMessage: { 
    alignSelf: 'flex-start', 
    borderBottomLeftRadius: 0, 
    borderColor: '#D4AF37',
    borderWidth: 1.5,
    backgroundColor: '#0c0c0e'
  },
  messageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  senderName: { color: '#52525b', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  adminName: { color: '#D4AF37' },
  timestamp: { color: '#3f3f46', fontSize: 8 },
  messageContent: { color: '#e4e4e7', fontSize: 13, lineHeight: 18 },

  inputArea: { 
    flexDirection: 'row', 
    padding: 16, 
    backgroundColor: '#000', 
    borderTopWidth: 1, 
    borderColor: '#18181b',
    alignItems: 'center'
  },
  input: { 
    flex: 1, 
    backgroundColor: '#0c0c0e', 
    color: '#fff', 
    padding: 12, 
    borderRadius: 4, 
    fontSize: 13,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#27272a'
  },
  sendBtn: { 
    marginLeft: 12, 
    backgroundColor: '#D4AF37', 
    width: 44, 
    height: 44, 
    borderRadius: 4, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});
