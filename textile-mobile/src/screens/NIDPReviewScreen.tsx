import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
  ActivityIndicator
} from 'react-native';
import { Check, X, AlertCircle, Receipt } from 'lucide-react-native';
import { THEME } from '../constants/DesignSystem';
import { useProductStore } from '../store/useProductStore';
import * as Haptics from 'expo-haptics';
import type { ExtractedInvoiceData } from '../lib/vision/NoxisScanEngine';

interface Props {
  route: {
    params: {
      extractedData: ExtractedInvoiceData;
      imageUri: string;
      partyId: string;
    }
  };
  navigation: any;
}

export const NIDPReviewScreen = ({ route, navigation }: Props) => {
  const { extractedData, imageUri, partyId } = route.params;
  const [amount, setAmount] = useState(extractedData.amount?.toString() || '');
  const [billNo, setBillNo] = useState(extractedData.billNo || '');
  const [category, setCategory] = useState('INVOICE');
  const addTransaction = useProductStore(state => state.addTransaction);

  const handleConfirm = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    addTransaction({
      id: Math.random().toString(36).substr(2, 9),
      party_id: partyId,
      amount: parseFloat(amount),
      type: 'debit',
      category: category,
      created_at: new Date().toISOString(),
    });

    navigation.pop(2); // Go back to Ledger
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AI_VERIFICATION</Text>
          <Text style={styles.headerSubtitle}>NOXIS INTELLIGENT DOC PROCESSOR (NIDP)</Text>
        </View>

        <View style={styles.imagePreviewContainer}>
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          <View style={styles.scanOverlay}>
             <View style={styles.scanLine} />
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>EXTRACTED_AMOUNT (INR)</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.currency}>₹</Text>
              <TextInput 
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#3f3f46"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>BILL_REFERENCE_NO</Text>
            <TextInput 
              style={styles.input}
              value={billNo}
              onChangeText={setBillNo}
              placeholder="N/A"
              placeholderTextColor="#3f3f46"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>TRANSACTION_CATEGORY</Text>
            <TextInput 
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="e.g. RAW_MATERIAL"
              placeholderTextColor="#3f3f46"
            />
          </View>

          <View style={styles.aiAlert}>
            <AlertCircle size={16} color={THEME.colors.horror.neonBlue} />
            <Text style={styles.aiAlertText}>
              NIDP extracted data from industrial document. Please verify accuracy before recording.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
          <X size={20} color="white" />
          <Text style={styles.btnText}>DISCARD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
          <Check size={20} color="black" />
          <Text style={[styles.btnText, { color: 'black' }]}>RECORD ENTRY</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.horror.charcoal,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: '900',
    color: THEME.colors.horror.neonBlue,
    letterSpacing: 2,
    marginTop: 4,
  },
  imagePreviewContainer: {
    height: 200,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    marginBottom: 32,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: THEME.colors.horror.neonBlue,
    shadowColor: THEME.colors.horror.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 9,
    fontWeight: '900',
    color: '#71717a',
    letterSpacing: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currency: {
    fontSize: 24,
    fontWeight: '900',
    color: 'white',
  },
  input: {
    flex: 1,
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  aiAlert: {
    flexDirection: 'row',
    backgroundColor: THEME.colors.horror.neonBlue + '10',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  aiAlertText: {
    flex: 1,
    fontSize: 10,
    color: THEME.colors.horror.neonBlue,
    fontWeight: '700',
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 24,
    paddingBottom: 40,
    gap: 12,
    backgroundColor: THEME.colors.horror.charcoal,
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#18181b',
    gap: 8,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  confirmBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: THEME.colors.horror.neonBlue,
    gap: 8,
  },
  btnText: {
    fontSize: 11,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
  },
});
