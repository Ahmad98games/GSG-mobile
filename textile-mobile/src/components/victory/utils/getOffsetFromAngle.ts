/**
 * NOXIS INDUSTRIAL OS - HIGH PERFORMANCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
export const getOffsetFromAngle = (rotateAngle: number) => {
  if (!rotateAngle) return 0;

  return Math.sin((Math.PI / 180) * rotateAngle);
};

