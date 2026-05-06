import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Dashboard: undefined;
  Scanner: undefined;
  Ledger: { partyId?: string };
  TacticalChat: undefined;
  QRGenerator: undefined;
  ManagerDashboard: undefined;
  Settings: undefined;
  Pairing: undefined;
  AuditResult: { status: 'PASS' | 'RED_ALERT', suits?: number, variance?: number };
  NIDPReview: { extractedData: any, imageUri: string, partyId: string };
};

export type NavigationProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

// --- MESSENGER MODELS ---

export interface MessengerChannel {
  id: string;
  name: string;
  type: 'BROADCAST' | 'DIRECT' | 'ROLE';
  description?: string;
  created_at: string;
  last_message?: MessengerMessage;
  unread_count?: number;
}

export interface MessengerMessage {
  id: string;
  channel_id: string;
  sender_type: 'PC' | 'NODE';
  sender_id: string;
  sender_name?: string;
  sender_role?: string;
  message_type: 'TEXT' | 'IMAGE' | 'VOICE' | 'COMMAND' | 'SYSTEM';
  content?: string;
  file_url?: string;
  voice_url?: string;
  voice_duration?: number;
  voice_amplitude?: number[];
  reply_to_id?: string;
  created_at: string;
  deleted_at?: string;
  read_receipts?: { reader_id: string, read_at: string }[];
}

export interface NotificationPreference {
  node_id: string;
  notification_type: string;
  is_enabled: boolean;
  dnd_start?: number;
  dnd_end?: number;
}

// --- BUSINESS MODELS ---

export interface ScanLog {
  id: string;
  code: string;
  scan_type: string;
  node_id: string;
  created_at: string;
}

export interface Article {
  id: string;
  code: string;
  name: string;
  color?: string;
  stock_remaining: number;
}

export interface Batch {
  id: string;
  code: string;
  article_id: string;
  suits_count: number;
  unit_cost: number;
  created_at: string;
}

export interface JobOrder {
  id: string;
  code: string;
  status: string;
  created_at: string;
}
