import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { StatCard } from '../../components/common/StatCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';

const ReferralScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.screenHeader}>
      <View style={{ gap: 5 }}>
        <Skeleton width={90} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={180} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
      <Skeleton width={90} height={30} borderRadius={20} style={skStyles.skLight} />
    </View>
    <View style={{ padding: spacing.base, gap: spacing.sm }}>
      {/* Stat grid */}
      <View style={skStyles.statsGrid}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={skStyles.statCard}>
            <Skeleton width={24} height={24} borderRadius={6} style={{ marginBottom: 6 }} />
            <Skeleton width="70%" height={16} borderRadius={5} style={{ marginBottom: 4 }} />
            <Skeleton width="50%" height={10} borderRadius={4} />
          </View>
        ))}
      </View>
      {/* Referral code box */}
      <View style={skStyles.codeBox}>
        <Skeleton width={100} height={11} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width={160} height={22} borderRadius={6} style={{ marginBottom: 8 }} />
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Skeleton width={80} height={34} borderRadius={10} />
          <Skeleton width={80} height={34} borderRadius={10} />
        </View>
      </View>
      {/* List items */}
      {[0, 1, 2, 3].map(i => (
        <View key={i} style={skStyles.listItem}>
          <Skeleton width={40} height={40} borderRadius={20} />
          <View style={{ flex: 1, gap: 5 }}>
            <Skeleton width={120} height={13} borderRadius={5} />
            <Skeleton width={90} height={10} borderRadius={4} />
          </View>
          <View style={{ alignItems: 'flex-end', gap: 5 }}>
            <Skeleton width={60} height={20} borderRadius={10} />
            <Skeleton width={40} height={10} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  </SafeAreaView>
);

const skStyles = StyleSheet.create({
  screenHeader: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  },
  skLight: { backgroundColor: 'rgba(255,255,255,0.25)' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statCard: {
    width: '47%', backgroundColor: colors.surface, borderRadius: 16,
    padding: spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  codeBox: {
    backgroundColor: colors.surface, borderRadius: 16, padding: spacing.base,
    alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  listItem: {
    backgroundColor: colors.surface, borderRadius: 16, padding: spacing.md,
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
});
import type { Referral } from '../../types';

const REFERRALS: Referral[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@email.com', status: 'earned',     bonus: 150, date: '2024-03-10' },
  { id: '2', name: 'Bob Smith',     email: 'bob@email.com',   status: 'registered', bonus: 0,   date: '2024-03-22' },
  { id: '3', name: 'Carol White',   email: 'carol@email.com', status: 'earned',     bonus: 150, date: '2024-02-14' },
  { id: '4', name: 'David Brown',   email: 'david@email.com', status: 'registered', bonus: 0,   date: '2024-04-01' },
];

const REFERRAL_CODE = 'KENSON-JD2024';
const REFERRAL_LINK = 'https://kensoninvestment.com/ref/KENSON-JD2024';

export const ReferralScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <ReferralScreenSkeleton />; }

  const handleShare = async () => {
    await Share.share({ message: `Join Kenson Investment with my referral code: ${REFERRAL_CODE}\n${REFERRAL_LINK}` });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader
        title="Referrals"
        subtitle="Invite friends & earn bonuses"
        rightElement={
          <TouchableOpacity style={styles.inviteBtn} onPress={() => setModalVisible(true)}>
            <Text style={styles.inviteBtnText}>Invite Friend</Text>
            <Ionicons name="people" size={14} color="#fff" />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={REFERRALS}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.statsGrid}>
              <StatCard label="Total Referrals"    value="4"    icon="people"        accentColor={colors.primary}      style={styles.halfCard} />
              <StatCard label="Referrals Earned"   value="$300" icon="cash"          accentColor={colors.success}      style={styles.halfCard} />
              <StatCard label="Last Month Refs"    value="2"    icon="calendar"      accentColor={colors.accent}       style={styles.halfCard} />
              <StatCard label="Last Month Bonus"   value="$150" icon="gift"          accentColor={colors.primaryLight}  style={styles.halfCard} />
            </View>
            <Text style={styles.listTitle}>Referral List</Text>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemEmail}>{item.email}</Text>
            </View>
            <View style={styles.itemRight}>
              <StatusBadge status={item.status} />
              {item.bonus > 0 && <Text style={styles.bonus}>+${item.bonus}</Text>}
            </View>
          </View>
        )}
      />

      {/* Referral Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Your Referral Details</Text>
            <Text style={styles.modalSubtitle}>Share your code and earn bonuses!</Text>

            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>Referral Code</Text>
              <Text style={styles.code}>{REFERRAL_CODE}</Text>
            </View>

            <View style={styles.linkBox}>
              <Text style={styles.codeLabel}>Referral Link</Text>
              <Text style={styles.link}>{REFERRAL_LINK}</Text>
            </View>

            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Ionicons name="share-social" size={18} color="#fff" />
              <Text style={styles.shareBtnText}>Share Referral</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  inviteBtn: {
    backgroundColor: colors.accent, paddingHorizontal: spacing.sm,
    paddingVertical: 5, borderRadius: 20,
    flexDirection: 'row', alignItems: 'center', gap: 4,
  },
  inviteBtnText: { color: '#fff', fontWeight: '700', fontSize: fontSizes.xs },
  list: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  halfCard: { width: '47%' },
  listTitle: { fontSize: fontSizes.base, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.md },
  item: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: fontSizes.base },
  itemInfo: { flex: 1 },
  itemName: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary },
  itemEmail: { fontSize: fontSizes.xs, color: colors.text.secondary, marginTop: 2 },
  itemRight: { alignItems: 'flex-end', gap: 4 },
  bonus: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.success },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: spacing['2xl'],
  },
  modalTitle: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text.primary, textAlign: 'center' },
  modalSubtitle: { fontSize: fontSizes.sm, color: colors.text.secondary, textAlign: 'center', marginTop: 4, marginBottom: spacing.xl },
  codeBox: {
    backgroundColor: colors.primary + '10', borderRadius: 12, padding: spacing.base,
    alignItems: 'center', marginBottom: spacing.md, borderWidth: 1, borderColor: colors.primary + '30',
  },
  codeLabel: { fontSize: fontSizes.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 1 },
  code: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.primary, marginTop: 4, letterSpacing: 2 },
  linkBox: {
    backgroundColor: colors.divider, borderRadius: 12, padding: spacing.base,
    alignItems: 'center', marginBottom: spacing.xl,
  },
  link: { fontSize: fontSizes.xs, color: colors.primaryLight, marginTop: 4 },
  shareBtn: {
    backgroundColor: colors.primary, borderRadius: 12, padding: spacing.base,
    alignItems: 'center', marginBottom: spacing.sm,
    flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  shareBtnText: { color: '#fff', fontWeight: '700', fontSize: fontSizes.base },
  closeBtn: { alignItems: 'center', paddingVertical: spacing.md },
  closeBtnText: { color: colors.text.secondary, fontWeight: '600' },
});
