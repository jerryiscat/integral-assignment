// App.tsx
import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/Login';
import PostScreen from './src/screens/Post';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createStackNavigator();

function AuthNavigator() {
  const { user, checkAuth } = useAuth();

  // Optionally, call checkAuth() on mount to refresh the session
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Stack.Navigator>
      {user ? (
        // If a user is authorized, render the Post screen
        <Stack.Screen name="Post" component={PostScreen} options={{ headerShown: false }} />
      ) : (
        // Otherwise, render the Login screen
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
