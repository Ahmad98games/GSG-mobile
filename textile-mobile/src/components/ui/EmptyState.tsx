import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet
} from 'react-native'

interface Props {
  icon?: string
  title: string
  description?: string
  action?: {
    label: string
    onPress: () => void
  }
}

export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {description && (
        <Text style={styles.desc}>
          {description}
        </Text>
      )}
      {action && (
        <TouchableOpacity
          style={styles.btn}
          onPress={action.onPress}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>
            {action.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  icon: { fontSize: 48, marginBottom: 16 },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  desc: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: 'rgba(96,165,250,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: {
    color: '#60A5FA',
    fontSize: 14,
    fontWeight: '600',
  },
})
