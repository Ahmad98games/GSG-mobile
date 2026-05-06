import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  Share
} from 'react-native';
import { THEME, COMMON_STYLES } from '../../../src/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../../src/lib/supabase';
import { Printer } from '../../../src/services/PrinterService';
import SvgQRCode from 'react-native-qrcode-svg';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { captureRef } from 'react-native-view-shot';

/**
 * SOVEREIGN QR GENERATOR (v2.0)
 * Industrial-grade label creation for Article, Batch, and Job Orders.
 */

type QRType = 'ARTICLE' | 'BATCH' | 'JOB_ORDER';

export default function QRGenerator() {
  const [type, setType] = useState<QRType>('ARTICLE');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const qrRef = React.useRef<any>();

  const searchRecords = async (text: string) => {
    setSearchQuery(text);
    if (text.length < 2) return;
    setIsLoading(true);

    const table = type === 'ARTICLE' ? 'articles' : type === 'BATCH' ? 'batches' : 'job_orders';
    const field = type === 'JOB_ORDER' ? 'code' : 'code';

    const { data } = await supabase
      .from(table)
      .select('*')
      .ilike('code', `%${text}%`)
      .limit(5);

    setResults(data || []);
    setIsLoading(false);
  };

  const saveToPhotos = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') return;

      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1.0,
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('SUCCESS', 'QR Code saved to Gallery.');
    } catch (e) {
      Alert.alert('ERROR', 'Failed to save QR code.');
    }
  };

  const shareQR = async () => {
    try {
      const uri = await captureRef(qrRef, {
        format: 'png',
        quality: 1.0,
      });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert('ERROR', 'Failed to share QR code.');
    }
  };

  const printQR = async () => {
    if (!selectedItem) return;
    
    // Industrial Bluetooth Transmission
    if (type === 'BATCH') {
        await Printer.printBatchSticker({
            code: selectedItem.code,
            articleName: selectedItem.article_name || 'BCH-ITEM',
            suits: selectedItem.suits_count || 0
        });
    } else {
        Alert.alert('PRINTER', 'Direct printing only supported for BATCH stickers now.');
    }
  };

  return (
    <ScrollView style={COMMON_STYLES.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>QR GENERATOR</Text>

      <View style={styles.typeSelector}>
        {(['ARTICLE', 'BATCH', 'JOB_ORDER'] as QRType[]).map(t => (
          <TouchableOpacity 
            key={t} 
            style={[styles.typeBtn, type === t && styles.activeTypeBtn]}
            onPress={() => { setType(t); setSelectedItem(null); setResults([]); }}
          >
            <Text style={[styles.typeBtnText, type === t && styles.activeTypeBtnText]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color={THEME.colors.text.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${type.toLowerCase()} code...`}
          placeholderTextColor={THEME.colors.text.muted}
          value={searchQuery}
          onChangeText={searchRecords}
        />
        {isLoading && <ActivityIndicator color={THEME.colors.gold} style={{ marginRight: 12 }} />}
      </View>

      <View style={styles.resultsList}>
        {results.map(item => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.resultItem}
            onPress={() => setSelectedItem(item)}
          >
            <Text style={styles.resultText}>{item.code}</Text>
            <Ionicons name="chevron-forward" size={16} color={THEME.colors.gold} />
          </TouchableOpacity>
        ))}
      </View>

      {selectedItem && (
        <View style={styles.qrContainer}>
          <View ref={qrRef} style={styles.qrWrapper}>
            <SvgQRCode
              value={selectedItem.code}
              size={200}
              color="black"
              backgroundColor="white"
              quietZone={10}
            />
            <Text style={styles.qrCodeText}>{selectedItem.code}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionBtn} onPress={printQR}>
              <Ionicons name="print" size={20} color={THEME.colors.background} />
              <Text style={styles.actionBtnText}>PRINT THERMAL</Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={shareQR}>
                <Ionicons name="share-social" size={20} color="white" />
                <Text style={styles.secondaryBtnText}>SHARE</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.actionBtn, styles.secondaryBtn]} onPress={saveToPhotos}>
                <Ionicons name="image" size={20} color="white" />
                <Text style={styles.secondaryBtnText}>SAVE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 60 },
  title: { color: THEME.colors.gold, fontFamily: THEME.fonts.monoBold, fontSize: 24, marginBottom: 24 },
  typeSelector: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  typeBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 4, borderWidth: 1, borderColor: THEME.colors.border },
  activeTypeBtn: { backgroundColor: THEME.colors.gold, borderColor: THEME.colors.gold },
  typeBtnText: { color: THEME.colors.text.muted, fontSize: 10, fontFamily: THEME.fonts.monoBold },
  activeTypeBtnText: { color: THEME.colors.background },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.colors.surface, borderRadius: 8, borderWidth: 1, borderColor: THEME.colors.border },
  searchIcon: { marginLeft: 12 },
  searchInput: { flex: 1, paddingHorizontal: 12, paddingVertical: 14, color: 'white', fontFamily: THEME.fonts.inter },
  resultsList: { marginTop: 12, gap: 4 },
  resultItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: THEME.colors.surface, padding: 16, borderRadius: 4 },
  resultText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  qrContainer: { marginTop: 40, alignItems: 'center' },
  qrWrapper: { backgroundColor: 'white', padding: 20, borderRadius: 8, alignItems: 'center' },
  qrCodeText: { marginTop: 12, color: 'black', fontFamily: THEME.fonts.monoBold, fontSize: 16, letterSpacing: 2 },
  actions: { marginTop: 32, width: '100%', gap: 12 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: THEME.colors.gold, paddingVertical: 16, borderRadius: 4 },
  actionBtnText: { color: THEME.colors.background, fontFamily: THEME.fonts.monoBold, fontSize: 14 },
  row: { flexDirection: 'row', gap: 12 },
  secondaryBtn: { flex: 1, backgroundColor: THEME.colors.surface, borderWidth: 1, borderColor: THEME.colors.border },
  secondaryBtnText: { color: 'white', fontFamily: THEME.fonts.monoBold, fontSize: 12 }
});
