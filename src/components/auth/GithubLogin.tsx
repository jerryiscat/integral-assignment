import React, { useState } from 'react';
import { Alert, StyleSheet, View, Linking } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

export default function GitHubLogin(buttonTitle) {
  const [loading, setLoading] = useState(false);

  const handleGitHubSignIn = async () => {
    setLoading(true);

    const redirectUri = makeRedirectUri({
      scheme: "com.myapp",
      path: "path",
    });

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: redirectUri },
    });

    if (error) {
      Alert.alert("GitHub Login Failed", error.message);
    } else {
      // Open GitHub OAuth in browser
      WebBrowser.openBrowserAsync(data.url);
    }
    
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Button
        title={buttonTitle}
        disabled={loading}
        onPress={handleGitHubSignIn}
        icon={<Ionicons name="logo-github" size={20} color="white" style={styles.icon} />}
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
