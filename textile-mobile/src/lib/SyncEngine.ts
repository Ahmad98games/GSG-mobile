import { queueManager } from '../services/OfflineQueueManager';

/**
 * SYNC ENGINE BRIDGE
 * Ensures backward compatibility with legacy components.
 * Forwards all calls to the SQLite-backed OfflineQueueManager.
 */
export const SyncEngine = {
  enqueue: async (type: string, payload: any) => {
    return await queueManager.addToQueue(type, payload);
  },
  
  getQueueCount: () => {
    return queueManager.getQueueCount();
  },

  getQueueLength: () => {
    return queueManager.getQueueCount();
  }
};
