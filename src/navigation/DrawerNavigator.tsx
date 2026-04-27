import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TabNavigator } from './TabNavigator';
import { CustomDrawer } from './CustomDrawer';
import { WithdrawScreen } from '../screens/Withdraw';
import { MonthlyStatementScreen } from '../screens/MonthlyStatement';
import { ReferralScreen } from '../screens/Referral';
import { EducationScreen } from '../screens/Education';
import { ChangePasswordScreen } from '../screens/Settings/ChangePasswordScreen';
import { TermsScreen } from '../screens/Settings/TermsScreen';
import { ContactUsScreen } from '../screens/Settings/ContactUsScreen';
import { PrivacyPolicyScreen } from '../screens/Settings/PrivacyPolicyScreen';
import { NotificationsScreen } from '../screens/Notifications';
import { AllActivityScreen } from '../screens/AllActivity';
import { ROUTES } from '../constants/routes';
import type { DrawerParamList } from '../types';

const Drawer = createDrawerNavigator<DrawerParamList>();

export const DrawerNavigator: React.FC = () => (
  <Drawer.Navigator
    drawerContent={props => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerType: 'slide',
      drawerStyle: { width: '75%' },
      swipeEdgeWidth: 50,
      overlayColor: 'rgba(0,0,0,0.4)',

    }}>
    <Drawer.Screen name={ROUTES.DRAWER.TABS} component={TabNavigator} />
    <Drawer.Screen name={ROUTES.DRAWER.WITHDRAW} component={WithdrawScreen} />
    <Drawer.Screen name={ROUTES.DRAWER.MONTHLY_STATEMENT} component={MonthlyStatementScreen} />
    <Drawer.Screen name={ROUTES.DRAWER.REFERRAL} component={ReferralScreen} />
    <Drawer.Screen name={ROUTES.DRAWER.EDUCATION} component={EducationScreen} />
    <Drawer.Screen name={ROUTES.DRAWER.CHANGE_PASSWORD} component={ChangePasswordScreen} />
    <Drawer.Screen name={ROUTES.DRAWER.TERMS} component={TermsScreen} />
    <Drawer.Screen name={ROUTES.DRAWER.CONTACT_US} component={ContactUsScreen} />
    <Drawer.Screen name={ROUTES.DRAWER.PRIVACY_POLICY} component={PrivacyPolicyScreen} />
    <Drawer.Screen name={ROUTES.DRAWER.NOTIFICATIONS} component={NotificationsScreen} />
    <Drawer.Screen name={ROUTES.DRAWER.ALL_ACTIVITY} component={AllActivityScreen} />
  </Drawer.Navigator>
);
