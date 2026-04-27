import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, spacing, fontSizes } from '../../theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  accentColor?: string;
  icon?: IoniconsName;
  style?: ViewStyle;
  dark?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  accentColor = colors.primary,
  icon,
  style,
  dark = false,
}) => (
  <View style={[styles.card, dark && { backgroundColor: accentColor }, style]}>
    <View style={[styles.iconBadge, { backgroundColor: dark ? 'rgba(255,255,255,0.2)' : accentColor + '18' }]}>
      {icon ? <Ionicons name={icon} size={18} color={dark ? '#fff' : accentColor} /> : null}
    </View>
    <Text style={[styles.label, dark && styles.labelDark]}>{label}</Text>
    <Text style={[styles.value, { color: dark ? '#fff' : accentColor }]}>{value}</Text>
    {subtext && (
      <View style={styles.subtextRow}>
        <Text style={[styles.subtext, dark && styles.subtextDark]}>{subtext}</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: '#0F2554',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  iconBadge: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSizes.xs,
    color: colors.text.secondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  labelDark: { color: 'rgba(255,255,255,0.65)' },
  value: {
    fontSize: fontSizes.xl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtextRow: { marginTop: 4 },
  subtext: {
    fontSize: fontSizes.xs,
    color: colors.text.tertiary,
    fontWeight: '500',
  },
  subtextDark: { color: 'rgba(255,255,255,0.6)' },
});
