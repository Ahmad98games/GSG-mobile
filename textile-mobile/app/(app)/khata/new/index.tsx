import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { tcpService } from '../../../../src/services/TCPClientService';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { VoiceCommandProcessor } from '../../../../src/lib/audio/VoiceCommandProcessor';
import { meshBus } from '../../../../src/services/MeshEventBus';
import { ScreenHeader } from '../../../../src/components/navigation/ScreenHeader';

export default function NewKhataEntryScreen() {
  const router = useRouter();
  const [party, setParty] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'debit' | 'credit'>('debit');
  const [note, setNote] = useState('');
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // Listen for voice command results if we had a live listener
    // For now, we'll simulate the pre-fill logic
  }, []);

  const handlePost = async () => {
    if (!party || !amount) return;
    setIsPending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await tcpService.sendEvent('KhataEntry', {
        entryId: Math.random().toString(36).substring(7),
        nodeId: 'MOBILE_CLIENT',
        debitAccount: type === 'debit' ? party : 'CASH',
        creditAccount: type === 'credit' ? party : 'CASH',
        amountPkr: parseInt(amount),
        timestamp: Date.now(),
        syncStatus: 'pending'
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      console.error('Post failed:', e);
      setIsPending(false);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false, title: 'Quick Khata', headerStyle: { backgroundColor: '#121417' }, headerTintColor: 'white' }} />
      <ScreenHeader title="Quick Khata" showBack={true} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <Text style={styles.label}>Party / Account</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Search or enter name"
                placeholderTextColor="#6B7280"
                value={party}
                onChangeText={setParty}
              />
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="person-add-outline" size={24} color="#60A5FA" />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Amount (PKR)</Text>
            <TextInput
              style={[styles.input, styles.amountInput]}
              placeholder="0.00"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />

            <Text style={styles.label}>Entry Type</Text>
            <View style={styles.typeRow}>
              <TouchableOpacity 
                style={[styles.typeBtn, type === 'debit' && styles.typeBtnActiveDebit]}
                onPress={() => setType('debit')}
              >
                <Text style={[styles.typeText, type === 'debit' && styles.typeTextActive]}>DEBIT (-)</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.typeBtn, type === 'credit' && styles.typeBtnActiveCredit]}
                onPress={() => setType('credit')}
              >
                <Text style={[styles.typeText, type === 'credit' && styles.typeTextActive]}>CREDIT (+)</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Note (Optional)</Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Add details..."
              placeholderTextColor="#6B7280"
              multiline
              numberOfLines={3}
              value={note}
              onChangeText={setNote}
            />
          </View>

          <View style={styles.voiceSection}>
            <TouchableOpacity style={styles.voiceBtn}>
              <Ionicons name="mic" size={32} color="white" />
            </TouchableOpacity>
            <Text style={styles.voiceHint}>Tap to record voice entry</Text>
            <Text style={styles.voiceExample}>"Debit 2000 for Bilal"</Text>
          </View>

          <TouchableOpacity 
            style={[styles.postBtn, (!party || !amount || isPending) && styles.postBtnDisabled]}
            onPress={handlePost}
            disabled={!party || !amount || isPending}
          >
            <Text style={styles.postBtnText}>{isPending ? 'POSTING...' : 'CONFIRM & POST'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121417' },
  scroll: { padding: 20 },
  card: { backgroundColor: '#1F2937', borderRadius: 16, padding: 20 },
  label: { color: '#9CA3AF', fontSize: 12, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  input: { 
    flex: 1, 
    backgroundColor: '#121417', 
    borderRadius: 12, 
    height: 50, 
    color: 'white', 
    paddingHorizontal: 16,
    fontFamily: 'Inter',
    fontSize: 16
  },
  iconBtn: { marginLeft: 12 },
  amountInput: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    fontFamily: 'JetBrains Mono', 
    color: '#C5A059',
    marginBottom: 20 
  },
  typeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  typeBtn: { 
    flex: 0.48, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: '#374151', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  typeBtnActiveDebit: { backgroundColor: '#EF4444' },
  typeBtnActiveCredit: { backgroundColor: '#10B981' },
  typeText: { color: '#9CA3AF', fontWeight: 'bold', fontSize: 12 },
  typeTextActive: { color: 'white' },
  noteInput: { height: 80, textAlignVertical: 'top', paddingTop: 12 },
  voiceSection: { alignItems: 'center', marginVertical: 30 },
  voiceBtn: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    backgroundColor: '#60A5FA', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 4
  },
  voiceHint: { color: 'white', marginTop: 12, fontWeight: '600' },
  voiceExample: { color: '#6B7280', fontSize: 12, marginTop: 4, fontStyle: 'italic' },
  postBtn: { 
    backgroundColor: '#C5A059', 
    height: 60, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 10
  },
  postBtnDisabled: { opacity: 0.5 },
  postBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold', letterSpacing: 1 }
});
