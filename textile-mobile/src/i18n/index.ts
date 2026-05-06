import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

/**
 * SOVEREIGN I18N ENGINE (v2.0)
 * Dual-language support for industrial operations (EN/UR).
 */

const resources = {
  en: {
    translation: {
      "production": {
        "title": "Production Floor",
        "job_orders": "Job Orders",
        "no_jobs": "No Job Orders",
        "status_issued": "Issued",
        "status_in_progress": "In Progress",
        "status_submitted": "Submitted",
        "status_audited": "Audited",
        "due_date": "Due Date",
        "target_suits": "Target Suits",
        "gaz_issued": "Gaz Issued",
        "overdue": "Overdue"
      },
      "audit": {
        "title": "Submit Audit",
        "suits_received_label": "Suits Received",
        "tukra_label": "Remnant (Gaz)",
        "photo_evidence": "Photo Evidence",
        "add_photo": "Add Photo",
        "skip_photo": "Skip",
        "submit_button": "Submit",
        "submitting": "Submitting...",
        "offline_saved": "Offline Saved — Will sync on network return",
        "pass_heading": "Audit Passed",
        "pass_message": "Work is correct. Good job!",
        "alert_heading": "Fabric Deficit",
        "alert_message": "Manager has been notified",
        "variance_label": "Variance",
        "expected_label": "Expected",
        "reported_label": "Reported"
      },
      "scanner": {
        "title": "Scan",
        "instruction": "Place QR Code in front of camera",
        "torch_on": "Torch On",
        "torch_off": "Torch Off",
        "manual_entry_btn": "Type Code",
        "manual_entry_placeholder": "Enter code here",
        "success": "Scan Success",
        "error_unknown": "Unknown Code",
        "error_network": "No Network — Showing Cached Data",
        "last_scanned": "Last Scanned"
      },
      "common": {
        "loading": "Loading...",
        "error": "Error",
        "retry": "Retry",
        "confirm": "Confirm",
        "cancel": "Cancel",
        "save": "Save",
        "back": "Back",
        "offline": "Offline",
        "sync_pending": "Sync Pending",
        "network_restored": "Network Restored"
      }
    }
  },
  ur: {
    translation: {
      "production": {
        "title": "پروڈکشن فلور",
        "job_orders": "جاب آرڈرز",
        "no_jobs": "کوئی جاب آرڈر نہیں",
        "status_issued": "جاری",
        "status_in_progress": "جاری ہے",
        "status_submitted": "جمع کردہ",
        "status_audited": "آڈٹ شدہ",
        "due_date": "آخری تاریخ",
        "target_suits": "مطلوبہ سوٹ",
        "gaz_issued": "جاری گز",
        "overdue": "وقت گزر گیا"
      },
      "audit": {
        "title": "آڈٹ جمع کریں",
        "suits_received_label": "موصول شدہ سوٹ",
        "tukra_label": "ٹکڑا (گز میں)",
        "photo_evidence": "فوٹو ثبوت",
        "add_photo": "فوٹو شامل کریں",
        "skip_photo": "چھوڑیں",
        "submit_button": "جمع کریں",
        "submitting": "جمع ہو رہا ہے...",
        "offline_saved": "آف لائن محفوظ — نیٹ ورک پر واپسی پر سنک ہوگا",
        "pass_heading": "آڈٹ پاس",
        "pass_message": "کام درست ہے۔ اچھا کام!",
        "alert_heading": "کپڑے کی کمی",
        "alert_message": "مینیجر کو اطلاع دی گئی ہے",
        "variance_label": "فرق",
        "expected_label": "متوقع",
        "reported_label": "رپورٹ کردہ"
      },
      "scanner": {
        "title": "اسکین کریں",
        "instruction": "کیو آر کوڈ کیمرے کے سامنے رکھیں",
        "torch_on": "ٹارچ آن",
        "torch_off": "ٹارچ آف",
        "manual_entry_btn": "کوڈ ٹائپ کریں",
        "manual_entry_placeholder": "کوڈ یہاں لکھیں",
        "success": "اسکین کامیاب",
        "error_unknown": "نامعلوم کوڈ",
        "error_network": "نیٹ ورک نہیں — کیشڈ ڈیٹا دکھایا جا رہا ہے",
        "last_scanned": "آخری اسکین"
      },
      "common": {
        "loading": "لوڈ ہو رہا ہے...",
        "error": "خرابی",
        "retry": "دوبارہ کوشش",
        "confirm": "تصدیق کریں",
        "cancel": "منسوخ",
        "save": "محفوظ کریں",
        "back": "واپس",
        "offline": "آف لائن",
        "sync_pending": "سنک باقی ہے",
        "network_restored": "نیٹ ورک بحال"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
