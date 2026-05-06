import React, { useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Receipt,
  Download,
  Share2
} from 'lucide-react-native';
import { useProductStore } from '../store/useProductStore';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { NoxisScanEngine } from '../lib/vision/NoxisScanEngine';
import { THEME } from '../constants/DesignSystem';
import type { RootStackParamList } from '../lib/types';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';

const GOLD = '#D4AF37';
const BG = '#09090b';
const CARD = '#18181b';
const BORDER = '#27272a';

interface Props {
  navigation: StackNavigationProp<RootStackParamList, 'Ledger'>;
  route: RouteProp<RootStackParamList, 'Ledger'>;
}

export const PartyLedgerView = ({ route, navigation }: Props) => {
  const { partyId } = route.params;
  const parties = useProductStore((state) => state.parties);
  const transactions = useProductStore((state) => state.transactions);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const party = useMemo(() => 
    parties.find(p => p.id === partyId), 
    [parties, partyId]
  );

  const ledgerHistory = useMemo(() => 
    transactions.filter(t => t.party_id === partyId),
    [transactions, partyId]
  );

  const handleBack = async () => {
    await Haptics.selectionAsync();
    navigation.goBack();
  };

  const renderLedgerItem = ({ item }: { item: any }) => (
    <View style={styles.ledgerRow}>
      <View style={styles.ledgerIconContainer}>
        {item.type === 'credit' ? (
          <ArrowUpRight size={14} color="#10b981" />
        ) : (
          <ArrowDownLeft size={14} color="#ef4444" />
        )}
      </View>
      <View style={styles.ledgerDetails}>
        <Text style={styles.ledgerCategory}>{item.category.toUpperCase()}</Text>
        <Text style={styles.ledgerDate}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <Text style={[
        styles.ledgerAmount,
        { color: item.type === 'credit' ? '#10b981' : '#ef4444' }
      ]}>
        {item.type === 'credit' ? '+' : '-'}₹{item.amount.toLocaleString()}
      </Text>
    </View>
  );

  if (!party) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{party.name}</Text>
          <Text style={styles.headerSubtitle}>{party.type.toUpperCase()}</Text>
        </View>
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={18} color={GOLD} />
        </TouchableOpacity>
      </View>

      {/* Hero Balance Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroLabel}>CURRENT OUTSTANDING</Text>
        <Text style={[
          styles.heroBalance,
          { color: party.balance >= 0 ? GOLD : '#ef4444' }
        ]}>
          ₹{Math.abs(party.balance).toLocaleString()}
        </Text>
        <Text style={styles.heroStatus}>
          {party.balance >= 0 ? 'TOTAL PAYABLE' : 'TOTAL RECEIVABLE'}
        </Text>
      </View>

      {/* Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionItem}>
          <Receipt size={16} color="white" />
          <Text style={styles.actionText}>NEW INVOICE</Text>
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionItem}>
          <Download size={16} color="white" />
          <Text style={styles.actionText}>EXPORT PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Ledger History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>TRANSACTION TIMELINE</Text>
        <FlatList
          data={ledgerHistory}
          renderItem={renderLedgerItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>NO TRANSACTION HISTORY</Text>
            </View>
          }
        />
      </View>

      {/* Floating Scan Button (NIDP) */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
          });

          if (!result.canceled) {
            setIsProcessing(true);
            try {
              const extractedData = await NoxisScanEngine.processInvoice(result.assets[0].uri);
              navigation.navigate('NIDPReview', {
                extractedData,
                imageUri: result.assets[0].uri,
                partyId: partyId as string
              });
            } catch (err) {
              console.error('[NIDP_UI_FAULT]', err);
            } finally {
              setIsProcessing(false);
            }
          }
        }}
      >
        {isProcessing ? (
          <ActivityIndicator color="black" />
        ) : (
          <Receipt size={24} color="black" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: 'white',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 8,
    fontWeight: '900',
    color: GOLD,
    letterSpacing: 2,
    marginTop: 2,
  },
  actionButton: {
    padding: 8,
    marginRight: -8,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: CARD,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  heroLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#71717a',
    letterSpacing: 3,
    marginBottom: 8,
  },
  heroBalance: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
    marginBottom: 4,
  },
  heroStatus: {
    fontSize: 10,
    fontWeight: '900',
    color: '#52525b',
    letterSpacing: 1,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: CARD,
    margin: 24,
    padding: 2,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  actionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 9,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
  },
  divider: {
    width: 1,
    backgroundColor: BORDER,
    marginVertical: 10,
  },
  historySection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#71717a',
    letterSpacing: 2,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 40,
  },
  ledgerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  ledgerIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: BG,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  ledgerDetails: {
    flex: 1,
  },
  ledgerCategory: {
    fontSize: 11,
    fontWeight: '800',
    color: '#f4f4f5',
    marginBottom: 2,
  },
  ledgerDate: {
    fontSize: 9,
    color: '#52525b',
    fontWeight: '700',
  },
  ledgerAmount: {
    fontSize: 14,
    fontWeight: '900',
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    color: '#3f3f46',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: THEME.colors.horror.neonBlue,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.colors.horror.neonBlue,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
});
