import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';

const NotificationsScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.screenHeader}>
      <View style={{ gap: 5 }}>
        <Skeleton width={130} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={80} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
    </View>
    <View style={styles.list}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <View key={i} style={[styles.item, { gap: spacing.md }]}>
          <Skeleton width={44} height={44} borderRadius={13} />
          <View style={{ flex: 1, gap: 6 }}>
            <Skeleton width="70%" height={13} borderRadius={5} />
            <Skeleton width="90%" height={10} borderRadius={4} />
            <Skeleton width="50%" height={10} borderRadius={4} />
            <Skeleton width={60} height={9} borderRadius={4} />
          </View>
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

const NOTIFICATIONS: {
  id: string; type: string; icon: IoniconsName;
  title: string; body: string; time: string; unread: boolean;
}[] = [
  { id: '1', type: 'profit',   icon: 'trending-up',       title: 'Profit Credited',         body: '$2,500 profit has been credited to your account.',          time: '2 hours ago',  unread: true },
  { id: '2', type: 'deposit',  icon: 'arrow-up-circle',   title: 'Deposit Confirmed',        body: 'Your deposit of $10,000 has been approved.',                time: '1 day ago',    unread: true },
  { id: '3', type: 'withdraw', icon: 'arrow-down-circle', title: 'Withdrawal Processed',     body: 'Your withdrawal request of $3,000 is being processed.',     time: '2 days ago',   unread: true },
  { id: '4', type: 'info',     icon: 'document-text',     title: 'Monthly Statement Ready',  body: 'Your April 2024 statement is available to download.',       time: '3 days ago',   unread: false },
  { id: '5', type: 'info',     icon: 'gift',              title: 'Referral Bonus',           body: 'You earned $50 referral bonus from your invite.',            time: '5 days ago',   unread: false },
  { id: '6', type: 'info',     icon: 'notifications',     title: 'Account Update',           body: 'Your profile information has been updated successfully.',   time: '1 week ago',   unread: false },
];

const TYPE_BG: Record<string, string> = {
  profit: colors.successLight,
  deposit: '#EEF2FF',
  withdraw: colors.errorLight,
  info: colors.divider,
};

const TYPE_COLOR: Record<string, string> = {
  profit: colors.success,
  deposit: colors.primary,
  withdraw: colors.error,
  info: colors.text.secondary,
};

export const NotificationsScreen: React.FC = () => {
  const [items, setItems] = useState(NOTIFICATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <NotificationsScreenSkeleton />; }

  const unreadCount = items.filter(n => n.unread).length;
  const markAllRead = () => setItems(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
        rightElement={
          unreadCount > 0 ? (
            <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
              <Ionicons name="checkmark-done" size={16} color={colors.accentLight} />
              <Text style={styles.markAll}>All</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <FlatList
        data={items}
        keyExtractor={n => n.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, item.unread && styles.itemUnread]}
            activeOpacity={0.7}
            onPress={() => setItems(prev =>
              prev.map(n => n.id === item.id ? { ...n, unread: false } : n),
            )}>
            <View style={[styles.iconBox, { backgroundColor: TYPE_BG[item.type] ?? colors.divider }]}>
              <Ionicons name={item.icon} size={20} color={TYPE_COLOR[item.type] ?? colors.primary} />
            </View>
            <View style={styles.info}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.title}</Text>
                {item.unread && <View style={styles.dot} />}
              </View>
              <Text style={styles.body} numberOfLines={2}>{item.body}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState icon="notifications-off-outline" title="No Notifications" message="You're all caught up! Nothing to show here." />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  markAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  markAll: { fontSize: fontSizes.xs, color: colors.accentLight, fontWeight: '800' },
  list: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  item: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: colors.surface, borderRadius: 16,
    padding: spacing.md, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
    gap: spacing.md,
    borderWidth: 1, borderColor: 'transparent',
  },
  itemUnread: {
    backgroundColor: '#F0F4FF',
    borderWidth: 1, borderColor: colors.primary + '20',
  },
  iconBox: {
    width: 44, height: 44, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  title: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  body: { fontSize: fontSizes.xs, color: colors.text.secondary, lineHeight: 17 },
  time: { fontSize: fontSizes.xs, color: colors.text.tertiary, marginTop: 5, fontWeight: '500' },
});
