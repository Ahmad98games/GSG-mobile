import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const COLORS = {
  bg: '#09090b',
  surface: '#18181b',
  accent: '#84cc16', // Cyber-Lime
  blue: '#60a5fa',   // Electric Blue
  textPrimary: '#f8fafc',
  border: '#27272a',
};

interface CustomNumpadProps {
  onPress: (val: string) => void;
  onDelete: () => void;
  onClear: () => void;
}

export const CustomNumpad: React.FC<CustomNumpadProps> = ({ onPress, onDelete, onClear }) => {
  const handlePress = (val: string) => {
    // PILLAR 5: Light haptic on every digit
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(val);
  };

  const renderKey = (val: string, icon?: string) => (
    <TouchableOpacity 
      key={val}
      style={styles.key}
      onPress={() => handlePress(val)}
      activeOpacity={0.7}
    >
      {icon ? (
        <Ionicons name={icon as any} size={32} color={COLORS.textPrimary} />
      ) : (
        <Text style={styles.keyText}>{val}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {['1', '2', '3'].map(k => renderKey(k))}
      </View>
      <View style={styles.row}>
        {['4', '5', '6'].map(k => renderKey(k))}
      </View>
      <View style={styles.row}>
        {['7', '8', '9'].map(k => renderKey(k))}
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.key} onPress={onClear}>
          <Text style={[styles.keyText, { color: '#ef4444' }]}>C</Text>
        </TouchableOpacity>
        {renderKey('0')}
        <TouchableOpacity style={styles.key} onPress={onDelete}>
          <Ionicons name="backspace-outline" size={32} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg,
    padding: 8,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  key: {
    flex: 1,
    // ARCHITECT DIRECTIVE: Massive grid buttons (80px height min)
    height: 85, 
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  keyText: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '800',
  }
});
