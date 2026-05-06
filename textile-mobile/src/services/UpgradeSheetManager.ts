import { createRef } from 'react';
import type { UpgradeSheetRef } from '../components/tier/UpgradeBottomSheet';

/**
 * UPGRADE SHEET MANAGER
 * Singleton reference to the global upgrade bottom sheet.
 */
export const upgradeSheetRef = createRef<UpgradeSheetRef>();

export const UpgradeSheetManager = {
  open: (feature: any) => upgradeSheetRef.current?.open(feature),
  close: () => upgradeSheetRef.current?.close(),
};
