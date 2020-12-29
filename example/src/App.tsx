import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScanLockPage from './scan-lock-page';
import MainPage from "./main-page"
import LockPage from './lock-page';
import ScanGatewayPage from './scan-gateway-page'
import GatewayPage from './gateway-page'
import ScanWifiPage from './scan-wifi-page'





const Stack = createStackNavigator();

export default function App() {
  return (

      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainPage">
          <Stack.Screen name="MainPage" component={MainPage} options={{ title: "Ttlock Demo" }} />
          <Stack.Screen name="ScanLockPage" component={ScanLockPage} options={{ title: "Lock" }} />
          <Stack.Screen name="ScanGatewayPage" component={ScanGatewayPage} options={{ title: "Gateway" }} />
          {/* <Stack.Screen name="LockPage" component={LockPage} options={({ route }: { route: any }) => ({ title: route.params.scanLockModal.lockName })} /> */}
          <Stack.Screen name="LockPage" component={LockPage} />
          <Stack.Screen name="GatewayPage" component={GatewayPage} />
          <Stack.Screen name="ScanWifiPage" component={ScanWifiPage} />
        </Stack.Navigator>
      </NavigationContainer>


  );
}