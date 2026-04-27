import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Header } from '../../components/common/Header';
import { LineChart } from '../../components/common/LineChart';
import { BarChart } from '../../components/common/BarChart';
import { PieChart } from '../../components/common/PieChart';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const PortfolioScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.header}>
      <Skeleton width={120} height={14} borderRadius={6} />
      <Skeleton width={36} height={36} borderRadius={18} />
    </View>
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={skStyles.pageHeader}>
        <Skeleton width={160} height={22} borderRadius={6} />
        <Skeleton width={200} height={11} borderRadius={4} style={{ marginTop: 6 }} />
      </View>
      {/* Stat boxes */}
      <View style={styles.statsRow}>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.statBox, skStyles.statBox]}>
            <Skeleton width={20} height={20} borderRadius={5} style={{ marginBottom: 6 }} />
            <Skeleton width={60} height={15} borderRadius={5} style={{ marginBottom: 4 }} />
            <Skeleton width={80} height={10} borderRadius={4} />
          </View>
        ))}
      </View>
      {/* Chart cards */}
      {[0, 1, 2].map(i => (
        <View key={i} style={[styles.card, skStyles.card]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
            <View style={{ gap: 5 }}>
              <Skeleton width={140} height={14} borderRadius={5} />
              <Skeleton width={100} height={10} borderRadius={4} />
            </View>
            <Skeleton width={90} height={26} borderRadius={10} />
          </View>
          <Skeleton width="100%" height={i === 2 ? 160 : 160} borderRadius={10} />
          {i === 2 && (
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: spacing.base, marginTop: spacing.md }}>
              {[0, 1, 2].map(j => (
                <View key={j} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Skeleton width={10} height={10} borderRadius={5} />
                  <Skeleton width={50} height={10} borderRadius={4} />
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  </SafeAreaView>
);

const skStyles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  pageHeader: { paddingHorizontal: spacing.base, paddingTop: spacing.base, paddingBottom: spacing.sm },
  statBox: { borderTopColor: colors.border },
  card: { gap: 0 },
});

const YEARS = ['2022', '2023', '2024'];

const LINE_DATA: Record<string, { label: string; value: number }[]> = {
  '2024': [
    { label: 'Q1', value: 42000 }, { label: 'Q2', value: 47500 },
    { label: 'Q3', value: 52000 }, { label: 'Q4', value: 58000 },
  ],
  '2023': [
    { label: 'Q1', value: 30000 }, { label: 'Q2', value: 34000 },
    { label: 'Q3', value: 38000 }, { label: 'Q4', value: 42000 },
  ],
  '2022': [
    { label: 'Q1', value: 20000 }, { label: 'Q2', value: 24000 },
    { label: 'Q3', value: 27000 }, { label: 'Q4', value: 30000 },
  ],
};

const BAR_DATA: Record<string, { label: string; value: number }[]> = {
  '2024': [
    { label: 'Jan', value: 4 }, { label: 'Mar', value: 6 }, { label: 'May', value: 5 },
    { label: 'Jul', value: 8 }, { label: 'Sep', value: 7 }, { label: 'Nov', value: 10 },
  ],
  '2023': [
    { label: 'Jan', value: 3 }, { label: 'Mar', value: 4 }, { label: 'May', value: 4 },
    { label: 'Jul', value: 5 }, { label: 'Sep', value: 5 }, { label: 'Nov', value: 7 },
  ],
  '2022': [
    { label: 'Jan', value: 2 }, { label: 'Mar', value: 3 }, { label: 'May', value: 3 },
    { label: 'Jul', value: 4 }, { label: 'Sep', value: 4 }, { label: 'Nov', value: 5 },
  ],
};

const PIE_DATA = [
  { label: 'Invested', value: 50000, color: colors.primary },
  { label: 'Profit',   value: 28400, color: colors.accent },
  { label: 'Withdrawn',value: 8600,  color: colors.success },
];

const STATS: { label: string; value: string; color: string; icon: IoniconsName }[] = [
  { label: 'Total Invested', value: '$50,000', color: colors.primary, icon: 'briefcase' },
  { label: 'Total Profit',   value: '$28,400', color: colors.success, icon: 'trending-up' },
  { label: 'Annual ROI',     value: '56.8%',   color: colors.accent,  icon: 'stats-chart' },
];

export const PortfolioScreen: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <PortfolioScreenSkeleton />; }

  const YearPicker = () => (
    <View style={styles.yearTabs}>
      {YEARS.map(yr => (
        <TouchableOpacity
          key={yr}
          style={[styles.yearTab, selectedYear === yr && styles.yearTabActive]}
          onPress={() => setSelectedYear(yr)}>
          <Text style={[styles.yearTabText, selectedYear === yr && styles.yearTabTextActive]}>
            {yr}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header username="John Doe" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>My Portfolio</Text>
          <Text style={styles.pageSub}>Track your investment performance</Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={[styles.statBox, { borderTopColor: s.color }]}>
              <Ionicons name={s.icon} size={20} color={s.color} style={styles.statIcon} />
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Investment Graph */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Portfolio Growth</Text>
              <Text style={styles.cardSub}>Quarterly performance</Text>
            </View>
            <YearPicker />
          </View>
          <LineChart data={LINE_DATA[selectedYear]} height={160} color={colors.primaryLight} />
        </View>

        {/* Monthly Returns */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardTitle}>Monthly Returns</Text>
              <Text style={styles.cardSub}>In thousands (k)</Text>
            </View>
            <YearPicker />
          </View>
          <BarChart data={BAR_DATA[selectedYear]} height={180} color={colors.primary} altColor={colors.accent} />
        </View>

        {/* Allocation */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Portfolio Allocation</Text>
          <Text style={styles.cardSub}>Investment breakdown</Text>
          <View style={{ height: spacing.md }} />
          <PieChart data={PIE_DATA} />

          <View style={styles.legendRow}>
            {PIE_DATA.map((p, i) => (
              <View key={i} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: p.color }]} />
                <Text style={styles.legendLabel}>{p.label}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing['3xl'] },

  pageHeader: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  pageTitle: {
    fontSize: fontSizes['2xl'], fontWeight: '800',
    color: colors.text.primary, letterSpacing: -0.5,
  },
  pageSub: { fontSize: fontSizes.sm, color: colors.text.tertiary, marginTop: 2 },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  statBox: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 16,
    padding: spacing.md, alignItems: 'center', borderTopWidth: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  statIcon: { marginBottom: 6 },
  statValue: { fontSize: fontSizes.base, fontWeight: '800', letterSpacing: -0.3 },
  statLabel: {
    fontSize: 9, color: colors.text.tertiary,
    marginTop: 3, textAlign: 'center', fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.4,
  },

  card: {
    backgroundColor: colors.surface, borderRadius: 20,
    padding: spacing.base, marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: spacing.md,
  },
  cardTitle: { fontSize: fontSizes.base, fontWeight: '700', color: colors.text.primary },
  cardSub: { fontSize: fontSizes.xs, color: colors.text.tertiary, marginTop: 2 },
  yearTabs: {
    flexDirection: 'row', gap: 4,
    backgroundColor: colors.divider, borderRadius: 10, padding: 3,
  },
  yearTab: { paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: 8 },
  yearTabActive: { backgroundColor: colors.primary },
  yearTabText: { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '600' },
  yearTabTextActive: { color: '#fff' },

  legendRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.base, marginTop: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '600' },
});
