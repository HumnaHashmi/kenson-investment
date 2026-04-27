import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, fontSizes, spacing } from '../../theme';

type Props = {
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  title?: string;
  message: string;
};

export const EmptyState: React.FC<Props> = ({
  icon = 'file-tray-outline',
  title = 'No Records Found',
  message,
}) => (
  <View style={styles.container}>
    <View style={styles.iconBox}>
      <Ionicons name={icon} size={36} color={colors.text.disabled} />
    </View>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing['2xl'],
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSizes.base,
    fontWeight: '700',
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: fontSizes.sm,
    color: colors.text.disabled,
    textAlign: 'center',
    lineHeight: 20,
  },
});
