// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useDiagnosticStore } from '../../store/DiagnosticsStore';
import { RadarChart } from '../victory/polar/RadarChart';
import { CartesianChart } from '../victory/cartesian/CartesianChart';
import { Area } from '../victory/cartesian/components/Area';
import { THEME } from '../../constants/DesignSystem';

const { width } = Dimensions.get('window');

const CHART_SIZE = (width - 48);

/**
 * NOXIS TELEMETRY_DASHBOARD: Massively parallel industrial graph engine.
 * Optimized for 26+ graphs with zero-lag virtualization.
 */
export const TelemetryDashboard = () => {
  const telemetryHistory = useDiagnosticStore((state) => state.telemetryHistory);
  const latest = telemetryHistory[telemetryHistory.length - 1] || {
    cpu_temp: 0,
    cpu_load: 0,
    ram_usage: 0,
    yarn_tension: 0,
    loom_speed: 0,
    vibration_index: 0,
  };

  const radarData = [
    { label: 'TEMP', value: latest.cpu_temp, max: 100 },
    { label: 'LOAD', value: latest.cpu_load, max: 100 },
    { label: 'RAM', value: latest.ram_usage, max: 100 },
    { label: 'TENSION', value: latest.yarn_tension, max: 100 },
    { label: 'SPEED', value: latest.loom_speed, max: 2000 },
    { label: 'VIBE', value: latest.vibration_index * 100, max: 100 },
  ];

  // Simulated 26+ graphs data mapping
  const graphIds = Array.from({ length: 26 }, (_, i) => `graph-${i}`);

  const renderGraph = ({ item }: { item: string }) => {
    // Each graph can represent a different metric or a different machine
    return (
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>{item.toUpperCase()}</Text>
        <View style={styles.chartContainer}>
          <CartesianChart
            data={telemetryHistory}
            xKey="timestamp"
            yKeys={["loom_speed"]}
            axisOptions={{
               font: null, // Custom fonts will be linked here
               labelColor: THEME.colors.text.muted,
               lineColor: THEME.colors.border,
            }}
          >
            {({ points, chartBounds }) => (
              <Area
                points={points.loom_speed}
                chartBounds={chartBounds as any}
                color={THEME.colors.horror.neonBlue}
                animate={{ type: "timing", duration: 300 }}
              />
            )}
          </CartesianChart>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.radarSection}>
        <Text style={styles.sectionTitle}>SYSTEM_CORE_PULSE</Text>
        <RadarChart data={radarData} size={250} />
      </View>

      <Text style={styles.sectionTitle}>PARALLEL_TELEMETRY (26_NODES)</Text>
      <FlashList
        data={graphIds}
        renderItem={renderGraph}
        estimatedItemSize={250}
        numColumns={1}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.horror.charcoal,
  },
  radarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: THEME.colors.horror.neonBlue,
    letterSpacing: 4,
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  graphCard: {
    backgroundColor: THEME.colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  graphTitle: {
    fontSize: 9,
    fontFamily: THEME.fonts.interBold,
    color: THEME.colors.horror.neonBlue,
    marginBottom: 12,
    letterSpacing: 2,
  },
  chartContainer: {
    height: 150,
    width: '100%',
  },
  listContent: {
    paddingBottom: 40,
  },
});
