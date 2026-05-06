/**
 * NOXIS INDUSTRIAL OS - HIGH PERFORMANCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import type { Scale } from "../types";

// This function aligns a secondary Y scale's ticks to the primary Y scale's ticks so that the ticks on either side of the chart are drawn on the same lines.
export const normalizeYAxisTicks = (
  primaryTicks: number[],
  primaryYScale: Scale,
  yScale: Scale,
) => {
  return primaryTicks.map((tick) => {
    return yScale.invert(primaryYScale(tick));
  });
};

