import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { DrawerNavigator } from './DrawerNavigator';

const Root = createNativeStackNavigator();

export const RootNavigator: React.FC = () => (
  <NavigationContainer>
    <Root.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Root.Screen name="AuthStack" component={AuthNavigator} />
      <Root.Screen name="MainDrawer" component={DrawerNavigator} />
    </Root.Navigator>
  </NavigationContainer>
);
