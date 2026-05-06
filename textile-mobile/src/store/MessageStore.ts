import { create } from 'zustand';

export interface Message {
  id: string;
  conversation_id: string;
  from_node_id: string;
  to_node_id: string;
  message_type: 'text' | 'voice' | 'image' | 'system';
  content?: string;
  local_path?: string;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  sent_at: number;
  duration_ms?: number;
}

interface MessageState {
  messages: Record<string, Message[]>; // conversationId -> messages
  conversations: any[];
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, status: Message['status']) => void;
  setConversations: (conversations: any[]) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: {},
  conversations: [],

  addMessage: (message) => set((state) => {
    const thread = state.messages[message.conversation_id] || [];
    return {
      messages: {
        ...state.messages,
        [message.conversation_id]: [...thread, message]
      }
    };
  }),

  updateMessageStatus: (messageId, status) => set((state) => {
    const newMessages = { ...state.messages };
    for (const convId in newMessages) {
      const index = newMessages[convId].findIndex(m => m.id === messageId);
      if (index !== -1) {
        newMessages[convId] = [...newMessages[convId]];
        newMessages[convId][index] = { ...newMessages[convId][index], status };
        break;
      }
    }
    return { messages: newMessages };
  }),

  setConversations: (conversations) => set({ conversations }),
  
  setMessages: (conversationId, messages) => set((state) => ({
    messages: { ...state.messages, [conversationId]: messages }
  }))
}));
