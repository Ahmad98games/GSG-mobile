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
  SafeAreaView 
} from 'react-native';
import { useMessageStore } from '../../../src/store/MessageStore';
import type { Message } from '../../../src/store/MessageStore';
import { MessageService } from '../../../src/services/MessageService';
import { THEME } from '../../../src/constants/theme';
import { MessageSkeleton } from '../../../src/components/ui/SkeletonLoader';
import { Ionicons } from '@expo/vector-icons';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import * as Haptics from 'expo-haptics';

/**
 * TACTICAL MESSAGING UI
 * Industrial-grade conversation view with delivery tracking and offline support.
 */
export default function MessagesScreen() {
  const conversations = useMessageStore(s => s.messages);
  const { connectionState } = useBridgeStatus();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800); // Simulate initial load
  }, []);

  const handleSend = () => {
    if (!inputText.trim() || !selectedNode) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    MessageService.sendTextMessage(selectedNode, inputText.trim());
    setInputText('');
  };

  const handleTyping = (text: string) => {
    setInputText(text);
    if (selectedNode) MessageService.sendTypingIndicator(selectedNode);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isSelf = item.from_node_id === 'SELF';
    return (
      <View style={[styles.msgContainer, isSelf ? styles.msgSelf : styles.msgPeer]}>
        <Text style={styles.msgText}>{item.content}</Text>
        <View style={styles.msgFooter}>
          <Text style={styles.msgTime}>
            {new Date(item.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isSelf && (
            <Ionicons 
              name={item.status === 'delivered' ? 'checkmark-done' : 'checkmark'} 
              size={12} 
              color={item.status === 'queued' ? THEME.colors.gold : THEME.colors.blue} 
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
        {isSelf && item.status === 'queued' && (
          <Text style={styles.offlineNote}>(Queued — will send when connected)</Text>
        )}
      </View>
    );
  };

  const renderConversationItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.convoItem} 
      onPress={() => setSelectedNode(item)}
    >
      <View style={styles.convoAvatar}>
        <Text style={styles.avatarText}>{item.substring(0, 2).toUpperCase()}</Text>
      </View>
      <View style={styles.convoContent}>
        <Text style={styles.convoNodeId}>NODE_{item}</Text>
        <Text style={styles.convoPreview} numberOfLines={1}>
          {conversations[item][conversations[item].length - 1].content}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>TACTICAL_COMMS</Text>
        </View>
        <MessageSkeleton />
      </SafeAreaView>
    );
  }

  if (!selectedNode) {
    const nodes = Object.keys(conversations);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>TACTICAL_COMMS</Text>
        </View>
        <FlatList
          data={nodes}
          keyExtractor={item => item}
          renderItem={renderConversationItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color={THEME.colors.textSecondary} />
              <Text style={styles.emptyText}>NO_ACTIVE_THREADS</Text>
            </View>
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedNode(null)} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={THEME.colors.blue} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>NODE_{selectedNode}</Text>
          <View style={[styles.statusDot, { backgroundColor: connectionState === 'connected' ? THEME.colors.blue : THEME.colors.gold }]} />
        </View>

        <FlatList
          ref={flatListRef}
          data={conversations[selectedNode]}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.msgListContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.inputArea}>
          <TextInput
            style={styles.input}
            placeholder="TYPE_MESSAGE..."
            placeholderTextColor={THEME.colors.textSecondary}
            value={inputText}
            onChangeText={handleTyping}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendBtn, { opacity: inputText.trim() ? 1 : 0.5 }]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.colors.bg },
  header: { 
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: THEME.colors.border 
  },
  headerTitle: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 16, letterSpacing: 2 },
  backBtn: { marginRight: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 10 },
  listContent: { padding: 16 },
  convoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: THEME.colors.surface, 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border
  },
  convoAvatar: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: THEME.colors.border, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  avatarText: { color: THEME.colors.blue, fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  convoContent: { flex: 1, marginLeft: 16 },
  convoNodeId: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  convoPreview: { color: THEME.colors.textSecondary, fontSize: 12, marginTop: 4 },
  msgListContent: { padding: 20 },
  msgContainer: { 
    maxWidth: '80%', 
    padding: 12, 
    borderRadius: 16, 
    marginBottom: 16,
    borderWidth: 1
  },
  msgSelf: { 
    alignSelf: 'flex-end', 
    backgroundColor: 'rgba(96, 165, 250, 0.1)', 
    borderColor: THEME.colors.blue,
    borderBottomRightRadius: 4
  },
  msgPeer: { 
    alignSelf: 'flex-start', 
    backgroundColor: THEME.colors.surface, 
    borderColor: THEME.colors.border,
    borderBottomLeftRadius: 4
  },
  msgText: { color: 'white', fontSize: 14, lineHeight: 20 },
  msgFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4 },
  msgTime: { color: THEME.colors.textSecondary, fontSize: 10, fontFamily: THEME.fonts.mono },
  offlineNote: { color: THEME.colors.gold, fontSize: 9, fontFamily: THEME.fonts.mono, marginTop: 4, textAlign: 'right' },
  inputArea: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: THEME.colors.border,
    backgroundColor: THEME.colors.surface
  },
  input: { 
    flex: 1, 
    backgroundColor: THEME.colors.bg, 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    paddingTop: 10, 
    paddingBottom: 10, 
    color: 'white', 
    fontFamily: THEME.fonts.mono,
    maxHeight: 100
  },
  sendBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: THEME.colors.blue, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 12 
  },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: THEME.colors.textSecondary, fontFamily: THEME.fonts.monoBold, marginTop: 20 }
});
