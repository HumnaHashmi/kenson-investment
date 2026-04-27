import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from '../constants/routes';
import {
  SplashScreen, IntroductionScreen, LoginScreen,
  RegisterScreen, ForgotPasswordScreen, EnterOtpScreen, ResetPasswordScreen,
} from '../screens/Auth';
import type { AuthStackParamList } from '../types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => (
  <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
    <Stack.Screen name={ROUTES.AUTH.SPLASH} component={SplashScreen} options={{ animation: 'fade' }} />
    <Stack.Screen name={ROUTES.AUTH.INTRODUCTION} component={IntroductionScreen} />
    <Stack.Screen name={ROUTES.AUTH.LOGIN} component={LoginScreen} />
    <Stack.Screen name={ROUTES.AUTH.REGISTER} component={RegisterScreen} />
    <Stack.Screen name={ROUTES.AUTH.FORGOT_PASSWORD} component={ForgotPasswordScreen} />
    <Stack.Screen name={ROUTES.AUTH.ENTER_OTP} component={EnterOtpScreen} />
    <Stack.Screen name={ROUTES.AUTH.RESET_PASSWORD} component={ResetPasswordScreen} />
  </Stack.Navigator>
);
