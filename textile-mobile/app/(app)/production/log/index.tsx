import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { tcpService } from '../../../../src/services/TCPClientService';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function ProductionLogScreen() {
  const router = useRouter();
  const [qty, setQty] = useState('');
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('A');
  const [batchId, setBatchId] = useState('BATCH-2024-001'); // Placeholder

  const handleLog = async () => {
    if (!qty) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      await tcpService.sendEvent('StockDelta', {
        deltaId: Math.random().toString(36).substring(7),
        nodeId: 'MOBILE_CLIENT',
        operationType: 'PRODUCTION',
        batchId: batchId,
        qty: parseInt(qty),
        timestamp: Date.now(),
        vectorClock: '0:0'
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      console.error('Log failed:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Log Production', headerStyle: { backgroundColor: '#121417' }, headerTintColor: 'white' }} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.batchInfo}>
          <Text style={styles.label}>ACTIVE BATCH</Text>
          <Text style={styles.batchValue}>{batchId}</Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.label}>QUANTITY PRODUCED</Text>
          <View style={styles.qtyContainer}>
             <TextInput
               style={styles.qtyInput}
               value={qty}
               onChangeText={setQty}
               keyboardType="numeric"
               placeholder="0"
               placeholderTextColor="#374151"
             />
             <View style={styles.qtyControls}>
               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => (parseInt(q || '0') + 10).toString())}>
                 <Text style={styles.qtyBtnText}>+10</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.max(0, parseInt(q || '0') - 10).toString())}>
                 <Text style={styles.qtyBtnText}>-10</Text>
               </TouchableOpacity>
             </View>
          </View>
        </View>

        <View style={styles.gradeSection}>
          <Text style={styles.label}>QUALITY GRADE</Text>
          <View style={styles.gradeRow}>
            {['A', 'B', 'C'].map((g) => (
              <TouchableOpacity 
                key={g}
                style={[styles.gradeBtn, grade === g && styles.gradeBtnActive]}
                onPress={() => setGrade(g as any)}
              >
                <Text style={[styles.gradeText, grade === g && styles.gradeTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, !qty && styles.submitBtnDisabled]}
          onPress={handleLog}
          disabled={!qty}
        >
          <Text style={styles.submitBtnText}>SUBMIT LOG</Text>
          <Ionicons name="checkmark-circle" size={24} color="white" style={{ marginLeft: 12 }} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121417' },
  scroll: { padding: 20 },
  batchInfo: { backgroundColor: '#1F2937', padding: 20, borderRadius: 16, marginBottom: 20 },
  label: { color: '#9CA3AF', fontSize: 12, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
  batchValue: { color: 'white', fontSize: 18, fontFamily: 'JetBrains Mono' },
  inputSection: { marginBottom: 30 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center' },
  qtyInput: { 
    flex: 1, 
    height: 80, 
    backgroundColor: '#1F2937', 
    borderRadius: 16, 
    color: '#60A5FA', 
    fontSize: 48, 
    fontWeight: '900', 
    fontFamily: 'JetBrains Mono',
    paddingHorizontal: 20,
    textAlign: 'center'
  },
  qtyControls: { marginLeft: 16, justifyContent: 'space-between', height: 80 },
  qtyBtn: { 
    backgroundColor: '#374151', 
    width: 60, 
    height: 36, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  qtyBtnText: { color: 'white', fontWeight: 'bold' },
  gradeSection: { marginBottom: 40 },
  gradeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  gradeBtn: { 
    width: 100, 
    height: 70, 
    backgroundColor: '#1F2937', 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151'
  },
  gradeBtnActive: { backgroundColor: '#60A5FA', borderColor: '#60A5FA' },
  gradeText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  gradeTextActive: { color: '#121417' },
  submitBtn: { 
    backgroundColor: '#10B981', 
    height: 72, 
    borderRadius: 20, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 20
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: 2 }
});
