/**
 * NOXIS INDUSTRIAL OS - HIGH PERFORMANCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import type { PointsArray } from "../types";

/**
 * Stitches together PointsArray into an array of tuples for d3 consumption
 */
export const stitchDataArray = (data: PointsArray): [number, number][] =>
  data.reduce(
    (acc, { x, y }) => {
      if (typeof y === "number") acc.push([x, y]);
      return acc;
    },
    [] as [number, number][],
  );

