import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Share, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Skeleton } from '../../components/common/Skeleton';
import { EmptyState } from '../../components/common/EmptyState';
import { colors, fontSizes, spacing } from '../../theme';
import Ionicons from '@react-native-vector-icons/ionicons';
import { generatePDF } from 'react-native-html-to-pdf';

const MonthlyStatementScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.screenHeader}>
      <View style={{ gap: 5 }}>
        <Skeleton width={160} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={130} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
    </View>
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

const buildPdfHtml = (s: Statement) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Helvetica, Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 48px; }
    .header { display: flex; align-items: center; border-bottom: 3px solid #1a3c8f; padding-bottom: 20px; margin-bottom: 32px; }
    .logo-circle { width: 48px; height: 48px; background: #1a3c8f; border-radius: 12px; margin-right: 16px; flex-shrink: 0; }
    .company-name { font-size: 22px; font-weight: 800; color: #1a3c8f; }
    .company-sub { font-size: 12px; color: #666; margin-top: 3px; }
    .badge { display: inline-block; background: #1a3c8f; color: #fff; font-size: 11px; font-weight: 700; border-radius: 6px; padding: 4px 12px; margin-bottom: 12px; letter-spacing: 1px; }
    h1 { font-size: 20px; font-weight: 800; color: #1a1a2e; margin-bottom: 28px; }
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
    <div class="logo-circle"></div>
    <div>
      <div class="company-name">Kenson Investment</div>
      <div class="company-sub">Official Monthly Statement</div>
    </div>
  </div>

  <div class="badge">STATEMENT</div>
  <h1>${s.label} Account Statement</h1>

  <div class="card">
    <div class="row"><span class="lbl">Statement ID</span><span class="val">${s.id}</span></div>
    <div class="row"><span class="lbl">Period</span><span class="val">${s.label}</span></div>
    <div class="row"><span class="lbl">Year</span><span class="val">${s.year}</span></div>
    <div class="row"><span class="lbl">Month</span><span class="val">${s.month}</span></div>
    <div class="row"><span class="lbl">File Name</span><span class="val">${s.fileName}</span></div>
    <div class="row"><span class="lbl">Generated On</span><span class="val">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
  </div>

  <div class="footer">
    This is an official statement from Kenson Investment.<br/>
    For queries contact <strong>support@kensoninvestment.com</strong>
  </div>
</body>
</html>
`;

export const MonthlyStatementScreen: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('Apr');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleDownload = async (item: Statement) => {
    if (downloadingId) { return; }
    setDownloadingId(item.id);
    try {
      const result = await generatePDF({
        html: buildPdfHtml(item),
        fileName: item.fileName.replace('.pdf', ''),
        directory: 'Documents',
      });

      if (result.filePath) {
        await Share.share({
          url: `file://${result.filePath}`,
          title: item.fileName,
          message: `${item.label} Statement – Kenson Investment`,
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) { return <MonthlyStatementScreenSkeleton />; }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Monthly Statement" subtitle="Download your reports" />

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

      <FlatList
        data={STATEMENTS.filter(s => s.year === selectedYear && s.month === selectedMonth)}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isDownloading = downloadingId === item.id;
          return (
            <View style={styles.item}>
              <View style={styles.itemIcon}>
                <Ionicons name="document-text-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemId}>{item.id}</Text>
                <Text style={styles.itemDate}>{item.label}</Text>
                <Text style={styles.itemFile}>{item.fileName}</Text>
              </View>
              <TouchableOpacity
                style={[styles.downloadBtn, isDownloading && styles.downloadBtnBusy]}
                onPress={() => handleDownload(item)}
                disabled={!!downloadingId}>
                {isDownloading
                  ? <ActivityIndicator color="#fff" size="small" />
                  : <Ionicons name="cloud-download-outline" size={20} color="#fff" />}
              </TouchableOpacity>
            </View>
          );
        }}
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
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  downloadBtnBusy: { opacity: 0.6 },
});
