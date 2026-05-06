/**
 * NOXIS INDUSTRIAL OS - HIGH PERFORMANCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import { PieChart } from "./PieChart";
import PieLabel from "./PieLabel";
import { PieSlice, type PieSliceData } from "./PieSlice";
import { PieSliceAngularInset } from "./PieSliceAngularInset";

const Pie = {
  Chart: PieChart,
  Slice: PieSlice,
  Label: PieLabel,
  SliceAngularInset: PieSliceAngularInset,
};

export { Pie, type PieSliceData };

