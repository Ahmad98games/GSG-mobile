import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useMessageStore } from '../../../src/store/MessageStore';
import type { Message } from '../../../src/store/MessageStore';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { MessageService } from '../../../src/services/MessageService';
import { voiceRecorder } from '../../../src/lib/audio/VoiceRecorder';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { FeatureLock } from '../../../src/components/tier/FeatureLock';

const db = SQLite.openDatabaseSync('omnora_mesh.db');

export default function ChatThreadScreen() {
  const { id: conversationId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const messages = useMessageStore(s => s.messages);
  const setMessages = useMessageStore(s => s.setMessages);
  const addMessage = useMessageStore(s => s.addMessage);
  
  const connectionState = useBridgeStatus(s => s.connectionState);
  const tierFeatures = useBridgeStatus(s => s.tierFeatures);
  const msgMaxChars = tierFeatures?.msgMaxChars || 500;
  
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordLevel, setRecordLevel] = useState(0);
  const [peerInfo, setPeerInfo] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  const threadMessages = React.useMemo(() => messages[conversationId!] || [], [messages, conversationId]);

  const keyExtractor = React.useCallback((item: Message) => item.id, []);

  useEffect(() => {
    loadThread();
    loadPeerInfo();
  }, [conversationId]);

  const loadThread = async () => {
    const results = await db.getAllAsync<any>(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at ASC',
      [conversationId]
    );
    // Note: In a real app, you'd decrypt these for display if not already decrypted in store
    setMessages(conversationId!, results);
  };

  const loadPeerInfo = async () => {
    const info = await db.getFirstAsync<any>(
      'SELECT * FROM conversations WHERE id = ?',
      [conversationId]
    );
    setPeerInfo(info);
  };

  const handleSend = async () => {
    if (!inputText.trim() || !peerInfo) return;
    try {
      await MessageService.sendTextMessage(peerInfo.peer_node_id, inputText.trim());
      setInputText('');
    } catch (e) {
      console.error('Send failed:', e);
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await voiceRecorder.startRecording((level) => setRecordLevel(level));
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const result = await voiceRecorder.stopRecording();
    if (result && peerInfo) {
      await MessageService.sendVoiceMessage(peerInfo.peer_node_id, result.uri, result.duration);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSelf = item.from_node_id !== peerInfo?.peer_node_id;
    return (
      <View style={[styles.messageBubble, isSelf ? styles.ownBubble : styles.peerBubble]}>
        {item.message_type === 'text' ? (
          <Text style={styles.messageText}>{item.content}</Text>
        ) : item.message_type === 'voice' ? (
          <View style={styles.voiceRow}>
            <Ionicons name="play" size={24} color="white" />
            <View style={styles.waveformPlaceholder} />
            <Text style={styles.duration}>{(item.duration_ms! / 1000).toFixed(1)}s</Text>
          </View>
        ) : null}
        
        <View style={styles.messageFooter}>
          <Text style={styles.time}>
            {new Date(item.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isSelf && (
            <View style={styles.statusIcons}>
              {item.status === 'queued' && <Ionicons name="checkmark" size={12} color="#9CA3AF" />}
              {item.status === 'sent' && <Ionicons name="checkmark" size={12} color="#60A5FA" />}
              {item.status === 'delivered' && <Ionicons name="checkmark-done" size={12} color="#60A5FA" />}
              {item.status === 'read' && <Ionicons name="checkmark-done" size={12} color="#34D399" />}
            </View>
          )}
        </View>
      </View>
    );
  };

  const charCount = inputText.length;
  const isNearLimit = charCount > msgMaxChars * 0.8;
  const isAtLimit = charCount >= msgMaxChars;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <Stack.Screen options={{ 
        title: peerInfo?.peer_display_name || peerInfo?.peer_node_id || 'Chat',
        headerStyle: { backgroundColor: '#121417' },
        headerTintColor: 'white',
        headerRight: () => (
          <View style={styles.headerStatus}>
            <Text style={styles.statusText}>{connectionState === 'connected' ? 'Online' : 'Offline'}</Text>
            <View style={[styles.statusDot, { backgroundColor: connectionState === 'connected' ? '#10B981' : '#EF4444' }]} />
          </View>
        )
      }} />

      <FlatList
        ref={flatListRef}
        data={threadMessages}
        renderItem={renderMessage}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
      />

      {connectionState === 'offline' && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>You are offline — messages will send when reconnected</Text>
        </View>
      )}

      <View style={styles.composer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#6B7280"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={msgMaxChars}
          />
          {charCount > 0 && (
            <Text style={[
              styles.charCounter, 
              charCount > msgMaxChars * 0.95 ? { color: '#EF4444' } : isNearLimit ? { color: '#F59E0B' } : null
            ]}>
              {charCount} / {msgMaxChars}
            </Text>
          )}
        </View>

        {inputText.trim() ? (
          <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <FeatureLock feature="voiceMessages" requiredTier="pro">
            <TouchableOpacity 
              style={[styles.voiceBtn, isRecording && styles.voiceBtnActive]} 
              onPressIn={startRecording}
              onPressOut={stopRecording}
            >
              <Ionicons name={isRecording ? "mic" : "mic-outline"} size={24} color="white" />
            </TouchableOpacity>
          </FeatureLock>
        )}
      </View>

      {isRecording && (
        <View style={styles.recordingOverlay}>
          <Text style={styles.recordingText}>Recording...</Text>
          <View style={styles.waveformContainer}>
             {/* Waveform visualization would go here */}
             <Animated.View style={[styles.waveBar, { height: 20 + recordLevel * 40 }]} />
          </View>
          <Text style={styles.cancelHint}>Release to send • Swipe up to cancel</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121417' },
  headerStatus: { flexDirection: 'row', alignItems: 'center' },
  statusText: { color: '#9CA3AF', fontSize: 12, marginRight: 6 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  messageList: { padding: 16 },
  messageBubble: { 
    maxWidth: '80%', 
    padding: 12, 
    borderRadius: 16, 
    marginBottom: 12 
  },
  ownBubble: { 
    alignSelf: 'flex-end', 
    backgroundColor: '#3B82F6',
    borderBottomRightRadius: 4
  },
  peerBubble: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#1F2937',
    borderBottomLeftRadius: 4
  },
  messageText: { color: 'white', fontSize: 15, lineHeight: 20, fontFamily: 'Inter' },
  messageFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 },
  time: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginRight: 4 },
  statusIcons: { flexDirection: 'row' },
  voiceRow: { flexDirection: 'row', alignItems: 'center', minWidth: 150 },
  waveformPlaceholder: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 10 },
  duration: { color: 'white', fontSize: 12 },
  composer: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    padding: 12, 
    backgroundColor: '#1F2937',
    borderTopWidth: 1,
    borderTopColor: '#374151'
  },
  inputWrapper: { flex: 1, position: 'relative' },
  input: { 
    backgroundColor: '#121417', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    color: 'white', 
    fontFamily: 'Inter',
    maxHeight: 120,
    fontSize: 15
  },
  charCounter: { 
    position: 'absolute', 
    right: 12, 
    bottom: -18, 
    fontSize: 10, 
    color: '#9CA3AF' 
  },
  sendBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#3B82F6', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 10 
  },
  voiceBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#374151', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 10 
  },
  voiceBtnActive: { backgroundColor: '#EF4444', transform: [{ scale: 1.2 }] },
  offlineBanner: { backgroundColor: '#F59E0B', padding: 4, alignItems: 'center' },
  offlineText: { color: 'black', fontSize: 11, fontWeight: 'bold' },
  recordingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'rgba(18, 20, 23, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40
  },
  recordingText: { color: '#EF4444', fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  waveformContainer: { flexDirection: 'row', alignItems: 'center', height: 60 },
  waveBar: { width: 4, backgroundColor: '#EF4444', borderRadius: 2, marginHorizontal: 2 },
  cancelHint: { color: '#9CA3AF', fontSize: 12, marginTop: 20 }
});
