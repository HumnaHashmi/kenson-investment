import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, spacing, fontSizes } from '../../theme';
import { ROUTES } from '../../constants/routes';

interface HeaderProps {
  username?: string;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  username = 'User',
  notificationCount = 0,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.center}>
        <Text style={styles.welcome}>Welcome back,</Text>
        <Text style={styles.username}>{username}</Text>
      </View>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => navigation.navigate(ROUTES.DRAWER.NOTIFICATIONS as never)}>
        <Ionicons name="notifications" size={22} color="#fff" />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  center: { flex: 1, paddingHorizontal: spacing.md },
  welcome: { fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.6)', letterSpacing: 0.3 },
  username: { fontSize: fontSizes.lg, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  badge: {
    position: 'absolute', top: 2, right: 2,
    backgroundColor: colors.accent, borderRadius: 7,
    minWidth: 14, height: 14,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.primary,
  },
  badgeText: { fontSize: 8, color: '#fff', fontWeight: '800' },
});
