import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useCashflowStore } from '../../store/CashflowStore';
import { usePersona } from '../../hooks/usePersona';
import { LucideAlertTriangle, LucideTrendingUp, LucideTrendingDown } from 'lucide-react-native';
import { THEME } from '../../constants/theme';

const CashflowWidget: React.FC = () => {
  const router = useRouter();
  const { t, fmt } = usePersona();
  const { currentCash, netPosition, riskLevel, shortfallDate } = useCashflowStore();
  
  const pulse = useSharedValue(1);
  const isNetPositive = parseFloat(netPosition) >= 0;

  useEffect(() => {
    if (riskLevel === 'warning' || riskLevel === 'critical') {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 800 }),
          withTiming(1, { duration: 800 })
        ),
        -1,
        true
      );
    } else {
      pulse.value = 1;
    }

    if (riskLevel === 'critical') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [riskLevel]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    backgroundColor: riskLevel === 'healthy' ? '#10b981' : (riskLevel === 'warning' ? '#f59e0b' : '#ef4444'),
  }));

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={() => router.push('/cashflow')}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{t('cashflow.title') || 'Cash Position'}</Text>
          <Animated.View style={[styles.dot, dotStyle]} />
        </View>
        <Text style={styles.cashAmount}>
          {fmt(currentCash)}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.netRow}>
          {isNetPositive ? (
            <LucideTrendingUp size={16} color="#10b981" />
          ) : (
            <LucideTrendingDown size={16} color="#ef4444" />
          )}
          <Text style={[styles.netText, { color: isNetPositive ? '#10b981' : '#ef4444' }]}>
            {t('cashflow.30d_net') || '30D Net'}: {fmt(netPosition)}
          </Text>
        </View>
      </View>

      {riskLevel === 'critical' && shortfallDate && (
        <View style={styles.criticalBanner}>
          <LucideAlertTriangle size={14} color="#fff" />
          <Text style={styles.criticalText}>
            {t('cashflow.shortfall_warning') || 'Cash shortfall projected on'} {shortfallDate}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#374151',
    overflow: 'hidden',
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  cashAmount: {
    color: '#fbbf24', // Gold
    fontSize: 32,
    fontFamily: 'JetBrainsMono_700Bold',
    letterSpacing: -1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  netText: {
    fontSize: 14,
    fontFamily: THEME.fonts.monoBold,
    fontWeight: '600',
  },
  criticalBanner: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: -20,
    marginBottom: -20,
    marginTop: 16,
  },
  criticalText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CashflowWidget;
