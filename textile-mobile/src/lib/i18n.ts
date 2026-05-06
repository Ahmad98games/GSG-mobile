import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Module 12: Urdu/Bilingual Protocol
 * Localizes critical production screens for karigars.
 */

const resources = {
  en: {
    translation: {
      "job_registry": "JOB REGISTRY",
      "production_floor": "PRODUCTION_FLOOR",
      "scan_to_init": "SCAN TO INITIALIZE",
      "audit_sub": "AUDIT SUBMISSION",
      "suits_received": "SUITS RECEIVED (+)",
      "tukra_gaz": "REMNANT TUKRA GAZ (GZ)",
      "execute_audit": "EXECUTE AUDIT",
      "security_locked": "SECURITY LOCKED",
    }
  },
  ur: {
    translation: {
      "job_registry": "کام کا رجسٹر",
      "production_floor": "پروڈکشن فلور",
      "scan_to_init": "اسکین شروع کریں",
      "audit_sub": "آڈٹ جمع کروائیں",
      "suits_received": "وصول شدہ سوٹ",
      "tukra_gaz": "باقی ٹکڑا گز",
      "execute_audit": "آڈٹ مکمل کریں",
      "security_locked": "سیکیورٹی لاک",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
