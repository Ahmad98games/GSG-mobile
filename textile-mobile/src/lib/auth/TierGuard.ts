export type Tier = 'lite' | 'pro' | 'elite';

/**
 * TIER GUARD
 * Hardened server-enforced tier comparison.
 */
export function requiresTier(requiredTier: Tier, userTier: Tier): boolean {
  const order: Record<Tier, number> = { 
    lite: 0, 
    pro: 1, 
    elite: 2 
  };
  
  return order[userTier] >= order[requiredTier];
}
