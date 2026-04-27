import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, fontSizes } from '../../theme';

interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: PieSlice[];
  title?: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <View>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.container}>
        {/* Visual donut using segments */}
        <View style={styles.donut}>
          {data.map((slice, i) => {
            const pct = Math.round((slice.value / total) * 100);
            return (
              <View
                key={i}
                style={[
                  styles.segment,
                  {
                    backgroundColor: slice.color,
                    flex: pct,
                  },
                ]}
              />
            );
          })}
        </View>
        {/* Legend */}
        <View style={styles.legend}>
          {data.map((slice, i) => {
            const pct = Math.round((slice.value / total) * 100);
            return (
              <View key={i} style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: slice.color }]} />
                <View>
                  <Text style={styles.legendLabel}>{slice.label}</Text>
                  <Text style={[styles.legendValue, { color: slice.color }]}>
                    {pct}%
                  </Text>
                </View>
              </View>
            );
          })}
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
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  donut: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  segment: {
    width: '100%',
  },
  legend: { flex: 1, gap: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendLabel: { fontSize: fontSizes.xs, color: colors.text.secondary },
  legendValue: { fontSize: fontSizes.sm, fontWeight: '700' },
});
