import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useMessageStore } from '../../../src/store/MessageStore';
import { useBridgeStatus } from '../../../src/store/BridgeStatusStore';
import { Ionicons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import { MessageService } from '../../../src/services/MessageService';
import { ScreenHeader } from '../../../src/components/navigation/ScreenHeader';

const db = SQLite.openDatabaseSync('omnora_mesh.db');

export default function ConversationListScreen() {
  const router = useRouter();
  const conversations = useMessageStore(s => s.conversations);
  const setConversations = useMessageStore(s => s.setConversations);
  const connectionState = useBridgeStatus(s => s.connectionState);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    const results = await db.getAllAsync<any>('SELECT * FROM conversations ORDER BY last_message_at DESC');
    setConversations(results);
  };

  const filteredConversations = React.useMemo(() => 
    conversations.filter(c => 
      c.peer_display_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.peer_node_id.toLowerCase().includes(search.toLowerCase())
    ),
  [conversations, search]);

  const keyExtractor = React.useCallback((item: any) => item.id, []);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.convoItem}
      onPress={() => router.push(`/(app)/messages/${item.id}`)}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.peer_node_id.substring(0, 2).toUpperCase()}</Text>
        {item.is_online && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.peerName}>{item.peer_display_name || item.peer_node_id}</Text>
          <Text style={styles.time}>
            {new Date(item.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.preview} numberOfLines={1}>{item.last_message_preview}</Text>
          {item.unread_count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unread_count}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="Messages" showBack={true} />
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        {conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0) > 0 && (
          <View style={styles.headerBadge}>
            <Text style={styles.badgeText}>
              {conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#6B7280"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredConversations}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.list}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={8}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No conversations found</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/(app)/messages/new')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121417' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    paddingBottom: 10 
  },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', fontFamily: 'Inter' },
  headerBadge: { 
    backgroundColor: '#60A5FA', 
    borderRadius: 10, 
    minWidth: 20, 
    height: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginLeft: 10,
    paddingHorizontal: 6
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    margin: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 44, color: 'white', fontFamily: 'Inter' },
  list: { paddingHorizontal: 16 },
  convoItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937'
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#374151', 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'relative'
  },
  avatarText: { color: '#60A5FA', fontWeight: 'bold', fontSize: 18 },
  onlineDot: { 
    position: 'absolute', 
    bottom: 2, 
    right: 2, 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#121417'
  },
  content: { flex: 1, marginLeft: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  peerName: { color: 'white', fontSize: 16, fontWeight: '600', fontFamily: 'Inter' },
  time: { color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter' },
  preview: { color: '#9CA3AF', fontSize: 14, marginTop: 2, fontFamily: 'Inter' },
  badge: { 
    backgroundColor: '#60A5FA', 
    borderRadius: 10, 
    minWidth: 20, 
    height: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 2
  },
  badgeText: { color: 'white', fontSize: 11, fontWeight: 'bold' },
  fab: { 
    position: 'absolute', 
    bottom: 30, 
    right: 30, 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: '#60A5FA', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: '#6B7280', fontSize: 16 }
});
