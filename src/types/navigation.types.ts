import type { DrawerScreenProps } from '@react-navigation/drawer';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';

// Auth Stack
export type AuthStackParamList = {
  [ROUTES.AUTH.SPLASH]: undefined;
  [ROUTES.AUTH.INTRODUCTION]: undefined;
  [ROUTES.AUTH.LOGIN]: undefined;
  [ROUTES.AUTH.REGISTER]: undefined;
  [ROUTES.AUTH.FORGOT_PASSWORD]: { email?: string } | undefined;
  [ROUTES.AUTH.ENTER_OTP]: { email: string };
  [ROUTES.AUTH.RESET_PASSWORD]: { email: string; otp: string };
};

// Drawer
export type DrawerParamList = {
  [ROUTES.DRAWER.TABS]: undefined;
  [ROUTES.DRAWER.WITHDRAW]: undefined;
  [ROUTES.DRAWER.MONTHLY_STATEMENT]: undefined;
  [ROUTES.DRAWER.REFERRAL]: undefined;
  [ROUTES.DRAWER.EDUCATION]: undefined;
  [ROUTES.DRAWER.CHANGE_PASSWORD]: undefined;
  [ROUTES.DRAWER.TERMS]: undefined;
  [ROUTES.DRAWER.CONTACT_US]: undefined;
  [ROUTES.DRAWER.PRIVACY_POLICY]: undefined;
  [ROUTES.DRAWER.NOTIFICATIONS]: undefined;
  [ROUTES.DRAWER.ALL_ACTIVITY]: undefined;
};

// Bottom Tabs
export type TabParamList = {
  [ROUTES.TABS.HOME]: undefined;
  [ROUTES.TABS.PORTFOLIO]: undefined;
  [ROUTES.TABS.DEPOSITS]: undefined;
  [ROUTES.TABS.PROFILE]: undefined;
};

// Screen prop types
export type SplashScreenProps = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.AUTH.SPLASH>;
export type IntroScreenProps = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.AUTH.INTRODUCTION>;
export type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.AUTH.LOGIN>;
export type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.AUTH.REGISTER>;
export type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.AUTH.FORGOT_PASSWORD>;
export type EnterOtpScreenProps = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.AUTH.ENTER_OTP>;
export type ResetPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, typeof ROUTES.AUTH.RESET_PASSWORD>;

export type HomeScreenProps = BottomTabScreenProps<TabParamList, typeof ROUTES.TABS.HOME>;
export type PortfolioScreenProps = BottomTabScreenProps<TabParamList, typeof ROUTES.TABS.PORTFOLIO>;
export type DepositsScreenProps = BottomTabScreenProps<TabParamList, typeof ROUTES.TABS.DEPOSITS>;
export type ProfileScreenProps = BottomTabScreenProps<TabParamList, typeof ROUTES.TABS.PROFILE>;

export type WithdrawScreenProps = DrawerScreenProps<DrawerParamList, typeof ROUTES.DRAWER.WITHDRAW>;
export type EducationScreenProps = DrawerScreenProps<DrawerParamList, typeof ROUTES.DRAWER.EDUCATION>;
