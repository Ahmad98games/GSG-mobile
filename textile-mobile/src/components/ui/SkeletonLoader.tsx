import React, { useEffect } from 'react';
import { View, StyleSheet, type ViewStyle, type DimensionValue } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';
import { THEME } from '../../constants/theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton = ({ width = '100%', height = 20, borderRadius = 4, style }: SkeletonProps) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={[
        styles.skeleton, 
        { width, height, borderRadius }, 
        style, 
        animatedStyle
      ]} 
    />
  );
};

export const KarigarSkeleton = () => (
  <View style={styles.listContainer}>
    {[1, 2, 3, 4, 5].map((_, i) => (
      <View key={i} style={styles.row}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.textContainer}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={10} style={{ marginTop: 8 }} />
        </View>
        <Skeleton width={80} height={20} borderRadius={10} />
      </View>
    ))}
  </View>
);

export const DashboardWidgetSkeleton = () => (
  <View style={styles.widgetGrid}>
    <Skeleton width="48%" height={100} borderRadius={20} />
    <Skeleton width="48%" height={100} borderRadius={20} />
  </View>
);

export const MessageSkeleton = () => (
  <View style={styles.listContainer}>
    {[1, 2, 3, 4].map((_, i) => (
      <View key={i} style={[styles.msgRow, i % 2 === 0 ? styles.msgStart : styles.msgEnd]}>
        <Skeleton width="70%" height={60} borderRadius={16} />
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: THEME.colors.surface,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: THEME.colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  textContainer: {
    flex: 1,
  },
  widgetGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  msgRow: {
    marginBottom: 16,
    width: '100%',
  },
  msgStart: {
    alignItems: 'flex-start',
  },
  msgEnd: {
    alignItems: 'flex-end',
  }
});
