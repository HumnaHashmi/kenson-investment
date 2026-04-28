import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors, fontSizes, spacing } from '../../theme';
import { ROUTES } from '../../constants/routes';
import type { ResetPasswordScreenProps } from '../../types';

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Minimum 8 characters';
    if (!confirm) e.confirm = 'Confirm password is required';
    else if (password !== confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReset = () => {
    if (!validate()) return;
    setSuccess(true);
    setTimeout(() => navigation.navigate(ROUTES.AUTH.LOGIN), 2000);
  };

  if (success) {
    return (
      <SafeAreaView style={[styles.safe, styles.center]}>
        <Ionicons name="checkmark-circle" size={80} color={colors.success} />
        <Text style={styles.heading}>Password Reset!</Text>
        <Text style={styles.desc}>Your password has been reset successfully. Redirecting to login...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={20} color={colors.primaryLight} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.iconBox}>
            <Ionicons name="lock-closed" size={56} color={colors.primary} />
          </View>
          <Text style={styles.heading}>New Password</Text>
          <Text style={styles.desc}>Create a strong password for your account</Text>

          <Input label="New Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Minimum 8 characters" error={errors.password} containerStyle={styles.full} />
          <Input label="Confirm Password" value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Repeat password" error={errors.confirm} containerStyle={styles.full} />

          <Button title="Reset Password" onPress={handleReset} style={styles.btn} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing['2xl'] },
  flex: { flex: 1 },
  back: { flexDirection: 'row', alignItems: 'center', padding: spacing.base, gap: 4 },
  backText: { color: colors.primaryLight, fontWeight: '600', fontSize: fontSizes.sm },
  content: { flex: 1, paddingHorizontal: spacing['2xl'], paddingTop: spacing['2xl'], alignItems: 'center' },
  iconBox: { marginBottom: spacing.xl },
  heading: { fontSize: fontSizes['2xl'], fontWeight: '800', color: colors.text.primary, textAlign: 'center', marginTop: spacing.lg },
  desc: { fontSize: fontSizes.sm, color: colors.text.secondary, textAlign: 'center', marginVertical: spacing.base },
  full: { width: '100%' },
  btn: { width: '100%', marginTop: spacing.lg },
});
