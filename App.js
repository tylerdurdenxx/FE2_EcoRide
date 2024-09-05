import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Login from './src/Login';
import Signup from './src/Signup';
import { AuthContextProvider } from './src/context/AuthContext';
import Home from './src/Home';
import Start from './src/Start';
import Otp from './src/Otp';
import HamburgerMenu from './src/HamburgerMenu';
import Profile from './src/Profile';
import History from './src/History';
import Rewards from './src/Rewards';
import Wallet from './src/Wallet';
import PaymentMethods from './src/PaymentMethods ';
import PaymentConfirmationScreen from './src/PaymentConfirmationScreen';
import PaymentFormScreen from './src/PaymentFormScreen ';
import HelpForm from './src/HelpForm';


const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Signup" screenOptions={{
          headerShown: false, // Hide the header if needed
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS, // This is default. We'll customize it
          gestureDirection: 'horizontal-inverted', // Enables left-to-right transition
        }}> 
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Otp" component={Otp}
            options={{ headerShown: false }} // Hide the header for this screen

          />

          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home}
           options={{ headerShown: false }} 
          />
          <Stack.Screen name="Start" component={Start} />

          <Stack.Screen name="HamburgerMenu" component={HamburgerMenu} options={{
            headerTitle: 'Settings',
            headerShown:true // Change this to your desired header title
          }} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Wallet" component={Wallet} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="Rewards" component={Rewards} />
          <Stack.Screen name="PaymentMethods" component={PaymentMethods} />

          <Stack.Screen name="PaymentFormScreen" component={PaymentFormScreen} options={{ headerTitle: 'Payment Form' }} />
          <Stack.Screen name="PaymentConfirmation" component={PaymentConfirmationScreen} options={{ headerTitle: 'Payment Confirmation' }} />

          <Stack.Screen name="HelpForm" component={HelpForm} />

        </Stack.Navigator>

      </NavigationContainer>
    </AuthContextProvider>
  );
}
