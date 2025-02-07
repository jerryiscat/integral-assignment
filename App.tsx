import 'react-native-url-polyfill/auto';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Linking, View, ActivityIndicator } from 'react-native';
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check the authentication state on load
    checkAuth().finally(() => {
      setLoading(false);
    });
  }, [checkAuth]);


  if (loading) {
    console.log("Still loading...");
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  // console.log("User state updated -", user ? "Logged in" : "Not logged in");

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen 
          name="Post" 
          component={PostScreen} 
          initialParams={{ user }}
          options={{ headerShown: false }} 
        />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <AuthProvider>
        <AuthNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
