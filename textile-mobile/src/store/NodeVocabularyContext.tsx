import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSafeStorage } from '../utils/storage';

/**
 * DYNAMIC VOCABULARY SYSTEM
 * Lead Systems Engineer Implementation for Gold She Mesh.
 * Maps terminology based on the industrial domain (Textile, Pharma, etc.)
 */

export type IndustryType = 'Textile' | 'Pharma' | 'General';

interface Vocabulary {
  unit: string;
  batch: string;
  worker: string;
  inventory: string;
  action_add: string;
  action_sub: string;
}

const DICTIONARIES: Record<IndustryType, Vocabulary> = {
  Textile: {
    unit: 'Suits',
    batch: 'Lot',
    worker: 'Stitcher',
    inventory: 'Stock Room',
    action_add: 'INWARD',
    action_sub: 'OUTWARD'
  },
  Pharma: {
    unit: 'Bottles',
    batch: 'Batch',
    worker: 'Operator',
    inventory: 'Cold Storage',
    action_add: 'RECEIVE',
    action_sub: 'DISPENSE'
  },
  General: {
    unit: 'Units',
    batch: 'Batch',
    worker: 'Staff',
    inventory: 'Warehouse',
    action_add: 'ADD',
    action_sub: 'SUBTRACT'
  }
};

interface VocabularyContextType {
  vocabulary: Vocabulary;
  industryType: IndustryType;
  isLoading: boolean;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

export const NodeVocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [industryType, setIndustryType] = useState<IndustryType>('General');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const raw = await getSafeStorage('gs_node_config');
        const config = raw ? JSON.parse(raw) : null;
        if (config) {
          if (config.industryType) {
            setIndustryType(config.industryType);
          }
        }
      } catch (e) {
        console.error('[Vocabulary] Failed to load industry config:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Performance Optimization: Only re-calculate vocabulary if industryType changes
  const vocabulary = useMemo(() => DICTIONARIES[industryType] || DICTIONARIES.General, [industryType]);

  const value = useMemo(() => ({
    vocabulary,
    industryType,
    isLoading
  }), [vocabulary, industryType, isLoading]);

  return (
    <VocabularyContext.Provider value={value}>
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (context === undefined) {
    throw new Error('useVocabulary must be used within a NodeVocabularyProvider');
  }
  return context;
};
