import React from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../store/AuthStore'; 
import { requiresTier } from '../lib/auth/TierGuard';
import type { Tier } from '../lib/auth/TierGuard';
import { LockedOverlay } from './LockedOverlay';
import { useRouter } from 'expo-router';

interface TierGateProps {
  required: Tier;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * TIER GATE COMPONENT
 * Client-side gating based on server-signed JWT claims.
 */
export function TierGate({ required, children, fallback }: TierGateProps) {
  const { session, nodeTier } = useAuthStore();
  const router = useRouter();

  if (!session) {
    // Redirecting is handled by root layout/middleware, but safe-guarding here
    return null;
  }

  // Cast nodeTier to lower case Tier if stored differently
  const currentTier = (nodeTier?.toLowerCase() || 'lite') as Tier;

  if (!requiresTier(required, currentTier)) {
    return fallback || (
      <LockedOverlay 
        featureName="This Module" 
        requiredTier={required} 
      />
    );
  }

  return <>{children}</>;
}
