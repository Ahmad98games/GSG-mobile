import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Modal,
  Dimensions
} from 'react-native';
import { Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useLeaderboardStore } from '../../../src/store/LeaderboardStore';
import type { KarigarRankItem } from '../../../src/store/LeaderboardStore';
import { usePersona } from '../../../src/hooks/usePersona';
import { NspService } from '../../../src/services/NspService';
import { LucideShare2, LucideAward, LucideTrendingUp, LucideCheckCircle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const LeaderboardScreen = () => {
  const { t } = usePersona();
  const { rankings, period, setPeriod } = useLeaderboardStore();
  const [selectedKarigar, setSelectedKarigar] = useState<KarigarRankItem | null>(null);
  const viewRef = useRef<View>(null);

  const fetchData = async (p: typeof period) => {
    try {
      await NspService.send({
        efficiency_req: {
          node_id: 'MOBILE_CLIENT',
          period: p
        }
      });
    } catch (e) {
      console.error('[Leaderboard] FETCH_ERROR:', e);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const handleShare = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.9,
      });
      await Sharing.shareAsync(uri);
    } catch (e) {
      console.error('[Leaderboard] SHARE_ERROR:', e);
    }
  };

  const RankBadge = ({ rank }: { rank: number }) => {
    const color = rank === 1 ? '#fbbf24' : (rank === 2 ? '#9ca3af' : (rank === 3 ? '#b45309' : '#4b5563'));
    if (rank <= 3) return <LucideAward color={color} size={24} />;
    return <Text style={[styles.rankNumber, { color }]}>{rank}</Text>;
  };

  const Avatar = ({ name }: { name: string }) => {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const color = colors[name.length % colors.length];
    
    return (
      <View style={[styles.avatar, { backgroundColor: color }]}>
        <Text style={styles.avatarText}>{initials}</Text>
      </View>
    );
  };

  const LeaderboardRow = ({ item }: { item: KarigarRankItem }) => {
    const qualityColor = item.qualityScore >= 90 ? '#10b981' : (item.qualityScore >= 70 ? '#f59e0b' : '#ef4444');
    
    return (
      <TouchableOpacity 
        style={styles.row} 
        onPress={() => {
          setSelectedKarigar(item);
          Haptics.selectionAsync();
        }}
      >
        <View style={styles.rankContainer}>
          <RankBadge rank={item.rank} />
        </View>
        
        <Avatar name={item.name} />
        
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.code}>{item.code}</Text>
          <View style={styles.qualityBarContainer}>
            <View style={[styles.qualityBar, { width: `${item.qualityScore}%`, backgroundColor: qualityColor }]} />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.units}>{item.unitsProduced}</Text>
          <Text style={styles.efficiency}>{item.efficiencyRate} u/h</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: t('leaderboard.title') || 'Floor Efficiency',
          headerStyle: { backgroundColor: '#000' },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity onPress={handleShare}>
              <LucideShare2 color="#fff" size={24} />
            </TouchableOpacity>
          )
        }} 
      />

      <View style={styles.tabs}>
        {(['week', 'month', 'last_month'] as const).map(p => (
          <TouchableOpacity 
            key={p} 
            style={[styles.tab, period === p && styles.tabActive]}
            onPress={() => {
              setPeriod(p);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={[styles.tabText, period === p && styles.tabTextActive]}>
              {t(`period.${p}`) || p.replace('_', ' ').toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        ref={viewRef as any}
        data={rankings}
        renderItem={({ item }) => <LeaderboardRow item={item} />}
        keyExtractor={item => item.karigarId}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t('leaderboard.empty') || 'Loading rankings...'}</Text>
          </View>
        }
      />

      {/* Mini Profile Modal */}
      <Modal
        visible={!!selectedKarigar}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedKarigar(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setSelectedKarigar(null)}
        >
          <View style={styles.modalContent}>
            {selectedKarigar && (
              <>
                <View style={styles.modalHeader}>
                  <Avatar name={selectedKarigar.name} />
                  <View>
                    <Text style={styles.modalName}>{selectedKarigar.name}</Text>
                    <Text style={styles.modalCode}>{selectedKarigar.code}</Text>
                  </View>
                </View>

                <View style={styles.modalStatsGrid}>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatLabel}>{t('common.units') || 'Units'}</Text>
                    <Text style={styles.modalStatValue}>{selectedKarigar.unitsProduced}</Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatLabel}>{t('common.quality') || 'Quality'}</Text>
                    <Text style={[styles.modalStatValue, { color: selectedKarigar.qualityScore >= 90 ? '#10b981' : '#f59e0b' }]}>
                      {selectedKarigar.qualityScore}%
                    </Text>
                  </View>
                  <View style={styles.modalStat}>
                    <Text style={styles.modalStatLabel}>{t('common.efficiency') || 'Efficiency'}</Text>
                    <Text style={styles.modalStatValue}>{selectedKarigar.efficiencyRate}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={() => setSelectedKarigar(null)}
                >
                  <Text style={styles.closeButtonText}>{t('common.close') || 'Close'}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  tabActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#60a5fa',
  },
  tabText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 8,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  code: {
    color: '#fbbf24', // Gold
    fontSize: 12,
    fontFamily: 'JetBrainsMono_700Bold',
    marginBottom: 8,
  },
  qualityBarContainer: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    width: '80%',
  },
  qualityBar: {
    height: '100%',
    borderRadius: 2,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  units: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'JetBrainsMono_700Bold',
  },
  efficiency: {
    color: '#6b7280',
    fontSize: 11,
    marginTop: 2,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#4b5563',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  modalName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalCode: {
    color: '#fbbf24',
    fontSize: 14,
    fontFamily: 'JetBrainsMono_700Bold',
  },
  modalStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  modalStat: {
    alignItems: 'center',
  },
  modalStatLabel: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  modalStatValue: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'JetBrainsMono_700Bold',
  },
  closeButton: {
    backgroundColor: '#1f2937',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeaderboardScreen;
