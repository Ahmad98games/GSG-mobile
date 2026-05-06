import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Modal,
  ScrollView,
  Pressable,
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';

import { THEME, COMMON_STYLES } from '../../../src/constants/DesignSystem';
import { useAuthStore } from '../../../src/store/AuthStore';
import { useMessenger } from '../../../src/hooks/useMessenger';
import { supabase } from '../../../src/lib/supabase';
import type { MessengerChannel, MessengerMessage } from '../../../src/lib/types';

/**
 * SOVEREIGN TACTICAL MESSENGER (v3.0)
 * Military-grade comms for Gold She Industrial mobile nodes.
 */

const { width } = Dimensions.get('window');
const IS_TABLET = width > 768;

export default function MessengerScreen() {
  const { nodeId } = useAuthStore();
  const { 
    channels, 
    activeChannel, 
    setActiveChannel, 
    messages, 
    isLoading, 
    sendMessage 
  } = useMessenger();

  const [showChannels, setShowChannels] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [amplitude, setAmplitude] = useState<number[]>([]);
  
  const flashListRef = useRef<FlashList<MessengerMessage>>(null);

  // --- RENDERING HELPERS ---

  const downloadFile = async (url: string, fileName: string) => {
    try {
      const localUri = FileSystem.cacheDirectory + fileName;
      const downloadResumable = FileSystem.createDownloadResumable(url, localUri);
      const result = await downloadResumable.downloadAsync();
      if (result) {
        await Sharing.shareAsync(result.uri);
      }
    } catch (e) {
      Alert.alert('DOWNLOAD ERROR', 'Failed to retrieve industrial payload.');
    }
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (!res.canceled) {
        const file = res.assets[0];
        // In real app, upload to Supabase Storage first
        // Here we simulate the metadata
        await sendMessage(file.name, 'TEXT', { 
            file_url: file.uri, 
            file_name: file.name, 
            file_size_bytes: file.size 
        });
      }
    } catch (err) {
      console.error('File pick error:', err);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
      setRecordingDuration(0);
      setAmplitude([]);

      const interval = setInterval(async () => {
        const status = await recording.getStatusAsync();
        if (status.canRecord) {
           setRecordingDuration(status.durationMillis);
           // Mock amplitude for visualization
           setAmplitude(prev => [...prev.slice(-19), Math.random()]);
        }
      }, 100);
      
      return () => clearInterval(interval);
    } catch (err) {
      console.error('Recording start failed', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    if (uri) {
        await sendMessage('Voice Note', 'VOICE', { 
            voice_url: uri, 
            voice_duration: recordingDuration / 1000,
            voice_amplitude: amplitude
        });
    }
    setRecording(null);
  };

  // --- SUB-COMPONENTS ---

  const VoicePlayer = ({ item }: { item: MessengerMessage }) => {
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);

    const togglePlay = async () => {
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
      } else if (item.voice_url) {
        const { sound: newSound } = await Audio.Sound.createAsync(
            { uri: item.voice_url },
            { shouldPlay: true, rate: playbackRate }
        );
        setSound(newSound);
        setIsPlaying(true);
        newSound.setOnPlaybackStatusUpdate((s: any) => {
          if (s.didJustFinish) setIsPlaying(false);
        });
      }
    };

    const toggleRate = async () => {
      const nextRate = playbackRate === 1.0 ? 1.5 : playbackRate === 1.5 ? 2.0 : 1.0;
      setPlaybackRate(nextRate);
      if (sound) await sound.setRateAsync(nextRate, true);
    };

    return (
      <View style={styles.voiceNote}>
        <TouchableOpacity style={styles.voicePlayBtn} onPress={togglePlay}>
          <Ionicons name={isPlaying ? "pause" : "play"} size={20} color={THEME.colors.background} />
        </TouchableOpacity>
        <View style={styles.waveformContainer}>
          {(item.voice_amplitude || Array(20).fill(0.2)).slice(0, 20).map((amp, i) => (
            <View key={i} style={[styles.waveBar, { height: 4 + (amp * 16) }]} />
          ))}
        </View>
        <TouchableOpacity style={styles.rateBtn} onPress={toggleRate}>
          <Text style={styles.rateText}>{playbackRate}x</Text>
        </TouchableOpacity>
        <Text style={styles.voiceDur}>{Math.round(item.voice_duration || 0)}s</Text>
      </View>
    );
  };

  const MessageBubble = ({ item }: { item: MessengerMessage }) => {
    const isMe = item.sender_id === nodeId;
    const isAdmin = item.sender_type === 'PC';
    
    return (
      <View style={[styles.bubbleWrapper, isMe ? styles.myBubbleWrapper : styles.theirBubbleWrapper]}>
        {!isMe && (
          <Text style={[styles.senderLabel, isAdmin && styles.adminLabel]}>
            {isAdmin ? 'COMMAND CENTER' : `${item.sender_name || 'NODE'} [${item.sender_role || 'STAFF'}]`}
          </Text>
        )}
        
        <View style={[
          styles.bubble,
          isMe ? styles.myBubble : styles.theirBubble,
          isAdmin && styles.adminBubble,
          item.message_type === 'SYSTEM' && styles.systemBubble
        ]}>
          {item.message_type === 'TEXT' && (
            <Text style={[styles.msgText, isMe && styles.myMsgText]}>{item.content}</Text>
          )}

          {item.message_type === 'VOICE' && <VoicePlayer item={item} />}

          {item.message_type === 'IMAGE' && item.file_url && (
             <TouchableOpacity onPress={() => {/* Full screen viewer */}}>
               <Image source={{ uri: item.file_url }} style={styles.msgImage} />
             </TouchableOpacity>
          )}

          {item.file_url && item.message_type !== 'IMAGE' && item.message_type !== 'VOICE' && (
            <TouchableOpacity 
                style={styles.fileCard} 
                onPress={() => downloadFile(item.file_url!, (item as any).file_name || 'attachment')}
            >
              <Ionicons name="document-attach" size={24} color={THEME.colors.blue} />
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>{(item as any).file_name || 'Industrial File'}</Text>
                <Text style={styles.fileSize}>{Math.round(((item as any).file_size_bytes || 0) / 1024)} KB</Text>
              </View>
              <Ionicons name="download-outline" size={20} color={THEME.colors.muted} />
            </TouchableOpacity>
          )}

          {item.message_type === 'SYSTEM' && (
             <Text style={styles.systemText}>{item.content}</Text>
          )}

          <View style={styles.bubbleFooter}>
            <Text style={styles.timeText}>{format(new Date(item.created_at), 'HH:mm')}</Text>
            {isMe && (
               <Ionicons 
                name={(item.read_receipts?.length || 0) > 0 ? "checkmark-done" : "checkmark"} 
                size={12} 
                color={THEME.colors.background} 
                style={{ marginLeft: 4 }}
               />
            )}
          </View>
        </View>
      </View>
    );
  };

  const ChannelList = () => (
    <View style={styles.sidebar}>
      <View style={styles.sidebarHeader}>
        <Text style={styles.sidebarTitle}>TACTICAL COMMS</Text>
      </View>
      <ScrollView contentContainerStyle={styles.sidebarScroll}>
        <Text style={styles.sectionTitle}>CHANNELS</Text>
        {channels.filter(c => c.type !== 'DIRECT').map(channel => (
          <TouchableOpacity 
            key={channel.id} 
            style={[styles.channelItem, activeChannel?.id === channel.id && styles.activeChannel]}
            onPress={() => { setActiveChannel(channel); if(!IS_TABLET) setShowChannels(false); }}
          >
            <Text style={[styles.channelText, activeChannel?.id === channel.id && styles.activeChannelText]}>
              # {channel.name.toUpperCase()}
            </Text>
            {channel.unread_count ? <View style={styles.badge}><Text style={styles.badgeText}>{channel.unread_count}</Text></View> : null}
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>DIRECT MESSAGES</Text>
        {channels.filter(c => c.type === 'DIRECT').map(channel => (
          <TouchableOpacity 
            key={channel.id} 
            style={[styles.channelItem, activeChannel?.id === channel.id && styles.activeChannel]}
            onPress={() => { setActiveChannel(channel); if(!IS_TABLET) setShowChannels(false); }}
          >
            <View style={styles.presenceContainer}>
              <View style={[styles.presenceDot, { backgroundColor: THEME.colors.status.success }]} />
              <Text style={[styles.channelText, activeChannel?.id === channel.id && styles.activeChannelText]}>
                {channel.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Handled for Mobile (Panel Popout) */}
      {!IS_TABLET && (
        <Modal visible={showChannels} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <Pressable style={styles.modalBlur} onPress={() => setShowChannels(false)} />
            <View style={styles.modalSidebar}>
              <ChannelList />
            </View>
          </View>
        </Modal>
      )}

      {/* Main Layout */}
      <View style={styles.layoutWrapper}>
        {IS_TABLET && <ChannelList />}

        <View style={styles.chatWrapper}>
          <View style={styles.header}>
            {!IS_TABLET && (
              <TouchableOpacity onPress={() => setShowChannels(true)} style={styles.menuBtn}>
                <Ionicons name="menu" size={24} color={THEME.colors.blue} />
              </TouchableOpacity>
            )}
            <View style={styles.headerInfo}>
               <Text style={styles.headerTitle}>{activeChannel?.name || 'SYNCING...'}</Text>
               <Text style={styles.headerStatus}>ENCRYPTED CHANNEL • ACTIVE</Text>
            </View>
          </View>

          <View style={styles.messageArea}>
            <FlashList
              ref={flashListRef}
              data={messages}
              renderItem={({ item }) => <MessageBubble item={item} />}
              estimatedItemSize={100}
              inverted
              contentContainerStyle={styles.listPadding}
              ListEmptyComponent={isLoading ? (
                <ActivityIndicator size="large" color={THEME.colors.blue} style={{ marginTop: 100 }} />
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="shield-checkmark" size={60} color={THEME.colors.surfaceLighter} />
                  <Text style={styles.emptyText}>SECURE LINE ESTABLISHED</Text>
                </View>
              )}
            />
          </View>

          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <View style={styles.inputArea}>
               <TouchableOpacity style={styles.attachBtn} onPress={pickFile}>
                 <Ionicons name="add" size={24} color={THEME.colors.blue} />
               </TouchableOpacity>
               
               <TextInput
                 style={styles.input}
                 value={inputText}
                 onChangeText={setInputText}
                 placeholder="Terminal entry..."
                 placeholderTextColor={THEME.colors.muted}
                 multiline
               />

               {inputText.trim() ? (
                  <TouchableOpacity 
                    style={styles.sendBtn} 
                    onPress={() => { sendMessage(inputText); setInputText(''); }}
                   >
                    <Ionicons name="send" size={20} color={THEME.colors.background} />
                  </TouchableOpacity>
               ) : (
                  <TouchableOpacity 
                    style={[styles.micBtn, isRecording && styles.micBtnActive]}
                    onPressIn={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); startRecording(); }}
                    onPressOut={stopRecording}
                  >
                    <Ionicons name="mic" size={20} color={isRecording ? 'white' : THEME.colors.background} />
                  </TouchableOpacity>
               )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>

      {isRecording && (
        <View style={styles.recordingOverlay}>
           <Text style={styles.recordingText}>REC... {(recordingDuration / 1000).toFixed(1)}s</Text>
           <View style={styles.liveVisualizer}>
             {amplitude.map((amp, i) => (
                <View key={i} style={[styles.visualBar, { height: 4 + (amp * 36) }]} />
             ))}
           </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: THEME.colors.background },
  layoutWrapper: { flex: 1, flexDirection: 'row' },
  sidebar: { width: 300, borderRightWidth: 1, borderRightColor: THEME.colors.border, backgroundColor: THEME.colors.surface },
  sidebarHeader: { padding: 24, borderBottomWidth: 1, borderBottomColor: THEME.colors.border },
  sidebarTitle: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.manropeBold, fontSize: 18, letterSpacing: 2 },
  sidebarScroll: { padding: 16 },
  sectionTitle: { color: THEME.colors.muted, fontFamily: THEME.fonts.monoBold, fontSize: 10, letterSpacing: 1, marginBottom: 16 },
  channelItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginBottom: 4 },
  activeChannel: { backgroundColor: 'rgba(96, 165, 250, 0.1)' },
  channelText: { color: THEME.colors.text.secondary, fontFamily: THEME.fonts.inter, fontSize: 14 },
  activeChannelText: { color: THEME.colors.blue, fontFamily: THEME.fonts.interBold },
  presenceContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  presenceDot: { width: 8, height: 8, borderRadius: 4 },
  badge: { backgroundColor: THEME.colors.blue, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: THEME.colors.background, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  
  chatWrapper: { flex: 1 },
  header: { height: 72, borderBottomWidth: 1, borderBottomColor: THEME.colors.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 },
  menuBtn: { marginRight: 15 },
  headerInfo: { flex: 1 },
  headerTitle: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.manropeBold, fontSize: 16 },
  headerStatus: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, fontSize: 9 },
  
  messageArea: { flex: 1 },
  listPadding: { padding: 16 },
  bubbleWrapper: { marginBottom: 20, width: '100%' },
  myBubbleWrapper: { alignItems: 'flex-end' },
  theirBubbleWrapper: { alignItems: 'flex-start' },
  senderLabel: { fontSize: 10, fontFamily: THEME.fonts.monoBold, color: THEME.colors.slate, marginBottom: 4, marginLeft: 4 },
  adminLabel: { color: THEME.colors.gold },
  bubble: { padding: 12, borderRadius: THEME.borderRadius.xl, maxWidth: '85%' },
  myBubble: { backgroundColor: THEME.colors.blue, borderBottomRightRadius: 2 },
  theirBubble: { backgroundColor: THEME.colors.surface, borderBottomLeftRadius: 2, borderWidth: 1, borderColor: THEME.colors.border },
  adminBubble: { borderLeftWidth: 3, borderLeftColor: THEME.colors.gold },
  systemBubble: { backgroundColor: 'transparent', alignSelf: 'center', borderBottomLeftRadius: 0 },
  msgText: { color: THEME.colors.text.primary, fontFamily: THEME.fonts.inter, fontSize: 15, lineHeight: 22 },
  myMsgText: { color: THEME.colors.background, fontFamily: THEME.fonts.interBold },
  systemText: { color: THEME.colors.muted, fontFamily: THEME.fonts.inter, fontStyle: 'italic', fontSize: 13, textAlign: 'center' },
  
  bubbleFooter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4, alignItems: 'center' },
  timeText: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: THEME.fonts.mono },
  
  msgImage: { width: 200, height: 200, borderRadius: 12, marginTop: 4 },
  fileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(0,0,0,0.2)', padding: 10, borderRadius: 8, marginTop: 4 },
  fileInfo: { flex: 1 },
  fileName: { color: THEME.colors.text.primary, fontSize: 12, fontFamily: THEME.fonts.interBold },
  fileSize: { color: THEME.colors.muted, fontSize: 10, fontFamily: THEME.fonts.mono },

  voiceNote: { flexDirection: 'row', alignItems: 'center', gap: 10, width: 220, paddingVertical: 4 },
  voicePlayBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: THEME.colors.blue, justifyContent: 'center', alignItems: 'center' },
  waveformContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2 },
  waveBar: { width: 2, backgroundColor: THEME.colors.blue, opacity: 0.5, borderRadius: 1 },
  rateBtn: { padding: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4 },
  rateText: { color: THEME.colors.text.primary, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  voiceDur: { color: THEME.colors.muted, fontSize: 10, fontFamily: THEME.fonts.mono },

  inputArea: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: THEME.colors.surface, borderTopWidth: 1, borderTopColor: THEME.colors.border },
  attachBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  input: { flex: 1, color: THEME.colors.text.primary, fontFamily: THEME.fonts.inter, fontSize: 15, maxHeight: 100, backgroundColor: THEME.colors.background, borderRadius: 22, paddingHorizontal: 16, marginHorizontal: 8 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.colors.blue, justifyContent: 'center', alignItems: 'center' },
  micBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: THEME.colors.blue, justifyContent: 'center', alignItems: 'center' },
  micBtnActive: { backgroundColor: THEME.colors.status.danger, transform: [{ scale: 1.1 }] },

  recordingOverlay: { position: 'absolute', bottom: 100, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.9)', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: THEME.colors.status.danger },
  recordingText: { color: THEME.colors.status.danger, fontFamily: THEME.fonts.monoBold, marginBottom: 15 },
  liveVisualizer: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 40 },
  visualBar: { width: 4, backgroundColor: THEME.colors.status.danger, borderRadius: 2 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100, opacity: 0.3 },
  emptyText: { color: THEME.colors.muted, fontFamily: THEME.fonts.mono, marginTop: 15 },
  
  modalOverlay: { flex: 1, flexDirection: 'row' },
  modalBlur: { flex: 0.2, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSidebar: { flex: 0.8 }
});
