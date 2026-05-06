/**
 * Gold She Mesh — Offline Queue Proxy
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getOfflineQueue = () => {
  return {
    getPendingCount: () => 0,
    clear: () => {},
    getDeviceId: async () => await AsyncStorage.getItem('gs_node_id'),
    getDeviceName: async () => await AsyncStorage.getItem('gs_node_name'),
    getHubUrl: async () => await AsyncStorage.getItem('gs_hub_url'),
  };
};
