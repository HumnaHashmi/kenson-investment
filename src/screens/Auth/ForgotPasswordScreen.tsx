import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors, fontSizes, spacing } from '../../theme';
import { ROUTES } from '../../constants/routes';
import type { ForgotPasswordScreenProps } from '../../types';

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSend = () => {
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    navigation.navigate(ROUTES.AUTH.ENTER_OTP, { email });
  };

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
          <Text style={styles.heading}>Forgot Password</Text>
          <Text style={styles.desc}>
            Enter your email address and we'll send you an OTP to reset your password.
          </Text>

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="you@example.com"
            error={error}
            containerStyle={styles.inputBox}
          />

          <Button title="Send OTP" onPress={handleSend} style={styles.btn} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  back: { flexDirection: 'row', alignItems: 'center', padding: spacing.base, gap: 4 },
  backText: { color: colors.primaryLight, fontWeight: '600', fontSize: fontSizes.sm },
  content: { flex: 1, paddingHorizontal: spacing['2xl'], paddingTop: spacing['2xl'], alignItems: 'center' },
  iconBox: { marginBottom: spacing.xl },
  heading: { fontSize: fontSizes['2xl'], fontWeight: '800', color: colors.text.primary, textAlign: 'center' },
  desc: { fontSize: fontSizes.sm, color: colors.text.secondary, textAlign: 'center', lineHeight: 22, marginTop: spacing.sm, marginBottom: spacing.xl },
  inputBox: { width: '100%' },
  btn: { width: '100%', marginTop: spacing.md },
});
