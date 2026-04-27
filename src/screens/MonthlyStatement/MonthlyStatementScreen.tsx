import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { colors, fontSizes, spacing } from '../../theme';
import Ionicons from '@react-native-vector-icons/ionicons';

const MonthlyStatementScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.screenHeader}>
      <View style={{ gap: 5 }}>
        <Skeleton width={160} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={130} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
    </View>
    {/* Filter section */}
    <View style={styles.filterSection}>
      <Skeleton width={40} height={10} borderRadius={4} style={{ marginBottom: spacing.sm }} />
      <View style={[styles.filterRow]}>
        {[0, 1, 2].map(i => (
          <Skeleton key={i} width={60} height={28} borderRadius={20} />
        ))}
      </View>
      <Skeleton width={50} height={10} borderRadius={4} style={{ marginBottom: spacing.sm }} />
      <View style={[styles.monthsGrid]}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} width="22%" height={28} borderRadius={8} />
        ))}
      </View>
    </View>
    {/* List items */}
    <View style={{ padding: spacing.base, gap: spacing.sm }}>
      {[0, 1, 2, 3, 4].map(i => (
        <View key={i} style={[styles.item]}>
          <Skeleton width={44} height={44} borderRadius={10} />
          <View style={{ flex: 1, gap: 5, marginLeft: spacing.md }}>
            <Skeleton width={120} height={13} borderRadius={5} />
            <Skeleton width={90} height={10} borderRadius={4} />
            <Skeleton width={150} height={9} borderRadius={4} />
          </View>
          <Skeleton width={36} height={36} borderRadius={8} />
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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = ['2024', '2023', '2022'];

type Statement = { id: string; year: string; month: string; label: string; fileName: string };

const STATEMENTS: Statement[] = [
  { id: 'STMT-2024-04', year: '2024', month: 'Apr', label: 'April 2024',     fileName: 'Statement_April_2024.pdf' },
  { id: 'STMT-2024-03', year: '2024', month: 'Mar', label: 'March 2024',     fileName: 'Statement_March_2024.pdf' },
  { id: 'STMT-2024-02', year: '2024', month: 'Feb', label: 'February 2024',  fileName: 'Statement_Feb_2024.pdf' },
  { id: 'STMT-2024-01', year: '2024', month: 'Jan', label: 'January 2024',   fileName: 'Statement_Jan_2024.pdf' },
  { id: 'STMT-2023-12', year: '2023', month: 'Dec', label: 'December 2023',  fileName: 'Statement_Dec_2023.pdf' },
  { id: 'STMT-2023-11', year: '2023', month: 'Nov', label: 'November 2023',  fileName: 'Statement_Nov_2023.pdf' },
  { id: 'STMT-2023-10', year: '2023', month: 'Oct', label: 'October 2023',   fileName: 'Statement_Oct_2023.pdf' },
  { id: 'STMT-2023-09', year: '2023', month: 'Sep', label: 'September 2023', fileName: 'Statement_Sep_2023.pdf' },
  { id: 'STMT-2022-12', year: '2022', month: 'Dec', label: 'December 2022',  fileName: 'Statement_Dec_2022.pdf' },
  { id: 'STMT-2022-06', year: '2022', month: 'Jun', label: 'June 2022',      fileName: 'Statement_Jun_2022.pdf' },
  { id: 'STMT-2022-03', year: '2022', month: 'Mar', label: 'March 2022',     fileName: 'Statement_Mar_2022.pdf' },
];

export const MonthlyStatementScreen: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Apr');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <MonthlyStatementScreenSkeleton />; }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Monthly Statement" subtitle="Download your reports" />

      {/* Year Filter */}
      <View style={styles.filterSection}>
        <Text style={styles.filterLabel}>Year</Text>
        <View style={styles.filterRow}>
          {YEARS.map(yr => (
            <TouchableOpacity
              key={yr}
              style={[styles.filterChip, selectedYear === yr && styles.filterChipActive]}
              onPress={() => setSelectedYear(yr)}>
              <Text style={[styles.filterChipText, selectedYear === yr && styles.filterChipTextActive]}>{yr}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.filterLabel}>Month</Text>
        <View style={styles.monthsGrid}>
          {MONTHS.map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.monthChip, selectedMonth === m && styles.monthChipActive]}
              onPress={() => setSelectedMonth(m)}>
              <Text style={[styles.monthChipText, selectedMonth === m && styles.monthChipTextActive]}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={STATEMENTS.filter(s => s.year === selectedYear && s.month === selectedMonth)}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemIcon}>
              <Ionicons name="document-text-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemId}>{item.id}</Text>
              <Text style={styles.itemDate}>{item.label}</Text>
              <Text style={styles.itemFile}>{item.fileName}</Text>
            </View>
            <TouchableOpacity style={styles.downloadBtn}>
              <Ionicons name="cloud-download-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="document-outline"
            title="No Statement Found"
            message={`No statement available for ${selectedMonth} ${selectedYear}`}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  filterSection: { backgroundColor: colors.surface, padding: spacing.base, borderBottomWidth: 1, borderBottomColor: colors.divider },
  filterLabel: { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  filterRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.base },
  filterChip: { paddingHorizontal: spacing.base, paddingVertical: spacing.xs, borderRadius: 20, backgroundColor: colors.divider },
  filterChipActive: { backgroundColor: colors.primary },
  filterChipText: { fontSize: fontSizes.sm, color: colors.text.secondary, fontWeight: '600' },
  filterChipTextActive: { color: '#fff' },
  monthsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.xs },
  monthChip: { width: '22%', alignItems: 'center', paddingVertical: spacing.xs, borderRadius: 8, backgroundColor: colors.divider },
  monthChipActive: { backgroundColor: colors.accent },
  monthChipText: { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '600' },
  monthChipTextActive: { color: '#fff' },
  list: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  item: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  itemIcon: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  itemInfo: { flex: 1 },
  itemId: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary },
  itemDate: { fontSize: fontSizes.xs, color: colors.text.secondary, marginTop: 2 },
  itemFile: { fontSize: fontSizes.xs, color: colors.text.disabled, marginTop: 2 },
  downloadBtn: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center',
  },
});
