import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';
import { formatCurrency, formatDate } from '../../utils/format';
import { validateWithdrawAmount } from '../../utils/validation';
import type { WithdrawRequest } from '../../types';

const WITHDRAWALS: WithdrawRequest[] = [
  { id: 'W-001', srNo: 1, amount: 3000, date: '2024-04-08', method: 'Bank Transfer', reference: 'REF-W001', status: 'approved', platformCharges: 30, fee: 15, additionalCharges: 0 },
  { id: 'W-002', srNo: 2, amount: 1500, date: '2024-03-20', method: 'Wire Transfer', reference: 'REF-W002', status: 'pending', platformCharges: 15, fee: 10, additionalCharges: 5 },
  { id: 'W-003', srNo: 3, amount: 5000, date: '2024-02-14', method: 'Bank Transfer', reference: 'REF-W003', status: 'approved', platformCharges: 50, fee: 25, additionalCharges: 0 },
  { id: 'W-004', srNo: 4, amount: 800, date: '2024-01-28', method: 'Wire Transfer', reference: 'REF-W004', status: 'rejected', platformCharges: 8, fee: 5, additionalCharges: 0 },
];

const TABS = ['Withdraw List', 'My Requests', 'New Request'];

const WithdrawScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.screenHeader}>
      <View style={{ gap: 5 }}>
        <Skeleton width={100} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={180} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
    </View>
    {/* Tabs */}
    <View style={styles.tabs}>
      {[0, 1, 2].map(i => (
        <View key={i} style={[styles.tab, { alignItems: 'center', justifyContent: 'center' }]}>
          <Skeleton width={70} height={11} borderRadius={4} />
        </View>
      ))}
    </View>
    {/* Search bar */}
    <View style={styles.searchContainer}>
      <Skeleton width={16} height={16} borderRadius={8} />
      <Skeleton width="75%" height={13} borderRadius={4} />
    </View>
    {/* List cards */}
    <View style={{ paddingHorizontal: spacing.base, paddingTop: spacing.xs }}>
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={[styles.card, { marginBottom: spacing.sm }]}>
          <View style={[styles.cardRow, { marginBottom: spacing.xs }]}>
            <View style={{ gap: 5 }}>
              <Skeleton width={70} height={13} borderRadius={4} />
              <Skeleton width={80} height={10} borderRadius={4} />
            </View>
            <Skeleton width={80} height={18} borderRadius={5} />
          </View>
          <View style={styles.cardRow}>
            <Skeleton width={110} height={10} borderRadius={4} />
            <Skeleton width={60} height={22} borderRadius={10} />
          </View>
          <View style={[styles.chargesRow, { marginTop: spacing.xs }]}>
            <Skeleton width={90} height={9} borderRadius={4} />
            <Skeleton width={70} height={9} borderRadius={4} />
          </View>
          <Skeleton width={120} height={9} borderRadius={4} style={{ marginTop: spacing.xs }} />
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

export const WithdrawScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newRemarks, setNewRemarks] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <WithdrawScreenSkeleton />; }

  const AVAILABLE_BALANCE = 12750;

  const filteredList = WITHDRAWALS.filter(w => {
    const q = search.toLowerCase();
    return (
      w.id.toLowerCase().includes(q) ||
      w.method.toLowerCase().includes(q) ||
      (w.reference ?? '').toLowerCase().includes(q) ||
      w.status.toLowerCase().includes(q) ||
      String(w.amount).includes(q)
    );
  });

  const handleSubmit = () => {
    const error = validateWithdrawAmount(newAmount, AVAILABLE_BALANCE);
    if (error) { setAmountError(error); return; }
    setAmountError('');
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setNewAmount(''); setNewRemarks(''); }, 2500);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Withdraw" subtitle="Manage your withdrawals" />

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((t, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.tab, activeTab === i && styles.tabActive]}
            onPress={() => { setActiveTab(i); setSearch(''); }}>
            <Text style={[styles.tabText, activeTab === i && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Bar — only on list tabs */}
      {activeTab < 2 && (
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={16} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID, method, status, amount…"
            placeholderTextColor={colors.text.disabled}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <Ionicons name="close-circle" size={16} color={colors.text.disabled} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Withdraw List */}
      {activeTab === 0 && (
        <FlatList
          data={filteredList}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState icon="file-tray-outline" message="No withdrawal records match your search." />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View>
                  <Text style={styles.cardId}>{item.id}</Text>
                  <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
                </View>
                <Text style={styles.cardAmount}>{formatCurrency(item.amount)}</Text>
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.meta}>Method: <Text style={styles.metaVal}>{item.method}</Text></Text>
                <StatusBadge status={item.status} />
              </View>
              <View style={styles.chargesRow}>
                <Text style={styles.charge}>Platform: {formatCurrency(item.platformCharges)}</Text>
                <Text style={styles.charge}>Fee: {formatCurrency(item.fee)}</Text>
                {item.additionalCharges > 0 && (
                  <Text style={styles.charge}>Additional: {formatCurrency(item.additionalCharges)}</Text>
                )}
              </View>
              <Text style={styles.ref}>Ref: {item.reference}</Text>
            </View>
          )}
        />
      )}

      {/* My Requests */}
      {activeTab === 1 && (
        <FlatList
          data={filteredList}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState icon="file-tray-outline" message="No withdrawal records match your search." />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <Text style={styles.cardId}>SR #{item.srNo}</Text>
                <StatusBadge status={item.status} />
              </View>
              <View style={styles.cardRow}>
                <Text style={styles.cardDate}>{formatDate(item.date)}</Text>
                <Text style={styles.cardAmount}>{formatCurrency(item.amount)}</Text>
              </View>
            </View>
          )}
        />
      )}

      {/* New Request */}
      {activeTab === 2 && (
        <ScrollView contentContainerStyle={styles.formContent}>
          {submitted ? (
            <View style={styles.successBox}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={64} color="#22c55e" />
              </View>
              <Text style={styles.successText}>Withdrawal request submitted successfully!</Text>
            </View>
          ) : (
            <>
              <Text style={styles.formTitle}>New Withdrawal Request</Text>
              <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <Text style={styles.balanceValue}>{formatCurrency(12750)}</Text>
              </View>
              <Input
                label="Amount"
                value={newAmount}
                onChangeText={val => {
                  const integers = val.replace(/[^0-9]/g, '');
                  setNewAmount(integers);
                  setAmountError(validateWithdrawAmount(integers, AVAILABLE_BALANCE));
                }}
                keyboardType="numeric"
                placeholder="Enter withdrawal amount"
                error={amountError}
              />
              <Input
                label="Remarks (Optional)"
                value={newRemarks}
                onChangeText={setNewRemarks}
                placeholder="Add a note..."
                multiline
                numberOfLines={3}
              />
              <Button title="Submit Request" onPress={handleSubmit} />
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, paddingTop: spacing.sm },
  tab: {
    flex: 1, paddingVertical: spacing.sm, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '600' },
  tabTextActive: { color: colors.primary },

  searchContainer: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base, marginVertical: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: 12, borderWidth: 1.5, borderColor: colors.border,
  },
  searchInput: {
    flex: 1, fontSize: fontSizes.sm, color: colors.text.primary,
    padding: 0,
  },

  list: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  card: {
    backgroundColor: colors.surface, borderRadius: 12, padding: spacing.md,
    marginBottom: spacing.sm, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  cardId: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary },
  cardDate: { fontSize: fontSizes.xs, color: colors.text.secondary },
  cardAmount: { fontSize: fontSizes.lg, fontWeight: '800', color: colors.primary },
  meta: { fontSize: fontSizes.xs, color: colors.text.secondary },
  metaVal: { color: colors.text.primary, fontWeight: '600' },
  chargesRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs, flexWrap: 'wrap' },
  charge: { fontSize: fontSizes.xs, color: colors.text.secondary },
  ref: { fontSize: fontSizes.xs, color: colors.text.disabled, marginTop: spacing.xs },
  formContent: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  formTitle: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text.primary, marginBottom: spacing.base },
  balanceCard: {
    backgroundColor: colors.primary, borderRadius: 12, padding: spacing.base,
    alignItems: 'center', marginBottom: spacing.lg,
  },
  balanceLabel: { fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 },
  balanceValue: { fontSize: fontSizes['2xl'], fontWeight: '800', color: '#fff', marginTop: 4 },
  successBox: { alignItems: 'center', paddingTop: spacing['3xl'] },
  successIcon: { marginBottom: spacing.lg },
  successText: { fontSize: fontSizes.base, color: colors.success, fontWeight: '600', textAlign: 'center' },
});
