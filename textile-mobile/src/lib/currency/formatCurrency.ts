import { PersonaEngine } from '../persona/PersonaEngine';
import { Decimal } from 'decimal.js';

/**
 * MOBILE CURRENCY FORMATTER
 * Consistent with Hub v13.1.0 engine.
 */
export function formatCurrency(
  amount: number | string | Decimal, 
  currency?: string, 
  region?: 'south_asian' | 'international'
): string {
  return PersonaEngine.fmt(amount, currency, region);
}
