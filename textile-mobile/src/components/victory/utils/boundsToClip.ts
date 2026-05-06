/**
 * NOXIS INDUSTRIAL OS - HIGH PERFORMANCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import { rect, type ClipDef } from "@shopify/react-native-skia";
import type { ChartBounds } from "../types";

export const boundsToClip = (bounds: ChartBounds): ClipDef =>
  rect(
    bounds.left,
    bounds.top,
    bounds.right - bounds.left,
    bounds.bottom - bounds.top,
  );

