import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

interface LineData { label: string; value: number }
interface LineChartProps {
  data: LineData[];
  height?: number;
  color?: string;
}

const PAD_TOP = 24;
const PAD_BOTTOM = 28;
const PAD_LEFT = 48;
const PAD_RIGHT = 12;

const fmt = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(0)}k` : `$${n}`;

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 180,
  color = colors.primary,
}) => {
  if (data.length < 2) return null;

  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const range  = maxVal - minVal || 1;

  const innerH = height - PAD_TOP - PAD_BOTTOM;
  const norm = (v: number) => (v - minVal) / range;

  // build absolute pixel coords (we'll express as % of height for y, and absolute px for x concept)
  // We use a 300px virtual width for segment math, scaled via %
  const VW = 300;
  const points = data.map((d, i) => ({
    xPx: PAD_LEFT + (i / (data.length - 1)) * (VW - PAD_LEFT - PAD_RIGHT),
    yPx: PAD_TOP + (1 - norm(d.value)) * innerH,
    label: d.label,
    value: d.value,
  }));

  const yGridValues = [minVal, minVal + range * 0.5, maxVal];

  return (
    <View style={{ height, position: 'relative' }}>

      {/* Y-axis labels + grid lines */}
      {yGridValues.map((v, i) => {
        const yPx = PAD_TOP + (1 - (v - minVal) / range) * innerH;
        return (
          <React.Fragment key={i}>
            <View style={[styles.gridLine, { top: yPx }]} />
            <Text style={[styles.yLabel, { top: yPx - 7 }]}>{fmt(v)}</Text>
          </React.Fragment>
        );
      })}

      {/* Area fill under line (solid tinted slabs) */}
      {points.slice(0, -1).map((pt, i) => {
        const next = points[i + 1];
        const dx = next.xPx - pt.xPx;
        const dy = next.yPx - pt.yPx;
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const leftPct = (pt.xPx / VW) * 100;
        const widthPct = (len / VW) * 100;
        return (
          <View
            key={`seg-${i}`}
            style={{
              position: 'absolute',
              left: `${leftPct}%`,
              top: pt.yPx,
              width: `${widthPct}%`,
              height: 3,
              backgroundColor: color,
              borderRadius: 2,
              transform: [{ rotate: `${angle}deg` }],
              transformOrigin: 'left center',
            }}
          />
        );
      })}

      {/* Vertical drop lines + dots + value labels */}
      {points.map((pt, i) => {
        const leftPct = (pt.xPx / VW) * 100;
        const dropH = height - PAD_BOTTOM - pt.yPx;
        return (
          <React.Fragment key={`pt-${i}`}>
            {/* Drop line */}
            <View style={{
              position: 'absolute',
              left: `${leftPct}%`,
              top: pt.yPx,
              width: 1,
              height: dropH,
              backgroundColor: color + '22',
              marginLeft: -0.5,
            }} />
            {/* Dot */}
            <View style={[styles.dotOuter, {
              left: `${leftPct}%`,
              top: pt.yPx - 7,
              borderColor: color,
            }]}>
              <View style={[styles.dotInner, { backgroundColor: color }]} />
            </View>
            {/* Value label */}
            <Text style={[styles.valueLabel, {
              left: `${leftPct}%`,
              top: pt.yPx - 22,
            }]}>
              {fmt(pt.value)}
            </Text>
          </React.Fragment>
        );
      })}

      {/* X-axis baseline */}
      <View style={[styles.baseline, { top: PAD_TOP + innerH }]} />

      {/* X-axis labels */}
      <View style={[styles.xRow, { marginLeft: PAD_LEFT, marginRight: PAD_RIGHT }]}>
        {data.map((d, i) => (
          <Text key={i} style={styles.xLabel}>{d.label}</Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridLine: {
    position: 'absolute',
    left: PAD_LEFT,
    right: PAD_RIGHT,
    height: 1,
    backgroundColor: colors.chart?.grid ?? '#E8EDF5',
  },
  yLabel: {
    position: 'absolute',
    left: 0,
    width: PAD_LEFT - 4,
    fontSize: 9,
    color: colors.text.tertiary,
    textAlign: 'right',
    fontWeight: '500',
  },
  baseline: {
    position: 'absolute',
    left: PAD_LEFT,
    right: PAD_RIGHT,
    height: 1,
    backgroundColor: colors.border,
  },
  dotOuter: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  dotInner: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  valueLabel: {
    position: 'absolute',
    fontSize: 9,
    fontWeight: '700',
    color: colors.text.secondary,
    marginLeft: -18,
    width: 36,
    textAlign: 'center',
  },
  xRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  xLabel: {
    fontSize: 10,
    color: colors.text.secondary,
    fontWeight: '600',
    textAlign: 'center',
  },
});
