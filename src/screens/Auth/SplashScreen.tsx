import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, fontSizes, spacing } from '../../theme';
import type { SplashScreenProps } from '../../types';
import { ROUTES } from '../../constants/routes';

export const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace(ROUTES.AUTH.INTRODUCTION);
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoBox, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>KI</Text>
        </View>
        <Text style={styles.brand}>Kenson</Text>
        <Text style={styles.brandSub}>Investment</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: fadeAnim }]}>
        Grow Your Wealth Wisely
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: { alignItems: 'center' },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: { fontSize: 32, fontWeight: '900', color: '#fff' },
  brand: { fontSize: fontSizes['3xl'], fontWeight: '800', color: '#fff', letterSpacing: 1 },
  brandSub: { fontSize: fontSizes.lg, color: 'rgba(255,255,255,0.7)', letterSpacing: 4, textTransform: 'uppercase' },
  tagline: { fontSize: fontSizes.sm, color: 'rgba(255,255,255,0.5)', marginTop: spacing['3xl'], letterSpacing: 1 },
});
