import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';
import { ROUTES } from '../../constants/routes';
import { useNavigation } from '@react-navigation/native';

const SettingsScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={styles.header}>
      <Skeleton width={90} height={20} borderRadius={6} style={{ backgroundColor: 'rgba(255,255,255,0.25)' }} />
    </View>
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={[styles.card, { padding: 0 }]}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[styles.item, i < 3 && styles.itemBorder]}>
            <Skeleton width={38} height={38} borderRadius={10} />
            <Skeleton width={140} height={13} borderRadius={5} style={{ flex: 1 }} />
            <Skeleton width={18} height={18} borderRadius={4} />
          </View>
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
);

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const ITEMS: { icon: IoniconsName; label: string; route: string }[] = [
  { icon: 'key-outline',            label: 'Change Password',   route: ROUTES.DRAWER.CHANGE_PASSWORD },
  { icon: 'call-outline',           label: 'Contact Us',        route: ROUTES.DRAWER.CONTACT_US },
  { icon: 'reader-outline',         label: 'Terms & Conditions',route: ROUTES.DRAWER.TERMS },
  { icon: 'shield-checkmark-outline',label: 'Privacy Policy',   route: ROUTES.DRAWER.PRIVACY_POLICY },
];

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(t);
  }, []);

  if (loading) { return <SettingsScreenSkeleton />; }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.item, i < ITEMS.length - 1 && styles.itemBorder]}
              onPress={() => navigation.navigate(item.route)}>
              <View style={styles.iconBox}>
                <Ionicons name={item.icon} size={20} color={colors.primary} />
              </View>
              <Text style={styles.label}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.text.disabled} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.primary, padding: spacing.base, paddingTop: spacing.lg },
  title: { fontSize: fontSizes.xl, fontWeight: '800', color: '#fff' },
  scroll: { padding: spacing.base },
  card: {
    backgroundColor: colors.surface, borderRadius: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  item: { flexDirection: 'row', alignItems: 'center', padding: spacing.base, gap: spacing.md },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  iconBox: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: colors.primary + '10',
    alignItems: 'center', justifyContent: 'center',
  },
  label: { flex: 1, fontSize: fontSizes.base, color: colors.text.primary, fontWeight: '500' },
});
