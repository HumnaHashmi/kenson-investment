import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';

const AllActivityScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.screenHeader}>
      <View style={{ gap: 5 }}>
        <Skeleton width={110} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={90} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
    </View>
    {/* Summary banner */}
    <View style={styles.summary}>
      {[0, 1, 2].map(i => (
        <React.Fragment key={i}>
          <View style={styles.summaryItem}>
            <Skeleton width={60} height={16} borderRadius={5} style={skStyles.skLight} />
            <Skeleton width={70} height={10} borderRadius={4} style={[skStyles.skLight, { marginTop: 4 }]} />
          </View>
          {i < 2 && <View style={styles.summaryDivider} />}
        </React.Fragment>
      ))}
    </View>
    {/* Filter row */}
    <View style={styles.filterRow}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={[styles.filterBtn, { flex: 1 }]}>
          <Skeleton width="80%" height={11} borderRadius={4} />
        </View>
      ))}
    </View>
    {/* List items */}
    <View style={{ padding: spacing.base, gap: spacing.sm }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <View key={i} style={[styles.item, { gap: spacing.md }]}>
          <Skeleton width={44} height={44} borderRadius={13} />
          <View style={{ flex: 1, gap: 5 }}>
            <Skeleton width={120} height={13} borderRadius={5} />
            <Skeleton width={150} height={10} borderRadius={4} />
            <Skeleton width={80} height={9} borderRadius={4} />
          </View>
          <Skeleton width={65} height={16} borderRadius={5} />
        </View>
      ))}
    </View>
  </SafeAreaView>
);

const skStyles = StyleSheet.create({
  screenHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  },
  skLight: { backgroundColor: 'rgba(255,255,255,0.25)' },
});

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const ALL_ACTIVITY: {
  id: string; label: string; amount: string; date: string;
  type: string; icon: IoniconsName; note: string;
}[] = [
  { id: '1', label: 'Profit Credited',  amount: '+$2,500',  date: 'Apr 14, 2024', type: 'profit',  icon: 'trending-up',        note: 'Monthly return Q2' },
  { id: '2', label: 'Deposit Received', amount: '+$10,000', date: 'Apr 10, 2024', type: 'deposit', icon: 'arrow-up-circle',    note: 'Bank Transfer • REF-4521' },
  { id: '3', label: 'Withdrawal',       amount: '-$3,000',  date: 'Apr 8, 2024',  type: 'withdraw',icon: 'arrow-down-circle',  note: 'Wire Transfer • REF-W001' },
  { id: '4', label: 'Profit Credited',  amount: '+$2,100',  date: 'Mar 30, 2024', type: 'profit',  icon: 'trending-up',        note: 'Monthly return Q1' },
  { id: '5', label: 'Deposit Received', amount: '+$5,000',  date: 'Mar 28, 2024', type: 'deposit', icon: 'arrow-up-circle',    note: 'Wire Transfer • REF-3847' },
  { id: '6', label: 'Deposit Received', amount: '+$15,000', date: 'Mar 10, 2024', type: 'deposit', icon: 'arrow-up-circle',    note: 'Bank Transfer • REF-3120' },
  { id: '7', label: 'Referral Bonus',   amount: '+$50',     date: 'Mar 5, 2024',  type: 'bonus',   icon: 'gift',               note: 'Referral reward' },
  { id: '8', label: 'Profit Credited',  amount: '+$1,900',  date: 'Feb 28, 2024', type: 'profit',  icon: 'trending-up',        note: 'Monthly return' },
  { id: '9', label: 'Withdrawal',       amount: '-$1,500',  date: 'Feb 20, 2024', type: 'withdraw',icon: 'arrow-down-circle',  note: 'Wire Transfer • REF-W002' },
  { id: '10',label: 'Deposit Received', amount: '+$8,000',  date: 'Feb 12, 2024', type: 'deposit', icon: 'arrow-up-circle',    note: 'Cheque • REF-2891' },
];

const FILTERS: { label: string; icon: IoniconsName }[] = [
  { label: 'All',      icon: 'list' },
  { label: 'Profit',   icon: 'trending-up' },
  { label: 'Deposit',  icon: 'arrow-up-circle' },
  { label: 'Withdraw', icon: 'arrow-down-circle' },
];

const BG: Record<string, string> = {
  profit: colors.successLight, deposit: '#EEF2FF',
  withdraw: colors.errorLight, bonus: '#F5F0FF',
};

const ICON_COLOR: Record<string, string> = {
  profit: colors.success, deposit: colors.primary,
  withdraw: colors.error, bonus: '#9C6FDE',
};

export const AllActivityScreen: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <AllActivityScreenSkeleton />; }

  const filtered = filter === 'All'
    ? ALL_ACTIVITY
    : ALL_ACTIVITY.filter(a => a.type === filter.toLowerCase());

  const totalIn = ALL_ACTIVITY
    .filter(a => a.type !== 'withdraw')
    .reduce((s, a) => s + parseFloat(a.amount.replace(/[^0-9.]/g, '')), 0);
  const totalOut = ALL_ACTIVITY
    .filter(a => a.type === 'withdraw')
    .reduce((s, a) => s + parseFloat(a.amount.replace(/[^0-9.]/g, '')), 0);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="All Activity" subtitle={`${ALL_ACTIVITY.length} transactions`} />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>${totalIn.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Total In</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: colors.error }]}>${totalOut.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>Total Out</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{ALL_ACTIVITY.length}</Text>
          <Text style={styles.summaryLabel}>Transactions</Text>
        </View>
      </View>

      {/* Filter Row */}
      <View style={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.label}
            style={[styles.filterBtn, filter === f.label && styles.filterBtnActive]}
            onPress={() => setFilter(f.label)}>
            <Ionicons
              name={f.icon}
              size={13}
              color={filter === f.label ? '#fff' : colors.text.secondary}
            />
            <Text style={[styles.filterText, filter === f.label && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={a => a.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={[styles.iconBox, { backgroundColor: BG[item.type] ?? colors.divider }]}>
              <Ionicons name={item.icon} size={20} color={ICON_COLOR[item.type] ?? colors.primary} />
            </View>
            <View style={styles.info}>
              <Text style={styles.itemLabel}>{item.label}</Text>
              <Text style={styles.itemNote}>{item.note}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <Text style={[styles.amount, { color: item.type === 'withdraw' ? colors.error : colors.success }]}>
              {item.amount}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  summary: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryVal: { fontSize: fontSizes.base, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.55)', marginTop: 2, fontWeight: '500' },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },
  filterRow: {
    flexDirection: 'row', backgroundColor: colors.surface,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.divider,
  },
  filterBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: spacing.xs, borderRadius: 10, backgroundColor: colors.divider,
  },
  filterBtnActive: { backgroundColor: colors.primary },
  filterText: { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '700' },
  filterTextActive: { color: '#fff' },
  list: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 16,
    padding: spacing.md, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
    gap: spacing.md,
  },
  iconBox: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  itemLabel: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary },
  itemNote: { fontSize: fontSizes.xs, color: colors.text.secondary, marginTop: 1 },
  itemDate: { fontSize: fontSizes.xs, color: colors.text.tertiary, marginTop: 2 },
  amount: { fontSize: fontSizes.base, fontWeight: '800' },
});
