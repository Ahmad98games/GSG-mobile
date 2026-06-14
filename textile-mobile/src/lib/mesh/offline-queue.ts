/**
 * Gold She Mesh — Offline Queue Proxy
 */
import { getSafeStorage } from '../../utils/storage';

export const getOfflineQueue = () => {
  return {
    getPendingCount: () => 0,
    clear: () => {},
    getDeviceId: async () => await getSafeStorage('gs_node_id'),
    getDeviceName: async () => await getSafeStorage('gs_node_name'),
    getHubUrl: async () => await getSafeStorage('gs_hub_url'),
  };
};
