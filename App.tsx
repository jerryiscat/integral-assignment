import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Linking } from 'react-native';
import LoginScreen from './src/screens/Login';
import PostScreen from './src/screens/Post';
import { AuthProvider, useAuth } from './src/context/AuthContext';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['com.myapp://'], 
  config: {
    screens: {
      Login: '',
      Post: 'post',
    },
  },
};

function AuthNavigator() {
  const { user, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="Post" component={PostScreen} options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider linking={linking}>
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
