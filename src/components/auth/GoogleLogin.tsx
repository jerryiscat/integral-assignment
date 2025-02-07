import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = "1037736986312-rrgsb8846u6v4a35jomdqat7dmjnvvsl.apps.googleusercontent.com"; 

export default function GoogleLogin() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUri },
      });

      if (error) {
        Alert.alert("Login Failed", error.message);
      } else {
        await WebBrowser.openBrowserAsync(data.url);
      }
    } catch (err) {
      Alert.alert("Google Login Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Login with Google"
        disabled={loading}
        onPress={handleGoogleSignIn}
        icon={<Ionicons name="logo-google" size={20} color="white" style={styles.icon} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
});
