import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Header } from '../../components/common/Header';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Skeleton } from '../../components/common/Skeleton';
import { ReceiptDownloadButton } from '../../components/common/ReceiptDownloadButton';
import { EmptyState } from '../../components/common/EmptyState';
import { colors, fontSizes, spacing } from '../../theme';

const DepositsScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    {/* Summary banner */}
    <View style={[styles.summaryBanner]}>
      {[0, 1, 2].map(i => (
        <React.Fragment key={i}>
          <View style={styles.summaryItem}>
            <Skeleton width={50} height={16} borderRadius={5} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
            <Skeleton width={70} height={10} borderRadius={4} style={{ backgroundColor: 'rgba(255,255,255,0.18)', marginTop: 4 }} />
          </View>
          {i < 2 && <View style={styles.summaryDivider} />}
        </React.Fragment>
      ))}
    </View>
    <View style={styles.content}>
      <View style={styles.pageHeaderRow}>
        <Skeleton width={120} height={20} borderRadius={6} />
      </View>
      {/* Search bar */}
      <View style={styles.searchBox}>
        <Skeleton width={16} height={16} borderRadius={8} />
        <Skeleton width="80%" height={14} borderRadius={5} />
      </View>
      {/* List items */}
      {[0, 1, 2, 3, 4].map(i => (
        <View key={i} style={[styles.item, { marginHorizontal: spacing.base }]}>
          <View style={styles.itemLeft}>
            <Skeleton width={44} height={44} borderRadius={13} />
            <View style={{ flex: 1, gap: 5 }}>
              <Skeleton width={100} height={13} borderRadius={5} />
              <Skeleton width={80} height={10} borderRadius={4} />
              <Skeleton width={60} height={9} borderRadius={4} />
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <Skeleton width={70} height={15} borderRadius={5} />
            <Skeleton width={60} height={20} borderRadius={10} />
            <Skeleton width={55} height={18} borderRadius={8} />
          </View>
        </View>
      ))}
    </View>
  </SafeAreaView>
);
import { formatCurrency, formatDate } from '../../utils/format';
import type { Deposit } from '../../types';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];


const DEPOSITS: Deposit[] = [
  { id: 'DEP-001', date: '2024-04-14', amount: 10000, method: 'Bank Transfer', reference: 'REF-4521', status: 'approved' },
  { id: 'DEP-002', date: '2024-03-28', amount: 5000,  method: 'Wire Transfer', reference: 'REF-3847', status: 'approved' },
  { id: 'DEP-003', date: '2024-03-10', amount: 15000, method: 'Bank Transfer', reference: 'REF-3120', status: 'approved' },
  { id: 'DEP-004', date: '2024-02-25', amount: 8000,  method: 'Cheque',        reference: 'REF-2891', status: 'pending' },
  { id: 'DEP-005', date: '2024-02-12', amount: 12000, method: 'Bank Transfer', reference: 'REF-2654', status: 'approved' },
  { id: 'DEP-006', date: '2024-01-30', amount: 3000,  method: 'Wire Transfer', reference: 'REF-1988', status: 'rejected' },
];

const METHOD_ICONS: Record<string, IoniconsName> = {
  'Bank Transfer': 'business',
  'Wire Transfer': 'flash',
  'Cheque':        'document-text',
};

export const DepositsScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <DepositsScreenSkeleton />; }

  const filtered = DEPOSITS.filter(d =>
    d.id.toLowerCase().includes(search.toLowerCase()) ||
    d.method.toLowerCase().includes(search.toLowerCase()) ||
    d.reference.toLowerCase().includes(search.toLowerCase()) ||
    d.amount.toString().includes(search),
  );

  const totalApproved = DEPOSITS.filter(d => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const renderItem = ({ item }: { item: Deposit }) => {
    const iconName: IoniconsName = METHOD_ICONS[item.method] ?? 'card';
    const iconBg = item.status === 'rejected'
      ? colors.errorLight
      : item.status === 'pending'
        ? '#FFF8E8'
        : colors.divider;
    const iconColor = item.status === 'rejected'
      ? colors.error
      : item.status === 'pending'
        ? '#D4901A'
        : colors.primary;

    return (
      <View style={styles.item}>
        <View style={styles.itemLeft}>
          <View style={[styles.methodIcon, { backgroundColor: iconBg }]}>
            <Ionicons name={iconName} size={20} color={iconColor} />
          </View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemId}>{item.id}</Text>
            <Text style={styles.itemMethod}>{item.method}</Text>
            <Text style={styles.itemDate}>{formatDate(item.date)}</Text>
          </View>
        </View>
        <View style={styles.itemRight}>
          <Text style={[styles.itemAmount, {
            color: item.status === 'rejected' ? colors.text.tertiary : colors.primary,
          }]}>
            {formatCurrency(item.amount)}
          </Text>
          <StatusBadge status={item.status} />
          <ReceiptDownloadButton receipt={{
            id: item.id,
            reference: item.reference,
            date: formatDate(item.date),
            method: item.method,
            amount: formatCurrency(item.amount),
            status: item.status,
          }} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <Header username="John Doe" />

      <View style={styles.summaryBanner}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{DEPOSITS.length}</Text>
          <Text style={styles.summaryLabel}>Total Deposits</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryVal}>{formatCurrency(totalApproved)}</Text>
          <Text style={styles.summaryLabel}>Total Approved</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryVal, { color: colors.warning }]}>
            {DEPOSITS.filter(d => d.status === 'pending').length}
          </Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.pageHeaderRow}>
          <Text style={styles.pageTitle}>Deposits</Text>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={16} color={colors.text.tertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID, method, reference..."
            placeholderTextColor={colors.text.tertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={i => i.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState icon="file-tray-outline" message="No deposits match your search." />
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  summaryBanner: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryVal: { fontSize: fontSizes.base, fontWeight: '800', color: '#fff' },
  summaryLabel: { fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.55)', marginTop: 2, fontWeight: '500' },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.15)' },

  content: { flex: 1, paddingTop: spacing.base },
  pageHeaderRow: { paddingHorizontal: spacing.base, marginBottom: spacing.sm },
  pageTitle: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text.primary, letterSpacing: -0.3 },

  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 14,
    marginHorizontal: spacing.base, marginBottom: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: fontSizes.sm, color: colors.text.primary },

  list: { paddingHorizontal: spacing.base, paddingBottom: spacing['3xl'] },
  item: {
    backgroundColor: colors.surface, borderRadius: 16,
    padding: spacing.md, marginBottom: spacing.sm,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  methodIcon: {
    width: 44, height: 44, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  itemInfo: { flex: 1 },
  itemId: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary },
  itemMethod: { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '500', marginTop: 1 },
  itemDate: { fontSize: fontSizes.xs, color: colors.text.tertiary, marginTop: 1 },
  itemRight: { alignItems: 'flex-end', gap: 5 },
  itemAmount: { fontSize: fontSizes.base, fontWeight: '800', letterSpacing: -0.3 },
  downloadBtn: {
    backgroundColor: colors.divider, paddingHorizontal: spacing.sm,
    paddingVertical: 3, borderRadius: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  downloadText: { fontSize: fontSizes.xs, color: colors.primaryLight, fontWeight: '700' },
});
