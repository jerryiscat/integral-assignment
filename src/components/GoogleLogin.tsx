// src/components/GoogleLogin.tsx
import React, { useEffect } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button } from '@rneui/themed';
import { supabase } from '../../lib/supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Ionicons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

interface GoogleLoginProps {
  buttonTitle?: string;
}


export default function GoogleLogin({ buttonTitle = "Login with Gmail" }: GoogleLoginProps) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: 'your-android-client-id.apps.googleusercontent.com',
    iosClientId: 'your-ios-client-id.apps.googleusercontent.com',
    expoClientId: 'your-expo-client-id.apps.googleusercontent.com',
  });

  async function signInWithGoogle(buttonTitle) {
    if (response?.type === 'success') {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { access_token: response.params.access_token },
      });

      if (error) {
        Alert.alert('Google Login Failed', error.message);
      }
    }
  }

  useEffect(() => {
    if (response?.type === 'success') {
      signInWithGoogle();
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Button
        title= {buttonTitle}
        onPress={() => promptAsync()}
        icon={<Ionicons name="logo-google" size={20} color="white" style={styles.icon} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  icon: {
    marginRight: 10,
  },
});
