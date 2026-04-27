import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { DrawerContentScrollView, type DrawerContentComponentProps } from '@react-navigation/drawer';
import Ionicons from '@react-native-vector-icons/ionicons';
import { colors, fontSizes, spacing } from '../theme';
import { ROUTES } from '../constants/routes';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const MENU_ITEMS: { icon: IoniconsName; label: string; route: string }[] = [
  { icon: 'home-outline',          label: 'Home',              route: ROUTES.DRAWER.TABS },
  { icon: 'arrow-up-circle-outline', label: 'Withdraw',        route: ROUTES.DRAWER.WITHDRAW },
  { icon: 'document-text-outline', label: 'Monthly Statement', route: ROUTES.DRAWER.MONTHLY_STATEMENT },
  { icon: 'people-outline',        label: 'Referrals',         route: ROUTES.DRAWER.REFERRAL },
  { icon: 'school-outline',        label: 'Education',         route: ROUTES.DRAWER.EDUCATION },
  { icon: 'lock-closed-outline',   label: 'Change Password',   route: ROUTES.DRAWER.CHANGE_PASSWORD },
  { icon: 'reader-outline',        label: 'Terms & Conditions',route: ROUTES.DRAWER.TERMS },
  { icon: 'call-outline',          label: 'Contact Us',        route: ROUTES.DRAWER.CONTACT_US },
];

export const CustomDrawer: React.FC<DrawerContentComponentProps> = props => {
  const { navigation, state } = props;
  const activeRoute = state.routes[state.index]?.name;
  const [logoutModal, setLogoutModal] = useState(false);

  const handleLogout = () => {
    setLogoutModal(false);
    (navigation as any).reset({ index: 0, routes: [{ name: 'AuthStack' }] });
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* Profile section */}
      <View style={styles.profile}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@email.com</Text>
        <View style={styles.balanceBadge}>
          <Ionicons name="wallet-outline" size={12} color={colors.accent} />
          <Text style={styles.balanceLabel}>Available</Text>
          <Text style={styles.balanceVal}>$12,750</Text>
        </View>
      </View>

      {/* Menu */}
      <ScrollView style={styles.menu} showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item, i) => {
          const isActive = activeRoute === item.route;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => navigation.navigate(item.route)}>
              <Ionicons
                name={isActive ? item.icon.replace('-outline', '') as IoniconsName : item.icon}
                size={20}
                color={isActive ? '#fff' : 'rgba(255,255,255,0.6)'}
                style={styles.menuIcon}
              />
              <Text style={[styles.menuLabel, isActive && styles.menuLabelActive]}>
                {item.label}
              </Text>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Sign Out */}
      <TouchableOpacity style={styles.logout} onPress={() => setLogoutModal(true)}>
        <Ionicons name="log-out-outline" size={20} color="#FF8A9A" style={styles.menuIcon} />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Logout Confirmation Modal */}
      <Modal visible={logoutModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconBox}>
              <Ionicons name="log-out-outline" size={32} color={colors.error} />
            </View>
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalBody}>
              Are you sure you want to sign out of your account?
            </Text>
            <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleLogout}>
              <Text style={styles.modalConfirmText}>Yes, Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setLogoutModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  profile: {
    padding: spacing['2xl'], paddingTop: spacing['3xl'],
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md, borderWidth: 3, borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarText: { fontSize: fontSizes.xl, fontWeight: '800', color: '#fff' },
  name: { fontSize: fontSizes.lg, fontWeight: '700', color: '#fff' },
  email: { fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  balanceBadge: {
    marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs, borderRadius: 20, alignSelf: 'flex-start',
  },
  balanceLabel: { fontSize: fontSizes.xs, color: 'rgba(255,255,255,0.6)' },
  balanceVal: { fontSize: fontSizes.sm, color: colors.accent, fontWeight: '700' },
  menu: { flex: 1, paddingTop: spacing.sm },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.md, paddingHorizontal: spacing['2xl'],
    position: 'relative',
  },
  menuItemActive: { backgroundColor: 'rgba(255,255,255,0.08)' },
  menuIcon: { width: 28 },
  menuLabel: { fontSize: fontSizes.sm, color: 'rgba(255,255,255,0.7)', fontWeight: '500', flex: 1 },
  menuLabelActive: { color: '#fff', fontWeight: '700' },
  activeIndicator: {
    position: 'absolute', right: 0, top: 8, bottom: 8,
    width: 3, backgroundColor: colors.accent, borderRadius: 2,
  },
  logout: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing['2xl'], borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)',
  },
  logoutText: { fontSize: fontSizes.sm, color: '#FF8A9A', fontWeight: '700' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(10,20,50,0.6)',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl,
  },
  modalCard: {
    backgroundColor: colors.surface, borderRadius: 24,
    padding: spacing['2xl'], alignItems: 'center', width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25, shadowRadius: 24, elevation: 16,
  },
  modalIconBox: {
    width: 68, height: 68, borderRadius: 22,
    backgroundColor: colors.errorLight,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.base,
  },
  modalTitle: { fontSize: fontSizes.xl, fontWeight: '800', color: colors.text.primary, marginBottom: spacing.sm },
  modalBody: {
    fontSize: fontSizes.sm, color: colors.text.secondary,
    textAlign: 'center', lineHeight: 21, marginBottom: spacing.xl,
  },
  modalConfirmBtn: {
    backgroundColor: colors.error, borderRadius: 14,
    paddingVertical: spacing.md, width: '100%', alignItems: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.error, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  modalConfirmText: { color: '#fff', fontWeight: '800', fontSize: fontSizes.base },
  modalCancelBtn: {
    backgroundColor: colors.divider, borderRadius: 14,
    paddingVertical: spacing.md, width: '100%', alignItems: 'center',
  },
  modalCancelText: { color: colors.text.secondary, fontWeight: '700', fontSize: fontSizes.base },
});
