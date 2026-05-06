import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import { tcpService } from '../services/TCPClientService';
import { queueManager } from '../services/OfflineQueueManager';

export type ConnectionStatus = 'CONNECTED' | 'SYNCING' | 'OFFLINE';

export interface ConnectionState {
  status: ConnectionStatus;
  queueCount: number;
  lastSync: number | null;
  isOnline: boolean;
}

const ConnectionContext = createContext<ConnectionState | undefined>(undefined);

/**
 * CONNECTION PROVIDER (v2.0)
 * HIGH-DENSITY OPTIMIZATION: UI State Throttling (2s)
 */
export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitialStatus = (): ConnectionStatus => {
    const isConnected = tcpService.getStatus();
    const count = queueManager.getQueueCount();
    if (!isConnected) return 'OFFLINE';
    return count > 0 ? 'SYNCING' : 'CONNECTED';
  };

  const [state, setState] = useState<ConnectionState>({
    status: getInitialStatus(),
    queueCount: queueManager.getQueueCount(),
    lastSync: null,
    isOnline: tcpService.getStatus(),
  });

  // Task 4: UI Throttle Buffer
  const stateBuffer = useRef<ConnectionState>(state);
  const throttleTimer = useRef<NodeJS.Timeout | null>(null);

  const flushState = () => {
    setState({ ...stateBuffer.current });
    throttleTimer.current = null;
  };

  const updateBufferedState = (patch: Partial<ConnectionState>) => {
    if (patch.status) patch.isOnline = patch.status !== 'OFFLINE';
    stateBuffer.current = { ...stateBuffer.current, ...patch };
    
    // Only flush to UI every 2 seconds to save CPU cycles
    if (!throttleTimer.current) {
      throttleTimer.current = setTimeout(flushState, 2000);
    }
  };

  useEffect(() => {
    const handleConnChange = (isConnected: boolean) => {
      const count = stateBuffer.current.queueCount;
      let status: ConnectionStatus = isConnected ? 'CONNECTED' : 'OFFLINE';
      if (isConnected && count > 0) status = 'SYNCING';
      updateBufferedState({ status });
    };

    const handleCountChange = (count: number) => {
      const isConnected = stateBuffer.current.status !== 'OFFLINE';
      let status: ConnectionStatus = isConnected ? 'CONNECTED' : 'OFFLINE';
      if (isConnected && count > 0) status = 'SYNCING';
      
      const patch: Partial<ConnectionState> = { status, queueCount: count };
      
      // Mark lastSync when queue clears
      if (count === 0 && stateBuffer.current.queueCount > 0) {
        patch.lastSync = Date.now();
      }
      
      updateBufferedState(patch);
    };

    tcpService.on('connectionChange', handleConnChange);
    queueManager.on('countChange', handleCountChange);

    return () => {
      tcpService.off('connectionChange', handleConnChange);
      queueManager.off('countChange', handleCountChange);
      if (throttleTimer.current) clearTimeout(throttleTimer.current);
    };
  }, []);

  const value = useMemo(() => state, [state]);

  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error('useConnection must be used within ConnectionProvider');
  return context;
};

