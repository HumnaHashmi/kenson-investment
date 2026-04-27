import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Header } from '../../components/common/Header';
import { BarChart } from '../../components/common/BarChart';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';
import { formatCurrency } from '../../utils/format';
import { ROUTES } from '../../constants/routes';



const AnimatedNumber: React.FC<{
  value: number;
  formatter: (n: number) => string;
  style?: import('react-native').StyleProp<import('react-native').TextStyle>;
  duration?: number;
}> = ({ value, formatter, style, duration = 1200 }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(formatter(0));

  useEffect(() => {
    anim.setValue(0);
    const id = anim.addListener(({ value: v }) => setDisplay(formatter(Math.floor(v))));
    Animated.timing(anim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(id);
  }, [value]);

  return <Text style={style}>{display}</Text>;
};

const HomeScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    {/* Header placeholder */}
    <View style={skStyles.header}>
      <Skeleton width={120} height={14} borderRadius={6} />
      <Skeleton width={36} height={36} borderRadius={18} />
    </View>
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {/* Hero card */}
      <View style={[styles.heroCard, skStyles.heroCard]}>
        <Skeleton width={160} height={10} borderRadius={5} style={skStyles.skLight} />
        <Skeleton width={200} height={36} borderRadius={8} style={[skStyles.mt8, skStyles.skLight]} />
        <Skeleton width={100} height={24} borderRadius={12} style={[skStyles.mt8, skStyles.skLight]} />
        <View style={styles.heroDivider} />
        <View style={styles.heroStats}>
          {[0, 1, 2].map(i => (
            <React.Fragment key={i}>
              <View style={[styles.heroStatItem, { gap: 4 }]}>
                <Skeleton width={70} height={14} borderRadius={5} style={skStyles.skLight} />
                <Skeleton width={50} height={10} borderRadius={4} style={skStyles.skLight} />
              </View>
              {i < 2 && <View style={styles.heroStatDivider} />}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Quick actions */}
      <View style={styles.actionsRow}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[styles.actionItem]}>
            <Skeleton width={48} height={48} borderRadius={14} />
            <Skeleton width={40} height={10} borderRadius={4} style={skStyles.mt4} />
          </View>
        ))}
      </View>

      {/* Stat cards */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, skStyles.statCard]}>
          <Skeleton width={26} height={26} borderRadius={6} style={skStyles.mb6} />
          <Skeleton width={80} height={10} borderRadius={4} style={skStyles.mb4} />
          <Skeleton width={100} height={18} borderRadius={6} style={skStyles.mb4} />
          <Skeleton width={70} height={9} borderRadius={4} />
        </View>
        <View style={[styles.statCard, skStyles.statCard]}>
          <Skeleton width={26} height={26} borderRadius={6} style={skStyles.mb6} />
          <Skeleton width={50} height={10} borderRadius={4} style={skStyles.mb4} />
          <Skeleton width={80} height={18} borderRadius={6} style={skStyles.mb4} />
          <Skeleton width={90} height={9} borderRadius={4} />
        </View>
      </View>

      {/* Chart card */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View style={{ gap: 4 }}>
            <Skeleton width={140} height={14} borderRadius={5} />
            <Skeleton width={100} height={10} borderRadius={4} />
          </View>
          <Skeleton width={100} height={28} borderRadius={10} />
        </View>
        <Skeleton width="100%" height={190} borderRadius={12} />
      </View>

      {/* Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Skeleton width={120} height={14} borderRadius={5} />
          <Skeleton width={50} height={12} borderRadius={4} />
        </View>
        {[0, 1, 2].map(i => (
          <View key={i} style={[styles.activityItem, { gap: spacing.md }]}>
            <Skeleton width={42} height={42} borderRadius={13} />
            <View style={{ flex: 1, gap: 6 }}>
              <Skeleton width={130} height={13} borderRadius={5} />
              <Skeleton width={80} height={10} borderRadius={4} />
            </View>
            <Skeleton width={70} height={14} borderRadius={5} />
          </View>
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
);

const YEAR_DATA: Record<string, { label: string; value: number }[]> = {
  '2024': [
    { label: 'Jan', value: 8 }, { label: 'Feb', value: 12 }, { label: 'Mar', value: 9 },
    { label: 'Apr', value: 15 }, { label: 'May', value: 11 }, { label: 'Jun', value: 18 },
    { label: 'Jul', value: 14 }, { label: 'Aug', value: 20 }, { label: 'Sep', value: 16 },
    { label: 'Oct', value: 22 }, { label: 'Nov', value: 19 }, { label: 'Dec', value: 25 },
  ],
  '2023': [
    { label: 'Jan', value: 5 }, { label: 'Feb', value: 7 }, { label: 'Mar', value: 6 },
    { label: 'Apr', value: 10 }, { label: 'May', value: 8 }, { label: 'Jun', value: 13 },
    { label: 'Jul', value: 11 }, { label: 'Aug', value: 15 }, { label: 'Sep', value: 12 },
    { label: 'Oct', value: 17 }, { label: 'Nov', value: 14 }, { label: 'Dec', value: 19 },
  ],
  '2022': [
    { label: 'Jan', value: 3 }, { label: 'Feb', value: 4 }, { label: 'Mar', value: 4 },
    { label: 'Apr', value: 6 }, { label: 'May', value: 5 }, { label: 'Jun', value: 9 },
    { label: 'Jul', value: 7 }, { label: 'Aug', value: 10 }, { label: 'Sep', value: 9 },
    { label: 'Oct', value: 12 }, { label: 'Nov', value: 10 }, { label: 'Dec', value: 14 },
  ],
};

const YEARS = ['2022', '2023', '2024'];

const QUICK_ACTIONS: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; color: string; route: string }[] = [
  { icon: 'arrow-up-circle',   label: 'Deposit',   color: colors.primary,  route: ROUTES.TABS.DEPOSITS },
  { icon: 'arrow-down-circle', label: 'Withdraw',  color: colors.success,  route: ROUTES.DRAWER.WITHDRAW },
  { icon: 'document-text',     label: 'Statement', color: colors.accent,   route: ROUTES.DRAWER.MONTHLY_STATEMENT },
  { icon: 'gift',              label: 'Referral',  color: '#9C6FDE',       route: ROUTES.DRAWER.REFERRAL },
];

const ACTIVITY: { label: string; amount: string; date: string; type: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { label: 'Profit Credited',  amount: '+$2,500',  date: 'Apr 14, 2024', type: 'profit',  icon: 'trending-up' },
  { label: 'Deposit Received', amount: '+$10,000', date: 'Apr 10, 2024', type: 'deposit', icon: 'arrow-up-circle' },
  { label: 'Withdrawal',       amount: '-$3,000',  date: 'Apr 8, 2024',  type: 'withdraw',icon: 'arrow-down-circle' },
];

export const HomeScreen: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <HomeScreenSkeleton />; }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header username="John Doe" notificationCount={3} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero Balance Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroDecor1} />
          <View style={styles.heroDecor2} />
          <Text style={styles.heroLabel}>TOTAL PORTFOLIO VALUE</Text>
          <AnimatedNumber value={78400} formatter={formatCurrency} style={styles.heroValue} />
          <View style={styles.heroGrowthRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>↑ 12.4%</Text>
            </View>
            <Text style={styles.heroSub}>vs last month</Text>
          </View>

          <View style={styles.heroDivider} />

          <View style={styles.heroStats}>
            <View style={styles.heroStatItem}>
              <AnimatedNumber value={12750} formatter={formatCurrency} style={styles.heroStatVal} />
              <Text style={styles.heroStatLabel}>Available</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <AnimatedNumber value={50000} formatter={formatCurrency} style={styles.heroStatVal} />
              <Text style={styles.heroStatLabel}>Invested</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStatItem}>
              <AnimatedNumber value={2500} formatter={formatCurrency} style={[styles.heroStatVal, { color: colors.accentLight }]} />
              <Text style={styles.heroStatLabel}>Last Profit</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((a, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(a.route as never)}>
              <View style={[styles.actionIcon, { backgroundColor: a.color + '18' }]}>
                <Ionicons name={a.icon} size={26} color={a.color} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stat Cards Row */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardBlue]}>
            <View style={styles.statCardDecor} />
            <Ionicons name="trending-up" size={26} color="rgba(255,255,255,0.9)" style={styles.statCardIcon} />
            <Text style={styles.statCardLabelDark}>Overall Profit</Text>
            <AnimatedNumber value={28400} formatter={formatCurrency} style={styles.statCardValDark} />
            <Text style={styles.statCardSubDark}>Since inception</Text>
          </View>
          <View style={[styles.statCard, styles.statCardGold]}>
            <View style={styles.statCardDecorGold} />
            <Ionicons name="briefcase" size={26} color="rgba(255,255,255,0.9)" style={styles.statCardIcon} />
            <Text style={styles.statCardLabelDark}>ROI</Text>
            <AnimatedNumber value={568} formatter={n => `${(n / 10).toFixed(1)}%`} style={[styles.statCardValDark, { color: '#fff' }]} />
            <Text style={styles.statCardSubDark}>Annual return</Text>
          </View>
        </View>

        {/* Monthly Earnings Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Monthly Earnings</Text>
              <Text style={styles.chartSub}>Performance overview</Text>
            </View>
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
          </View>
          <BarChart
            data={YEAR_DATA[selectedYear]}
            height={190}
            color={colors.primary}
            altColor={colors.accent}
          />
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.DRAWER.ALL_ACTIVITY as never)}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          {ACTIVITY.map((item, i) => (
            <View key={i} style={styles.activityItem}>
              <View style={[styles.activityIconBox, {
                backgroundColor: item.type === 'withdraw'
                  ? colors.errorLight
                  : item.type === 'profit'
                    ? colors.successLight
                    : colors.divider,
              }]}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={item.type === 'withdraw' ? colors.error : item.type === 'profit' ? colors.success : colors.primary}
                />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityLabel}>{item.label}</Text>
                <Text style={styles.activityDate}>{item.date}</Text>
              </View>
              <Text style={[styles.activityAmount, {
                color: item.type === 'withdraw' ? colors.error : colors.success,
              }]}>
                {item.amount}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing['3xl'] },

  // Hero Card
  heroCard: {
    backgroundColor: colors.primary,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    borderRadius: 24,
    padding: spacing.xl,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  heroDecor1: {
    position: 'absolute', top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  heroDecor2: {
    position: 'absolute', bottom: -20, right: 60,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroLabel: {
    fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.55)',
    fontWeight: '700', letterSpacing: 1.2,
  },
  heroValue: {
    fontSize: 36, fontWeight: '800', color: '#fff',
    letterSpacing: -1, marginTop: 6,
  },
  heroGrowthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  heroBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20,
  },
  heroBadgeText: { color: '#fff', fontSize: fontSizes.xs, fontWeight: '800' },
  heroSub: { fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.5)' },
  heroDivider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: spacing.base,
  },
  heroStats: { flexDirection: 'row', alignItems: 'center' },
  heroStatItem: { flex: 1, alignItems: 'center' },
  heroStatVal: { fontSize: fontSizes.base, fontWeight: '800', color: '#fff' },
  heroStatLabel: { fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontWeight: '500' },
  heroStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.12)' },

  // Quick Actions
  actionsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  actionItem: { flex: 1, alignItems: 'center', gap: 6 },
  actionIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '600' },

  // Stat Cards
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1, borderRadius: 20, padding: spacing.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  statCardBlue: { backgroundColor: colors.primaryLight },
  statCardGold: { backgroundColor: colors.accent },
  statCardDecor: {
    position: 'absolute', top: -20, right: -20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  statCardDecorGold: {
    position: 'absolute', top: -20, right: -20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statCardIcon: { marginBottom: 6 },
  statCardLabelDark: {
    fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.65)',
    fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6,
  },
  statCardValDark: {
    fontSize: fontSizes.xl, fontWeight: '800', color: '#fff',
    marginTop: 2, letterSpacing: -0.5,
  },
  statCardSubDark: { fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.5)', marginTop: 3 },

  // Chart
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.base,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  chartTitle: { fontSize: fontSizes.base, fontWeight: '700', color: colors.text.primary },
  chartSub: { fontSize: fontSizes.xs, color: colors.text.tertiary, marginTop: 2 },
  yearTabs: { flexDirection: 'row', gap: 4, backgroundColor: colors.divider, borderRadius: 10, padding: 3 },
  yearTab: {
    paddingHorizontal: spacing.sm, paddingVertical: 4,
    borderRadius: 8,
  },
  yearTabActive: { backgroundColor: colors.primary },
  yearTabText: { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '600' },
  yearTabTextActive: { color: '#fff' },

  // Activity
  section: { marginHorizontal: spacing.base, marginTop: spacing.base },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSizes.base, fontWeight: '700', color: colors.text.primary },
  seeAll: { fontSize: fontSizes.sm, color: colors.primaryLight, fontWeight: '600' },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  activityIconBox: {
    width: 42, height: 42, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    marginRight: spacing.md,
  },
  activityInfo: { flex: 1 },
  activityLabel: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary },
  activityDate: { fontSize: fontSizes.xs, color: colors.text.tertiary, marginTop: 2 },
  activityAmount: { fontSize: fontSizes.base, fontWeight: '800' },
});

const skStyles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  heroCard: { gap: 6 },
  skLight: { backgroundColor: 'rgba(255,255,255,0.25)' },
  statCard: { backgroundColor: colors.surface, gap: 6 },
  mt4: { marginTop: 4 },
  mt8: { marginTop: 8 },
  mb4: { marginBottom: 4 },
  mb6: { marginBottom: 6 },
});
