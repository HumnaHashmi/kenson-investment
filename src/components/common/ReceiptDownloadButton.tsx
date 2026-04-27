import React, { useState } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, Share, Modal,
  View, ScrollView, Pressable,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, fontSizes, spacing } from '../../theme';

export type ReceiptData = {
  id: string;
  reference: string;
  date: string;
  method: string;
  amount: string;
  status: 'approved' | 'pending' | 'rejected' | string;
};

type Props = {
  receipt: ReceiptData;
  companyName?: string;
  supportEmail?: string;
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  approved: { bg: '#d1fae5', text: '#065f46' },
  pending:  { bg: '#fef9c3', text: '#854d0e' },
  rejected: { bg: '#fee2e2', text: '#991b1b' },
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={rowStyles.row}>
    <Text style={rowStyles.label}>{label}</Text>
    <Text style={rowStyles.value}>{value}</Text>
  </View>
);

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label: { fontSize: fontSizes.sm, color: colors.text.secondary },
  value: { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text.primary, flexShrink: 1, textAlign: 'right', marginLeft: spacing.md },
});

export const ReceiptDownloadButton: React.FC<Props> = ({
  receipt,
  companyName = 'Kenson Investment',
  supportEmail = 'support@kensoninvestment.com',
}) => {
  const [visible, setVisible] = useState(false);
  const statusStyle = STATUS_COLORS[receipt.status] ?? STATUS_COLORS.pending;

  const handleShare = async () => {
    const text = [
      `===== ${companyName} =====`,
      `Deposit Receipt`,
      ``,
      `Receipt No. : ${receipt.id}`,
      `Reference   : ${receipt.reference}`,
      `Date        : ${receipt.date}`,
      `Method      : ${receipt.method}`,
      `Status      : ${receipt.status.toUpperCase()}`,
      `Amount      : ${receipt.amount}`,
      ``,
      `For queries contact ${supportEmail}`,
    ].join('\n');

    await Share.share({ message: text, title: `Receipt ${receipt.id}` });
  };

  return (
    <>
      <TouchableOpacity style={styles.btn} onPress={() => setVisible(true)}>
        <Ionicons name="receipt-outline" size={12} color={colors.primaryLight} />
        <Text style={styles.btnText}>Receipt</Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)} />
        <View style={styles.sheet}>
          {/* Sheet header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Deposit Receipt</Text>
            <TouchableOpacity onPress={() => setVisible(false)} hitSlop={8}>
              <Ionicons name="close" size={22} color={colors.text.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {/* Company */}
            <View style={styles.logoRow}>
              <View style={styles.logoIcon}>
                <Ionicons name="business" size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.companyName}>{companyName}</Text>
                <Text style={styles.companyLabel}>Official Deposit Receipt</Text>
              </View>
            </View>

            {/* Amount hero */}
            <View style={styles.amountBox}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amount}>{receipt.amount}</Text>
              <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                <Text style={[styles.badgeText, { color: statusStyle.text }]}>
                  {receipt.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Details */}
            <View style={styles.detailsCard}>
              <Row label="Receipt No." value={receipt.id} />
              <Row label="Reference"   value={receipt.reference} />
              <Row label="Date"        value={receipt.date} />
              <Row label="Method"      value={receipt.method} />
            </View>

            <Text style={styles.footer}>
              For queries contact {supportEmail}
            </Text>

            {/* Share button */}
            <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={18} color="#fff" />
              <Text style={styles.shareBtnText}>Share Receipt</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: colors.divider,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  btnText: { fontSize: fontSizes.xs, color: colors.primaryLight, fontWeight: '700' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sheetTitle: { fontSize: fontSizes.base, fontWeight: '800', color: colors.text.primary },
  body: { padding: spacing.base, paddingBottom: spacing['3xl'] },

  logoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  logoIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  companyName: { fontSize: fontSizes.base, fontWeight: '800', color: colors.text.primary },
  companyLabel: { fontSize: fontSizes.xs, color: colors.text.secondary, marginTop: 1 },

  amountBox: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: spacing.xl,
    marginBottom: spacing.base,
  },
  amountLabel: { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  amount: { fontSize: 32, fontWeight: '800', color: colors.primary, marginTop: 4, letterSpacing: -1 },
  badge: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: fontSizes.xs, fontWeight: '700' },

  detailsCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.base,
  },

  footer: {
    fontSize: fontSizes.xs,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  shareBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  shareBtnText: { color: '#fff', fontWeight: '800', fontSize: fontSizes.base },
});
