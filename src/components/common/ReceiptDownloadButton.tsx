import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Share, Text, View } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, spacing } from '../../theme';
import { generatePDF } from 'react-native-html-to-pdf';

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

const buildReceiptHtml = (
  r: ReceiptData,
  companyName: string,
  supportEmail: string,
) => {
  const sc = STATUS_COLORS[r.status] ?? STATUS_COLORS.pending;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Helvetica, Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 48px; }
    .header { display: flex; align-items: center; border-bottom: 3px solid #1a3c8f; padding-bottom: 20px; margin-bottom: 32px; }
    .logo { width: 48px; height: 48px; background: #1a3c8f; border-radius: 12px; margin-right: 16px; flex-shrink: 0; }
    .company-name { font-size: 22px; font-weight: 800; color: #1a3c8f; }
    .company-sub { font-size: 12px; color: #666; margin-top: 3px; }
    .amount-box { text-align: center; background: #f5f7ff; border-radius: 16px; padding: 28px 20px; margin-bottom: 28px; }
    .amount-lbl { font-size: 11px; color: #999; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
    .amount { font-size: 36px; font-weight: 800; color: #1a3c8f; letter-spacing: -1px; margin-bottom: 12px; }
    .status-badge { display: inline-block; background: ${sc.bg}; color: ${sc.text}; font-size: 11px; font-weight: 700; border-radius: 20px; padding: 4px 14px; }
    .card { background: #f5f7ff; border-radius: 12px; padding: 0 20px; margin-bottom: 28px; }
    .row { display: flex; justify-content: space-between; align-items: center; padding: 13px 0; border-bottom: 1px solid #dde2f0; }
    .row:last-child { border-bottom: none; }
    .lbl { font-size: 13px; color: #666; }
    .val { font-size: 13px; font-weight: 700; color: #1a1a2e; }
    .footer { font-size: 11px; color: #aaa; text-align: center; margin-top: 48px; border-top: 1px solid #e5e8f0; padding-top: 18px; line-height: 1.7; }
    .footer strong { color: #555; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo"></div>
    <div>
      <div class="company-name">${companyName}</div>
      <div class="company-sub">Official Deposit Receipt</div>
    </div>
  </div>

  <div class="amount-box">
    <div class="amount-lbl">Amount</div>
    <div class="amount">${r.amount}</div>
    <div class="status-badge">${r.status.toUpperCase()}</div>
  </div>

  <div class="card">
    <div class="row"><span class="lbl">Receipt No.</span><span class="val">${r.id}</span></div>
    <div class="row"><span class="lbl">Reference</span><span class="val">${r.reference}</span></div>
    <div class="row"><span class="lbl">Date</span><span class="val">${r.date}</span></div>
    <div class="row"><span class="lbl">Method</span><span class="val">${r.method}</span></div>
    <div class="row"><span class="lbl">Generated On</span><span class="val">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
  </div>

  <div class="footer">
    This is an official receipt from ${companyName}.<br/>
    For queries contact <strong>${supportEmail}</strong>
  </div>
</body>
</html>
`;
};

export const ReceiptDownloadButton: React.FC<Props> = ({
  receipt,
  companyName = 'Kenson Investment',
  supportEmail = 'support@kensoninvestment.com',
}) => {
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    if (busy) { return; }
    setBusy(true);
    try {
      const result = await generatePDF({
        html: buildReceiptHtml(receipt, companyName, supportEmail),
        fileName: `Receipt_${receipt.id}`,
        directory: 'Documents',
      });
      if (result.filePath) {
        await Share.share({
          url: `file://${result.filePath}`,
          title: `Receipt_${receipt.id}.pdf`,
          message: `Deposit Receipt ${receipt.id} – ${companyName}`,
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to generate receipt. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={handleDownload} disabled={busy}>
      {busy ? (
        <ActivityIndicator color={colors.primary} size="small" />
      ) : (
        <View style={styles.inner}>
          <Ionicons name="download-outline" size={14} color={colors.primary} />
          <Text style={styles.label}>Receipt</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.primary + '15',
    borderWidth: 1,
    borderColor: colors.primary + '30',
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});
