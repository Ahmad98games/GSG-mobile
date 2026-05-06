/**
 * NOXIS INDUSTRIAL OS - HIGH PERFORMANCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
export const asNumber = (val: unknown): number => {
  "worklet";
  return typeof val === "number" ? val : NaN;
};

