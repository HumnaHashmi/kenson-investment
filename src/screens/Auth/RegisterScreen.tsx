import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors, fontSizes, spacing } from '../../theme';
import type { RegisterScreenProps } from '../../types';

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Please enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (!form.confirm) e.confirm = 'Confirm password is required';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = () => {
    if (!validate()) return;
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.topBar}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>KI</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subheading}>Join Kenson Investment today</Text>

            <Input label="Full Name" value={form.fullName} onChangeText={set('fullName')} placeholder="John Doe" error={errors.fullName} />
            <Input label="Email Address" value={form.email} onChangeText={set('email')} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" error={errors.email} />
            <Input label="Password" value={form.password} onChangeText={set('password')} secureTextEntry placeholder="Minimum 8 characters" error={errors.password} />
            <Input label="Confirm Password" value={form.confirm} onChangeText={set('confirm')} secureTextEntry placeholder="Repeat password" error={errors.confirm} />

            <Button title="Create Account" onPress={handleRegister} style={styles.btn} />

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.primary },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  topBar: { alignItems: 'center', paddingVertical: spacing['2xl'] },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  card: {
    flex: 1, backgroundColor: colors.background,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: spacing['2xl'], paddingTop: spacing['3xl'],
  },
  heading: { fontSize: fontSizes['2xl'], fontWeight: '800', color: colors.text.primary },
  subheading: { fontSize: fontSizes.sm, color: colors.text.secondary, marginTop: 4, marginBottom: spacing['2xl'] },
  btn: { marginTop: spacing.sm },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  loginText: { color: colors.text.secondary, fontSize: fontSizes.sm },
  loginLink: { color: colors.primaryLight, fontWeight: '700', fontSize: fontSizes.sm },
});
