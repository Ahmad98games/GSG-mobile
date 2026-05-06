import { PersonaEngine } from '../lib/persona/PersonaEngine';
import { useProfileStore } from '../store/ProfileStore';
import { useEffect } from 'react';

/**
 * usePersona Hook
 * Injects adaptive industrial terminology into components.
 */
export function usePersona() {
  const { uiManifest } = useProfileStore();

  useEffect(() => {
    if (uiManifest) {
      PersonaEngine.updateManifest(uiManifest);
    }
  }, [uiManifest]);

  return {
    t: (key: string) => PersonaEngine.t(key),
    fmt: (amount: number | string) => PersonaEngine.fmt(amount),
    uiManifest,
  };
}
