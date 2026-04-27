import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';
import { validateSubject, validateMessage } from '../../utils/validation';

const ContactUsScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.screenHeader}>
      <View style={{ gap: 5 }}>
        <Skeleton width={100} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={140} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
    </View>
    <ScrollView contentContainerStyle={{ padding: spacing.xl, gap: spacing.sm }}>
      <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl }}>
        {[0, 1].map(i => (
          <View key={i} style={[styles.contactCard, { flex: 1, alignItems: 'center', gap: 6 }]}>
            <Skeleton width={44} height={44} borderRadius={13} />
            <Skeleton width={40} height={10} borderRadius={4} />
            <Skeleton width={90} height={11} borderRadius={4} />
          </View>
        ))}
      </View>
      <View style={[styles.form]}>
        <Skeleton width={120} height={14} borderRadius={5} style={{ marginBottom: spacing.base }} />
        {[0, 1].map(i => (
          <View key={i} style={{ marginBottom: spacing.base }}>
            <Skeleton width={70} height={11} borderRadius={4} style={{ marginBottom: 8 }} />
            <Skeleton width="100%" height={i === 1 ? 100 : 48} borderRadius={10} />
          </View>
        ))}
        <Skeleton width="100%" height={50} borderRadius={10} />
      </View>
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

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const CONTACT_ITEMS: { icon: IoniconsName; label: string; value: string }[] = [
  { icon: 'mail-outline',  label: 'Email', value: 'support@kensoninvestment.com' },
  { icon: 'call-outline',  label: 'Phone', value: '+1 (800) 555-0199' },
];

export const ContactUsScreen: React.FC = () => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState(false);
  const [subjectError, setSubjectError] = useState('');
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <ContactUsScreenSkeleton />; }

  const handleSend = () => {
    const sErr = validateSubject(subject);
    const mErr = validateMessage(message);
    setSubjectError(sErr);
    setMessageError(mErr);
    if (sErr || mErr) return;
    setSent(true);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Contact Us" subtitle="We're here to help" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.contactRow}>
          {CONTACT_ITEMS.map((c, i) => (
            <View key={i} style={styles.contactCard}>
              <View style={styles.contactIconBox}>
                <Ionicons name={c.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.contactLabel}>{c.label}</Text>
              <Text style={styles.contactValue}>{c.value}</Text>
            </View>
          ))}
        </View>

        {sent ? (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={64} color={colors.success} />
            <Text style={styles.successText}>Message sent! We'll respond within 24 hours.</Text>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Send a Message</Text>
            <Input
              label="Subject"
              value={subject}
              onChangeText={val => { setSubject(val); setSubjectError(validateSubject(val)); }}
              placeholder="How can we help?"
              error={subjectError}
            />
            <Input
              label="Message"
              value={message}
              onChangeText={val => { setMessage(val); setMessageError(validateMessage(val)); }}
              placeholder="Describe your issue or question..."
              multiline
              numberOfLines={5}
              error={messageError}
            />
            <Button title="Send Message" onPress={handleSend} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.xl, paddingBottom: spacing['3xl'] },
  contactRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  contactCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: spacing.md,
    alignItems: 'center', shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  contactIconBox: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: colors.primary + '10',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  contactLabel: { fontSize: fontSizes.xs, color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5 },
  contactValue: { fontSize: fontSizes.xs, color: colors.primaryLight, fontWeight: '700', textAlign: 'center', marginTop: 2 },
  form: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.base },
  formTitle: { fontSize: fontSizes.base, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.base },
  successBox: { alignItems: 'center', paddingVertical: spacing['3xl'], gap: spacing.lg },
  successText: { fontSize: fontSizes.base, color: colors.success, fontWeight: '600', textAlign: 'center' },
});
