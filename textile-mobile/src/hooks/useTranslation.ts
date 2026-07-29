import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { URDU_LABELS } from '@/lib/i18n/urdu';

type Language = 'en' | 'ur';

let currentLang: Language = 'en';

// Global subscribers set to notify all useTranslation hooks when language changes
const subscribers = new Set<(lang: Language) => void>();

export function useTranslation() {
  const [lang, setLang] = useState<Language>(currentLang);

  useEffect(() => {
    const loadLang = async () => {
      const stored = await AsyncStorage.getItem('noxis_language');
      if (stored === 'ur' || stored === 'en') {
        currentLang = stored as Language;
        setLang(currentLang);
      }
    };
    
    // Add to subscribers list
    const subscriber = (newLang: Language) => {
      setLang(newLang);
    };
    subscribers.add(subscriber);

    // Initial load
    loadLang();

    return () => {
      subscribers.delete(subscriber);
    };
  }, []);

  const setLanguage = async (newLang: Language) => {
    currentLang = newLang;
    await AsyncStorage.setItem('noxis_language', newLang);
    // Notify all instances
    subscribers.forEach(sub => sub(newLang));
  };

  const tr = (key: string): string => {
    if (lang === 'ur') {
      return URDU_LABELS[key] || key;
    }
    return key;
  };

  return { lang, setLanguage, tr };
}
