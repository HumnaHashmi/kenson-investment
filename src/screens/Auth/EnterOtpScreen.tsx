import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { colors, fontSizes, spacing } from '../../theme';
import { ROUTES } from '../../constants/routes';
import type { EnterOtpScreenProps } from '../../types';

export const EnterOtpScreen: React.FC<EnterOtpScreenProps> = ({ navigation, route }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const handleResend = () => {
    setCountdown(30);
  };

  const handleVerify = () => {
    if (otp.length < 4) {
      setError('Enter a valid OTP');
      return;
    }
    setError('');
    navigation.navigate(ROUTES.AUTH.RESET_PASSWORD, { email, otp });
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
            <Ionicons name="mail-open" size={56} color={colors.primary} />
          </View>
          <Text style={styles.heading}>Enter OTP</Text>
          <Text style={styles.desc}>{'We sent a 6-digit code to\n'}{email}</Text>

          <Input
            label="OTP Code"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            placeholder="123456"
            error={error}
            containerStyle={styles.full}
          />

          <Button title="Verify Code" onPress={handleVerify} style={styles.btn} />

          <TouchableOpacity
            style={styles.resend}
            onPress={handleResend}
            disabled={countdown > 0}
          >
            <Text style={[styles.resendText, countdown > 0 && styles.resendDisabled]}>
              {countdown > 0 ? `Resend in ${countdown}s` : "Didn't receive? Resend"}
            </Text>
          </TouchableOpacity>
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
  full: { width: '100%' },
  btn: { width: '100%', marginTop: spacing.md },
  resend: { marginTop: spacing.xl },
  resendText: { color: colors.primaryLight, fontWeight: '600' },
  resendDisabled: { color: colors.text.secondary },
});
