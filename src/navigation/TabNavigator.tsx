import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import { HomeScreen } from '../screens/Home';
import { PortfolioScreen } from '../screens/Portfolio';
import { DepositsScreen } from '../screens/Deposits';
import { ProfileScreen } from '../screens/Profile';
import { ROUTES } from '../constants/routes';
import { colors, fontSizes } from '../theme';
import type { TabParamList } from '../types';

const Tab = createBottomTabNavigator<TabParamList>();

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { active: IoniconsName; inactive: IoniconsName }> = {
  [ROUTES.TABS.HOME]:      { active: 'home',      inactive: 'home-outline' },
  [ROUTES.TABS.PORTFOLIO]: { active: 'bar-chart', inactive: 'bar-chart-outline' },
  [ROUTES.TABS.DEPOSITS]:  { active: 'card',      inactive: 'card-outline' },
  [ROUTES.TABS.PROFILE]:   { active: 'person',    inactive: 'person-outline' },
};

type TabIconProps = { routeName: string; focused: boolean };

const TabIcon: React.FC<TabIconProps> = ({ routeName, focused }) => {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.spring(scale, { toValue: 1.25, useNativeDriver: true, speed: 40, bounciness: 10 }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }),
      ]).start();
    }
  }, [focused, scale]);

  const icons = TAB_ICONS[routeName];
  const name = focused ? icons.active : icons.inactive;

  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Ionicons name={name} size={22} color={focused ? colors.primary : colors.text.tertiary} />
      </Animated.View>
    </View>
  );
};

export const TabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: styles.tabBar,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.text.tertiary,
      tabBarLabelStyle: styles.tabLabel,
      tabBarIcon: ({ focused }) => <TabIcon routeName={route.name} focused={focused} />,
    })}>
    <Tab.Screen name={ROUTES.TABS.HOME} component={HomeScreen} />
    <Tab.Screen name={ROUTES.TABS.PORTFOLIO} component={PortfolioScreen} />
    <Tab.Screen name={ROUTES.TABS.DEPOSITS} component={DepositsScreen} />
    <Tab.Screen name={ROUTES.TABS.PROFILE} component={ProfileScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    height: 70,
    paddingBottom: 8,
    paddingTop: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabLabel: { fontSize: fontSizes.xs, fontWeight: '600', marginTop: -2 },
  iconWrap: {
    width: 44, height: 36, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.primary + '14' },
});
