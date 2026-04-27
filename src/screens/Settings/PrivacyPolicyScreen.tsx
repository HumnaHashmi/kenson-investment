import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';

const SECTIONS = [
  { title: 'Information We Collect', body: 'We collect information you provide directly to us, including your name, email address, phone number, and financial information necessary to provide our investment services.' },
  { title: 'How We Use Your Information', body: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send notifications, and comply with legal obligations.' },
  { title: 'Data Security', body: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.' },
  { title: 'Data Retention', body: 'We retain your personal information for as long as necessary to provide our services and comply with our legal obligations, resolve disputes, and enforce our policies.' },
  { title: 'Your Rights', body: 'You have the right to access, update, or delete your personal information. You may also opt out of receiving marketing communications from us at any time.' },
];

const PrivacyPolicyScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.screenHeader}>
      <View style={{ gap: 5 }}>
        <Skeleton width={120} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={180} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
    </View>
    <ScrollView contentContainerStyle={[styles.scroll, { gap: 0 }]} showsVerticalScrollIndicator={false}>
      {[0, 1, 2, 3, 4].map(i => (
        <View key={i} style={{ marginBottom: spacing.xl }}>
          <Skeleton width={180} height={14} borderRadius={5} style={{ marginBottom: spacing.sm }} />
          <Skeleton width="100%" height={10} borderRadius={4} style={{ marginBottom: 6 }} />
          <Skeleton width="90%" height={10} borderRadius={4} style={{ marginBottom: 6 }} />
          <Skeleton width="80%" height={10} borderRadius={4} />
        </View>
      ))}
    </ScrollView>
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

export const PrivacyPolicyScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <PrivacyPolicyScreenSkeleton />; }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Privacy Policy" subtitle="Last updated: April 1, 2024" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((s, i) => (
          <React.Fragment key={i}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, paddingBottom: spacing['3xl'] },
  sectionTitle: { fontSize: fontSizes.base, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.sm },
  sectionBody: { fontSize: fontSizes.sm, color: colors.text.secondary, lineHeight: 22, marginBottom: spacing.xl },
});
