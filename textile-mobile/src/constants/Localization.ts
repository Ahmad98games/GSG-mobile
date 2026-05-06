/**
 * SOVEREIGN TACTICAL LOCALIZATION (v2.0)
 * Simple, zero-dependency translation engine for Roman Urdu / English.
 */

export type Locale = 'EN' | 'UR';

const TRANSLATIONS = {
  EN: {
    scanner_active: 'INDUSTRIAL DECODER ACTIVE',
    scanner_idle: 'SCANNER IDLE',
    wake_up: 'WAKE UP SCANNER',
    waiting_protocol: 'WAITING FOR PROTOCOL',
    unauthorized: 'UNAUTHORIZED NODE',
    scan_gatekeeper: 'SCAN GATEKEEPER QR TO SYNC',
    inward_dock: 'INWARD DOCK',
    dock_clear: 'DOCK IS CLEAR',
    production_floor: 'PRODUCTION FLOOR',
    job_queue: 'LIVE JOB QUEUE',
    execute_protocol: 'EXECUTE PROTOCOL',
    batch_in: 'BATCH IN (+)',
    batch_out: 'BATCH OUT (-)',
    current_stock: 'CURRENT STOCK',
  },
  UR: {
    scanner_active: 'SCANNER CHALU HAI',
    scanner_idle: 'SCANNER SO RAHA HAI',
    wake_up: 'SCANNER JAGAO',
    waiting_protocol: 'SCAN KA INTEZAR HAI',
    unauthorized: 'YE DEVICE REGISTERED NAHI HAI',
    scan_gatekeeper: 'GATEKEEPER QR SCAN KAREIN',
    inward_dock: 'MALL KI AMAD',
    dock_clear: 'DOCK SAF HAI',
    production_floor: 'PRODUCTION FLOOR',
    job_queue: 'KAM KI LIST',
    execute_protocol: 'OK KAREIN',
    batch_in: 'MALL ANDAR (+)',
    batch_out: 'MALL BAHAR (-)',
    current_stock: 'MAUJOODA MALL',
  }
};

export function t(key: keyof typeof TRANSLATIONS['EN'], locale: Locale = 'EN') {
  return TRANSLATIONS[locale][key] || key;
}
