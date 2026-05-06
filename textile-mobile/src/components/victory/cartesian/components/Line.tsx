/**
 * NOXIS INDUSTRIAL OS - HIGH PERFORMANCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import * as React from "react";
import {
  Path,
  type PathProps,
  type SkiaDefaultProps,
} from "@shopify/react-native-skia";
import type { PointsArray } from "../../types";
import { type LinePathOptions, useLinePath } from "../hooks/useLinePath";
import { AnimatedPath } from "./AnimatedPath";
import type { PathAnimationConfig } from "../../hooks/useAnimatedPath";

export type CartesianLinePathProps = {
  points: PointsArray;
  animate?: PathAnimationConfig;
} & LinePathOptions &
  SkiaDefaultProps<
    Pick<
      PathProps,
      | "color"
      | "strokeWidth"
      | "strokeJoin"
      | "strokeCap"
      | "blendMode"
      | "strokeMiter"
      | "opacity"
      | "antiAlias"
      | "start"
      | "end"
    >,
    "start" | "end"
  >;

export function Line({
  points,
  animate,
  curveType,
  connectMissingData,
  ...ops
}: React.PropsWithChildren<CartesianLinePathProps>) {
  const { path } = useLinePath(points, {
    curveType,
    connectMissingData,
  });

  return React.createElement(animate ? AnimatedPath : Path, {
    path,
    style: "stroke",
    ...ops,
    ...(Boolean(animate) && { animate }),
  });
}

