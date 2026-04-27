import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSizes, spacing } from '../../theme';

type Status = 'pending' | 'approved' | 'rejected' | 'processing' | 'registered' | 'earned';

const STATUS_MAP: Record<Status, { bg: string; text: string; label: string }> = {
  pending: { bg: '#FFF8E1', text: colors.warning, label: 'Pending' },
  approved: { bg: '#E8F5E9', text: colors.success, label: 'Approved' },
  rejected: { bg: '#FEECEC', text: colors.error, label: 'Rejected' },
  processing: { bg: '#E3F2FD', text: colors.info, label: 'Processing' },
  registered: { bg: '#E3F2FD', text: colors.info, label: 'Registered' },
  earned: { bg: '#E8F5E9', text: colors.success, label: 'Earned' },
};

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.pending;
  return (
    <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
      <Text style={[styles.text, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  text: { fontSize: fontSizes.xs, fontWeight: '600' },
});
