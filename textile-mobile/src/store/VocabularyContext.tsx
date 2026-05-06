import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { tcpService } from '../services/TCPClientService';

type LabelKey = 'industry' | 'unit' | 'bulk' | 'subUnit' | 'worker' | 'batch' | 'action' | 'entity';

interface IndustryConfig {
  industry: string;
  unit: string;
  bulk: string;
  subUnit: string;
  worker: string;
  batch: string;
  action: string;
  entity: string;
  activeCamera?: {
    id: string;
    location: string;
  };
  systemHealth?: 'ACTIVE' | 'CAMERA_DOWN' | 'OFFLINE';
}

interface VocabularyContextValue {
  config: IndustryConfig | null;
  getLabel: (key: LabelKey) => string;
}

const VocabularyContext = createContext<VocabularyContextValue | undefined>(undefined);

export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<IndustryConfig | null>(null);

  useEffect(() => {
    const handleConfig = (newConfig: IndustryConfig) => {
      setConfig(newConfig);
    };

    tcpService.on('configReceived', handleConfig);
    return () => {
      tcpService.off('configReceived', handleConfig);
    };
  }, []);

  const getLabel = useMemo(() => (key: LabelKey): string => {
    return (config?.[key] as string) || key;
  }, [config]);

  // Pillar 4: Mandatory useMemo
  const value = useMemo(() => ({
    config,
    getLabel,
  }), [config, getLabel]);

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (!context) throw new Error('useVocabulary must be used within VocabularyProvider');
  return context;
};
