import { useProfileStore, type IndustryProfile } from '../store/ProfileStore';
import { useBridgeStatus } from '../store/BridgeStatusStore';

interface UIManifest {
  visibleModules: string[];
  labels: Record<string, string>;
  barcodeRegex: string;
}

const FALLBACK_MANIFESTS: Record<IndustryProfile, UIManifest> = {
  TEXTILE: {
    visibleModules: ['Khata', 'Scans', 'Stock', 'Messages', 'Karigar'],
    labels: { 
      unit: 'Thaan', 
      bulk: 'Bundle', 
      primary_action: 'LOG_PRODUCTION',
      secondary_action: 'KHATA_AUDIT'
    },
    barcodeRegex: '^[A-Z0-9]{6,20}$'
  },
  PHARMA: {
    visibleModules: ['Scans', 'Stock', 'ExpiryAlert', 'Messages'],
    labels: { 
      unit: 'Box', 
      bulk: 'Shipper',
      primary_action: 'SCAN_INVENTORY',
      secondary_action: 'CHECK_EXPIRY'
    },
    barcodeRegex: '^(\\d{14}|\\d{8}|\\d{12,13})$'
  },
  LOGISTICS: {
    visibleModules: ['Scans', 'Stock', 'RouteTracking', 'Messages'],
    labels: { 
      unit: 'Parcel', 
      bulk: 'Pallet',
      primary_action: 'SCAN_DISPATCH',
      secondary_action: 'ROUTE_TRACK'
    },
    barcodeRegex: '^([0-9]{20}|[A-Z]{2}[0-9]{9}[A-Z]{2})$'
  },
  GENERAL: {
    visibleModules: ['Scans', 'Stock', 'Messages'],
    labels: { 
      unit: 'Unit', 
      bulk: 'Batch',
      primary_action: 'INITIATE_SCAN',
      secondary_action: 'VIEW_STOCK'
    },
    barcodeRegex: '^.{1,64}$'
  },
  AGRICULTURE: {
    visibleModules: ['Scans', 'Stock', 'Messages', 'YieldTracking'],
    labels: { 
      unit: 'Bag', 
      bulk: 'Trolley',
      primary_action: 'LOG_HARVEST',
      secondary_action: 'CHECK_STOCK'
    },
    barcodeRegex: '^.{1,64}$'
  },
  WHOLESALE: {
    visibleModules: ['Scans', 'Stock', 'Messages', 'Cashflow'],
    labels: { 
      unit: 'Item', 
      bulk: 'Carton',
      primary_action: 'CREATE_INVOICE',
      secondary_action: 'VIEW_LEDGER'
    },
    barcodeRegex: '^.{1,64}$'
  },
  RICE_MILL: {
    visibleModules: ['Scans', 'Stock', 'Messages', 'Production'],
    labels: { 
      unit: 'Munn', 
      bulk: 'Bora',
      primary_action: 'LOG_MILLING',
      secondary_action: 'AUDIT_STOCK'
    },
    barcodeRegex: '^.{1,64}$'
  }
};

/**
 * UI MANIFEST HOOK
 * Provides profile-specific labels, visibility rules, and validation logic.
 */
export function useUIManifest() {
  const { activeProfile, uiManifest } = useProfileStore();
  const { workerTerm } = useBridgeStatus();

  const baseManifest = uiManifest || FALLBACK_MANIFESTS[activeProfile];
  
  // Dynamically map module names based on persona
  const manifest = {
    ...baseManifest,
    visibleModules: baseManifest.visibleModules.map((m: string) => m === 'Karigar' ? workerTerm : m)
  };

  return {
    moduleVisible: (moduleName: string) => manifest.visibleModules.includes(moduleName),
    
    getLabel: (key: string) => manifest.labels[key] || key.toUpperCase(),
    
    getBarcodeRegex: () => new RegExp(manifest.barcodeRegex),
    
    activeProfile
  };
}

