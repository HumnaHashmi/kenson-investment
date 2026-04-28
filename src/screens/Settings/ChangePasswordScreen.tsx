import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';

const ChangePasswordScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.screenHeader}>
      <View style={{ gap: 5 }}>
        <Skeleton width={140} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={160} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
    </View>
    <View style={styles.content}>
      {[0, 1, 2].map(i => (
        <View key={i} style={skStyles.field}>
          <Skeleton width={120} height={12} borderRadius={4} style={{ marginBottom: 8 }} />
          <Skeleton width="100%" height={48} borderRadius={10} />
        </View>
      ))}
      <Skeleton width="100%" height={50} borderRadius={10} style={{ marginTop: spacing.base }} />
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
  field: { marginBottom: spacing.base },
});

export const ChangePasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <ChangePasswordScreenSkeleton />; }

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.current) e.current = 'Required';
    if (form.newPass.length < 8) e.newPass = 'Minimum 8 characters';
    if (!form.confirm) e.confirm = 'Confirm new password is required';
    else if (form.newPass !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSuccess(true);
    setTimeout(() => navigation.goBack(), 2000);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Change Password" subtitle="Update your security" />
      <View style={styles.content}>
        {success ? (
          <View style={styles.successBox}>
            <View style={styles.successIconBox}>
              <Ionicons name="checkmark-circle" size={64} color={colors.success} />
            </View>
            <Text style={styles.successText}>Password changed successfully!</Text>
          </View>
        ) : (
          <>
            <Input label="Current Password" value={form.current} onChangeText={set('current')} secureTextEntry placeholder="••••••••" error={errors.current} />
            <Input label="New Password" value={form.newPass} onChangeText={set('newPass')} secureTextEntry placeholder="Minimum 8 characters" error={errors.newPass} />
            <Input label="Confirm New Password" value={form.confirm} onChangeText={set('confirm')} secureTextEntry placeholder="Repeat new password" error={errors.confirm} />
            <Button title="Update Password" onPress={handleSubmit} style={styles.btn} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.xl },
  btn: { marginTop: spacing.base },
  successBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  successIconBox: { marginBottom: spacing.sm },
  successText: { fontSize: fontSizes.base, color: colors.success, fontWeight: '600' },
});
