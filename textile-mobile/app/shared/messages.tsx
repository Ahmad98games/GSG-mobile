import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../src/lib/supabase';
import * as SecureStore from 'expo-secure-store';

const GOLD = '#C6A756';
const BG = '#0A0A0A';
const CARD = '#111111';
const GREEN = '#3D9970';

export default function SecureMessenger() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [nodeId, setNodeId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    async function setup() {
      const id = await SecureStore.getItemAsync('node_id');
      setNodeId(id);

      // Fetch History (Module 9 Protocol)
      const { data } = await supabase
        .from('node_messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) setMessages(data);

      // Subscribe to Realtime (Module 9: WSS Encrypted)
      const sub = supabase
        .channel('node_comms_global')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'node_messages' }, (payload) => {
          setMessages((prev) => [payload.new, ...prev]);
        })
        .subscribe();

      return () => { supabase.removeChannel(sub); };
    }
    setup();
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || !nodeId) return;

    const { error } = await supabase.from('node_messages').insert({
      sender_node_id: nodeId,
      sender_role: (await SecureStore.getItemAsync('node_role')) || 'UNKNOWN',
      message_text: input,
      message_type: 'TEXT',
    });

    if (error) console.error('[MSG_ERROR]', error.message);
    setInput('');
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.message, item.sender_node_id === nodeId ? styles.myMsg : styles.otherMsg]}>
      <View style={styles.msgHeader}>
        <Text style={styles.senderText}>{item.sender_role}</Text>
        <Text style={styles.timeText}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </View>
      <Text style={styles.msgText}>{item.message_text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={20} color={GOLD} />
        <Text style={styles.headerTitle}>SECURE COMMAND LINK</Text>
        <View style={styles.statusDot} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted
        contentContainerStyle={styles.list}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={90}>
        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="SECURE TRANSMISSION..."
            placeholderTextColor="#444"
            multiline
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} disabled={!input.trim()}>
            <Ionicons name="send" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: { height: 100, paddingTop: 50, paddingHorizontal: 20, backgroundColor: CARD, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#1F1F1F' },
  headerTitle: { color: GOLD, fontSize: 10, fontWeight: '900', letterSpacing: 2, marginLeft: 12 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: GREEN, marginLeft: 'auto' },
  
  list: { padding: 20 },
  message: { maxWidth: '85%', padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#1F1F1F' },
  myMsg: { alignSelf: 'flex-end', backgroundColor: '#111', borderBottomRightRadius: 2 },
  otherMsg: { alignSelf: 'flex-start', backgroundColor: CARD, borderBottomLeftRadius: 2, borderLeftWidth: 3, borderLeftColor: GOLD },
  msgHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  senderText: { color: GOLD, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
  timeText: { color: '#444', fontSize: 8 },
  msgText: { color: '#F0F0F0', fontSize: 13, lineHeight: 18 },

  inputArea: { flexDirection: 'row', padding: 20, backgroundColor: CARD, borderTopWidth: 1, borderColor: '#1F1F1F', alignItems: 'center' },
  input: { flex: 1, backgroundColor: BG, color: '#FFF', padding: 12, borderRadius: 8, fontSize: 13, maxHeight: 100, borderWidth: 1, borderColor: '#1F1F1F' },
  sendBtn: { marginLeft: 16, backgroundColor: GOLD, width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});
