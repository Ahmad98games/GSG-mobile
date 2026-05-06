import { Decimal } from 'decimal.js';

/**
 * OMNORA PERSONA ENGINE (MOBILE)
 * Adaptive terminology and formatting engine.
 */
class PersonaEngineClass {
  private terminology: Record<string, string> = {
    'tier.upgrade_available': 'Upgrade Available',
    'tier.devices_title': 'Connected Devices',
    'tier.unlimited_devices': 'Unlimited Nodes',
    'tier.feature_requires_pro': 'Requires Pro Plan',
    'tier.feature_requires_elite': 'Requires Elite Plan',
    'tier.your_plan': 'Your Plan',
    'tier.connected_devices': 'Connected Nodes',
    'tier.upgrade_to': 'Upgrade to {tier}',
    'tier.features_unlocked': '{count} more features',
    'tier.license_key': 'License Key',
    'tier.manage_license': 'Manage License',
    'tier.renewal_date': 'Renewal Date',
    'tier.plan_title': 'Plan Details',
    'alert.sentinel_breach': 'CRITICAL BREACH',
    'alert.low_stock': 'LOW STOCK ALERT',
    'alert.payment_received': 'PAYMENT RECEIVED',
    'alert.new_message': 'TACTICAL MESSAGE',
    'alert.system_lock': 'SYSTEM LOCKDOWN',
    'alert.heartbeat_offline': 'HUB DISCONNECTED',
    'alert.heartbeat_offline_body': 'Connection to Industrial Hub lost.',
    'alert.heartbeat_low_battery': 'LOW BATTERY',
    'alert.heartbeat_low_battery_body': 'Node battery critical (<15%).',
    'notifications.quiet_hours_label': 'Quiet Hours',
    'notifications.critical_always_delivered': 'Security breaches and system locks are always delivered, even during quiet hours.',
    'notifications.send_test': 'Send Test Alert',
    'notifications.history_title': 'Notification History',
    'notifications.suppressed_label': 'Suppressed',
    'notifications.empty_history': 'No alerts in last 30 days',
    'notifications.from_time': 'Suppress from',
    'notifications.to_time': 'Suppress to',
    'notifications.timezone_label': 'Reporting Timezone',
    'notifications.test_suppressed_note': 'Quiet hours active — test will be suppressed',
  };
  private currencySymbol: string = 'Rs.';
  private currency: string = 'PKR';
  private region: 'south_asian' | 'international' = 'south_asian';

  /**
   * Initializes the engine with Hub manifest data.
   */
  public updateManifest(manifest: any) {
    if (manifest.labelOverrides) {
      this.terminology = manifest.labelOverrides;
    }
    if (manifest.currency) {
      this.currency = manifest.currency;
      this.currencySymbol = this.getCurrencySymbol(manifest.currency);
    }
    if (manifest.region) {
      this.region = manifest.region;
    }
  }

  /**
   * Translates a key based on the active industrial persona.
   */
  public t(key: string, params?: Record<string, any>): string {
    let text = this.terminology[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  }

  /**
   * Formats currency with respect to regional standards (Lakh/Western).
   */
  public fmt(amount: number | string | Decimal, currency?: string, region?: 'south_asian' | 'international'): string {
    const val = new Decimal(amount);
    const targetCurrency = currency || this.currency;
    const targetRegion = region || this.region;
    const symbol = this.getCurrencySymbol(targetCurrency);
    
    if (targetRegion === 'south_asian') {
      return `${symbol} ${this.formatSouthAsian(val)}`;
    }
    return `${symbol}${this.formatWestern(val)}`;
  }

  private getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
      'PKR': 'Rs.',
      'INR': '₹',
      'USD': '$',
      'GBP': '£',
      'EUR': '€',
      'AED': 'د.إ',
      'BDT': '৳',
    };
    return symbols[currency] || currency;
  }

  private formatSouthAsian(n: Decimal): string {
    const parts = n.toFixed(2).split('.');
    let x = parts[0];
    const afterPoint = parts.length > 1 ? '.' + parts[1] : '';
    let lastThree = x.substring(x.length - 3);
    const otherNumbers = x.substring(0, x.length - 3);
    if (otherNumbers !== '') {
      lastThree = ',' + lastThree;
    }
    const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
    return res;
  }

  private formatWestern(n: Decimal): string {
    const parts = n.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join('.');
  }
  private static instance: PersonaEngineClass;

  public static getInstance(): PersonaEngineClass {
    if (!PersonaEngineClass.instance) {
      PersonaEngineClass.instance = new PersonaEngineClass();
    }
    return PersonaEngineClass.instance;
  }
}

export const PersonaEngine = PersonaEngineClass.getInstance();
