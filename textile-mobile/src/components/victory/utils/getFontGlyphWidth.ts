/**
 * NOXIS INDUSTRIAL OS - HIGH PERFORMANCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import type { SkFont } from "@shopify/react-native-skia";

export const getFontGlyphWidth = (text: string, font?: SkFont | null) =>
  font
    ?.getGlyphWidths(font.getGlyphIDs(text))
    .reduce((sum, value) => sum + value, 0) ?? 0;

