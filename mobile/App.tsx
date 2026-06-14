/**
 * NotaryFinder mobile app — navigation root.
 * @format
 */
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthScreen from './src/screens/AuthScreen';
import ServicesChecklistScreen from './src/screens/ServicesChecklistScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import JobDetailScreen from './src/screens/JobDetailScreen';
import BidPlacementScreen from './src/screens/BidPlacementScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export type RootStackParamList = {
  Auth: undefined;
  ServicesChecklist: undefined;
  Dashboard: { flash?: string } | undefined;
  JobDetail: { jobId: string };
  BidPlacement: { jobId: string };
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Auth"
          screenOptions={{
            headerStyle: { backgroundColor: '#ffffff' },
            headerTitleStyle: { fontWeight: '600' },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: '#ffffff' },
          }}>
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ServicesChecklist" component={ServicesChecklistScreen} options={{ title: 'Your services' }} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Open jobs' }} />
          <Stack.Screen name="JobDetail" component={JobDetailScreen} options={{ title: 'Job details' }} />
          <Stack.Screen name="BidPlacement" component={BidPlacementScreen} options={{ title: 'Place a bid' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
