import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { meshBus, MeshEvent } from '../../services/MeshEventBus';
import { THEME } from '../../constants/theme';

export interface PresenceNode {
  nodeId: string;
  nodeName: string;
  online: boolean;
  lastSeen: number;
}

/**
 * PRESENCE GRID
 * Real-time monitoring of all active industrial nodes.
 * Wired to MeshEventBus (NSP PresenceUpdate events).
 */
export const PresenceGrid = () => {
  const [nodes, setNodes] = useState<Record<string, PresenceNode>>({});

  useEffect(() => {
    const unsub = meshBus.subscribe(MeshEvent.PRESENCE_UPDATE, (payload: any) => {
      setNodes(prev => ({
        ...prev,
        [payload.nodeId]: {
          nodeId: payload.nodeId,
          nodeName: payload.nodeName || payload.nodeId,
          online: payload.online,
          lastSeen: Date.now()
        }
      }));
    });
    return unsub;
  }, []);

  const nodeList = Object.values(nodes).sort((a, b) => b.lastSeen - a.lastSeen);

  if (nodeList.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>WAITING FOR MESH PRESENCE...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>INDUSTRIAL NODE MESH</Text>
      <View style={styles.grid}>
        {nodeList.map(node => (
          <View key={node.nodeId} style={styles.nodeItem}>
            <View style={[
              styles.statusDot, 
              { backgroundColor: node.online ? THEME.colorStatus.online : THEME.colorStatus.offline }
            ]} />
            <View style={styles.nodeInfo}>
               <Text style={styles.nodeName}>{node.nodeName.toUpperCase()}</Text>
               <Text style={styles.nodeIdText}>{node.nodeId.substring(0, 8)}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 24 },
  title: { color: THEME.colors.textSecondary, fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  nodeItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: THEME.colors.surface, 
    padding: 12, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: THEME.colors.border,
    minWidth: 140
  },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  nodeInfo: { flex: 1 },
  nodeName: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  nodeIdText: { color: THEME.colors.textSecondary, fontSize: 8, fontFamily: THEME.fonts.mono, marginTop: 2 },
  empty: { padding: 20, alignItems: 'center' },
  emptyText: { color: THEME.colors.textSecondary, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 }
});
