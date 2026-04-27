import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../../theme';

interface BarData { label: string; value: number }
interface BarChartProps {
  data: BarData[];
  height?: number;
  color?: string;
  altColor?: string;
  title?: string;
}

const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `${n}`;

export const BarChart: React.FC<BarChartProps> = ({
  data,
  height = 180,
  color = colors.primary,
  title,
}) => {
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const gridLines = [1, 0.75, 0.5, 0.25, 0];

  return (
    <View>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartRow}>

        {/* Y-axis labels */}
        <View style={[styles.yAxis, { height }]}>
          {gridLines.map((g, i) => (
            <Text key={i} style={styles.yLabel}>{fmt(maxVal * g)}</Text>
          ))}
        </View>

        {/* Chart area */}
        <View style={{ flex: 1 }}>
          {/* Grid lines */}
          <View style={[styles.gridArea, { height }]}>
            {gridLines.map((_, i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>

          {/* Bars */}
          <View style={[styles.barsRow, { height }]}>
            {data.map((item, i) => {
              const pct = item.value / maxVal;
              return (
                <View key={i} style={styles.barCol}>
                  <Text style={styles.valueLabel}>{fmt(item.value)}</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.bar, {
                      height: `${Math.max(pct * 100, 3)}%`,
                      backgroundColor: color,
                      opacity: 0.5 + pct * 0.5,
                    }]} />
                  </View>
                  <Text style={styles.barLabel}>{item.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  yAxis: {
    width: 36,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 6,
    paddingBottom: 20,
    paddingTop: 16,
  },
  yLabel: {
    fontSize: 9,
    color: colors.text.tertiary,
    fontWeight: '500',
    textAlign: 'right',
  },
  gridArea: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingTop: 16,
  },
  gridLine: {
    height: 1,
    backgroundColor: colors.chart?.grid ?? '#E8EDF5',
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingBottom: 20,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  valueLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.text.secondary,
    marginBottom: 3,
  },
  barTrack: {
    width: '80%',
    flex: 1,
    justifyContent: 'flex-end',
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: colors.divider,
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 9,
    color: colors.text.tertiary,
    marginTop: 5,
    fontWeight: '500',
  },
});
