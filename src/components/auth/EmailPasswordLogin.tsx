import React, { useState, useEffect } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { Button, Input } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

interface EmailPasswordLoginProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void; // To toggle between sign-in and sign-up
}

export default function EmailPasswordLogin({ isSignUp, setIsSignUp }: EmailPasswordLoginProps) {
  const navigation = useNavigation(); // For navigation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle deep link verification and redirect to sign-in page
  useEffect(() => {
    const handleAuthStateChange = async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user);

        // Redirect to sign-in page after verification
        setIsSignUp(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Sign In: Supports email or username
  async function signInWithEmail() {
    setLoading(true);

    let loginIdentifier = email.trim();

    // Attempt to sign in
    const { error } = await supabase.auth.signInWithPassword({
      email: loginIdentifier,
      password: password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      navigation.navigate('Post'); // Navigate to post screen after login
    }

    setLoading(false);
  }

  // Sign Up: Requires email and password
  async function signUpWithEmail() {
    setLoading(true);

    // Sign up user in Supabase Auth
    const { error } = await supabase.auth.signUp(
      {
        email: email,
        password: password, // Ensures password is required
      },
      {
        emailRedirectTo: 'exp://192.168.1.100:8081', // Replace with your Expo IP
      }
    );

    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
      return;
    }

    Alert.alert('Success', 'Check your email to verify your account. Then log in.');
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
        />
      </View>

      {/* Common Password Input */}
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>

      {/* Sign Up / Sign In Button */}
      <View style={[styles.verticallySpaced, styles.mt20]}>
        {isSignUp ? (
          <Button title="Sign up" disabled={loading || !email.trim() || !password.trim()} onPress={signUpWithEmail} />
        ) : (
          <Button title="Sign in" disabled={loading || !email.trim() || !password.trim()} onPress={signInWithEmail} />
        )}
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  verticallySpaced: {
    paddingVertical: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
