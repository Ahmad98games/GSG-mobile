import * as React from "react";
import { Canvas, Group, Path, Text, Skia, Line, Circle, useFont } from "@shopify/react-native-skia";
import { StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { THEME } from "../../../constants/DesignSystem";

/**
 * NOXIS INDUSTRIAL OS - HIGH PERFORMANCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */

interface RadarMetric {
  label: string;
  value: number;
  max: number;
}

interface RadarChartProps {
  data: RadarMetric[];
  size?: number;
  color?: string;
  gridColor?: string;
  labelColor?: string;
}

export const RadarChart = ({
  data,
  size: preferredSize,
  color = THEME.colors.horror.neonBlue,
  gridColor = "rgba(255, 255, 255, 0.1)",
  labelColor = THEME.colors.text.secondary,
}: RadarChartProps) => {
  const font = useFont(require("../../../../assets/fonts/Inter-Bold.ttf"), 10);
  const [layoutSize, setLayoutSize] = React.useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    setLayoutSize(event.nativeEvent.layout);
  };

  const size = preferredSize || Math.min(layoutSize.width, layoutSize.height) || 300;
  const center = size / 2;
  const radius = (size / 2) * 0.8;

  const angleStep = (Math.PI * 2) / data.length;

  const points = data.map((metric, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const distance = (metric.value / metric.max) * radius;
    return {
      x: center + Math.cos(angle) * distance,
      y: center + Math.sin(angle) * distance,
    };
  });

  const radarPath = React.useMemo(() => {
    if (points.length < 3) return null;
    const path = Skia.Path.Make();
    path.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      path.lineTo(points[i].x, points[i].y);
    }
    path.close();
    return path;
  }, [points]);

  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <View style={styles.container} onLayout={onLayout}>
      {layoutSize.width > 0 && (
        <Canvas style={{ width: size, height: size }}>
          {levels.map((level, idx) => {
            const levelRadius = radius * level;
            const levelPoints = data.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              return {
                x: center + Math.cos(angle) * levelRadius,
                y: center + Math.sin(angle) * levelRadius,
              };
            });
            
            const levelPath = Skia.Path.Make();
            levelPath.moveTo(levelPoints[0].x, levelPoints[0].y);
            levelPoints.forEach(p => levelPath.lineTo(p.x, p.y));
            levelPath.close();

            return (
              <Path
                key={`level-${idx}`}
                path={levelPath}
                color={gridColor}
                style="stroke"
                strokeWidth={1}
              />
            );
          })}

          {data.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            return (
              <Line
                key={`axis-${i}`}
                p1={{ x: center, y: center }}
                p2={{
                  x: center + Math.cos(angle) * radius,
                  y: center + Math.sin(angle) * radius,
                }}
                color={gridColor}
                strokeWidth={1}
              />
            );
          })}

          {radarPath && (
            <Group>
              <Path
                path={radarPath}
                color={color}
                style="fill"
                opacity={0.3}
              />
              <Path
                path={radarPath}
                color={color}
                style="stroke"
                strokeWidth={2}
              />
            </Group>
          )}

          {points.map((p, i) => (
            <Circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r={3}
              color={color}
            />
          ))}

          {data.map((metric, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const labelRadius = radius + 25;
            const lx = center + Math.cos(angle) * labelRadius;
            const ly = center + Math.sin(angle) * labelRadius;
            
            return (
              <Group key={`label-group-${i}`}>
                {font && (
                  <Text
                    x={lx - 15}
                    y={ly + 5}
                    text={metric.label}
                    font={font}
                    color={labelColor}
                  />
                )}
              </Group>
            );
          })}
        </Canvas>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
