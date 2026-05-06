/**
 * Module 4: Intelligence Router Protocol
 * Standardizes code formats and routing logic across the ecosystem.
 */

export type ScanType = 'ARTICLE' | 'BATCH' | 'JOB_ORDER' | 'PURCHASE_ORDER' | 'UNKNOWN';

export interface ScanResult {
  type: ScanType;
  code: string;
  raw: string;
}

const PREFIXES = {
  'GS-ART-': 'ARTICLE',
  'GS-BCH-': 'BATCH',
  'JO-': 'JOB_ORDER',
  'PO-': 'PURCHASE_ORDER',
} as const;

export class IntelligenceRouter {
  /**
   * Parse scanned data into a standardized ecosystem record
   */
  static parse(data: string): ScanResult {
    const raw = data.trim();
    const result = this.detectCodeType(raw);

    if (result) {
      return { type: result.type as ScanType, code: result.code, raw: data };
    }

    return { type: 'UNKNOWN', code: raw, raw: data };
  }

  private static detectCodeType(raw: string): { type: string; code: string } | null {
    const trimmed = raw.trim().toUpperCase();

    // Step 1: Try direct prefix match — O(1)
    for (const [prefix, type] of Object.entries(PREFIXES)) {
      if (trimmed.startsWith(prefix)) {
        return { type, code: trimmed };
      }
    }

    // Step 2: Check if it is a URL containing a known code
    if (trimmed.includes('GOLDSHEINDUSTRIAL.COM/') || trimmed.includes('LOCALHOST')) {
      const segments = trimmed.split('/');
      const lastSegment = segments[segments.length - 1];
      if (lastSegment) {
        return this.detectCodeType(lastSegment); // recursive
      }
    }

    // Step 3: Only now try regex — for edge cases
    const gsArtRegex = /^GS-ART-\d{4}-[A-Z]{3}-\d{2}$/;
    const gsBchRegex = /^GS-BCH-\d{4}-\d{3}-[A-Z0-9]{4}$/;
    const joRegex = /^JO-\d{4}-\d{5}$/;

    if (gsArtRegex.test(trimmed)) return { type: 'ARTICLE', code: trimmed };
    if (gsBchRegex.test(trimmed)) return { type: 'BATCH', code: trimmed };
    if (joRegex.test(trimmed)) return { type: 'JOB_ORDER', code: trimmed };

    return null;
  }
}
