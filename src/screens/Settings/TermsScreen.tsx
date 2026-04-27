import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';

const SECTIONS = [
  { title: '1. Acceptance of Terms', body: 'By accessing and using Kenson Investment platform, you accept and agree to be bound by the terms and provision of this agreement.' },
  { title: '2. Investment Risks', body: 'All investments involve risk. Past performance is not indicative of future results. The value of investments may go up or down, and you may receive back less than your original investment.' },
  { title: '3. User Obligations', body: 'You agree to provide accurate and complete information when registering for an account and to keep your account credentials secure and confidential at all times.' },
  { title: '4. Privacy Policy', body: 'We are committed to protecting your privacy. Your personal data will be handled in accordance with our Privacy Policy and applicable data protection laws.' },
  { title: '5. Termination', body: 'We reserve the right to terminate or suspend your account at our sole discretion, without notice, for conduct that we believe violates these Terms of Service.' },
];

const TermsScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.screenHeader}>
      <View style={{ gap: 5 }}>
        <Skeleton width={160} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={180} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
    </View>
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      {[0, 1, 2, 3, 4].map(i => (
        <View key={i} style={[styles.section, { marginBottom: spacing.xl }]}>
          <Skeleton width={170} height={14} borderRadius={5} style={{ marginBottom: spacing.sm }} />
          <Skeleton width="100%" height={10} borderRadius={4} style={{ marginBottom: 6 }} />
          <Skeleton width="85%" height={10} borderRadius={4} />
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

export const TermsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <TermsScreenSkeleton />; }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Terms & Conditions" subtitle="Last updated: April 1, 2024" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {SECTIONS.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.title}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, paddingBottom: spacing['3xl'] },
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSizes.base, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.sm },
  sectionBody: { fontSize: fontSizes.sm, color: colors.text.secondary, lineHeight: 22 },
});
