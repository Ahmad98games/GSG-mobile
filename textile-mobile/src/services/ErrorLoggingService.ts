import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../utils/storage';
import { tcpService } from './TCPClientService';
import { queueManager } from './OfflineQueueManager';
import { Platform } from 'react-native';

interface ErrorLog {
  ts: number;
  message: string;
  stack?: string;
  nodeId?: string;
  os: string;
}

/**
 * REMOTE ERROR LOGGING SERVICE
 * Focus: Forensic debugging for factory-floor crashes.
 */
class ErrorLoggingService {
  private PENDING_ERRORS_KEY = 'gs_pending_errors';

  /**
   * Initializes the Global Error Handler
   */
  public init() {
    const defaultHandler = (ErrorUtils as any).getGlobalHandler();

    (ErrorUtils as any).setGlobalHandler(async (error: any, isFatal: boolean) => {
      console.error('[FATAL_ERROR] Capturing forensic log:', error.message);
      
      await this.saveError(error);

      // Pass back to default handler (allows normal crash behavior)
      if (defaultHandler) {
        defaultHandler(error, isFatal);
      }
    });

    // Listen for TCP connection to drain logs
    tcpService.on('connectionChange', (connected) => {
      if (connected) this.drainLogs();
    });
  }

  /**
   * Saves error to local storage for later upload
   */
  public async saveError(error: any) {
    try {
      const nodeId = await getSafeStorage('gs_node_id');
      const log: ErrorLog = {
        ts: Date.now(),
        message: error.message || 'Unknown Error',
        stack: error.stack,
        nodeId: nodeId || 'UNIDENTIFIED_NODE',
        os: `${Platform.OS} ${Platform.Version}`
      };

      const existing = await this.getPendingLogs();
      existing.push(log);
      
      await AsyncStorage.setItem(this.PENDING_ERRORS_KEY, JSON.stringify(existing.slice(-10))); // Keep last 10
    } catch (e) {
      console.error('[ErrorLogger] Failed to save error:', e);
    }
  }

  private async getPendingLogs(): Promise<ErrorLog[]> {
    try {
      const data = await getSafeStorage(this.PENDING_ERRORS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  /**
   * Silently uploads logs to the Hub via the Intelligent Queue
   */
  public async drainLogs() {
    const logs = await this.getPendingLogs();
    if (logs.length === 0) return;

    console.log(`[ErrorLogger] Queueing ${logs.length} crash logs to Tier 1...`);

    for (const log of logs) {
      await queueManager.enqueueTier1(4, log);
    }

    // Clear logs after queuing
    await AsyncStorage.removeItem(this.PENDING_ERRORS_KEY);
  }
}

export const errorLogger = new ErrorLoggingService();
