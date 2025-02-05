// src/components/EmailPasswordLogin.tsx
import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { supabase } from '../../lib/supabase';
import { Button, Input } from '@rneui/themed';

interface EmailPasswordLoginProps {
  isSignUp: boolean;
}

export default function EmailPasswordLogin({ isSignUp }: EmailPasswordLoginProps) {
  // Fields for sign up mode
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  // Common field: password
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Sign In Flow: Now the input field accepts either an email or a username.
  async function signInWithEmail() {
    setLoading(true);
    
    // Use the value in "email" state as the login identifier.
    // (It can be an email or a username.)
    let loginIdentifier = email.trim();

    // If the input does not include an "@" symbol, assume it's a username
    if (!loginIdentifier.includes('@')) {
      // Lookup the email for this username from the profiles table
      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', loginIdentifier)
        .single();

      if (profileError || !data) {
        Alert.alert('Error', 'User not found. Please check your username.');
        setLoading(false);
        return;
      }
      // Use the email retrieved from the profile
      loginIdentifier = data.email;
    }

    // Now attempt to sign in using the determined email and password.
    const { error } = await supabase.auth.signInWithPassword({
      email: loginIdentifier,
      password: password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  }

  // Sign Up Flow: (Create a new user account and insert profile data)
  async function signUpWithEmail() {
    setLoading(true);
    // Create account via Supabase Auth
    const { data: { session }, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
      return;
    }
    // Insert user's profile with the username
    if (session && session.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: session.user.id,
            email: email,
            username: username,
          },
        ]);
      if (profileError) {
        Alert.alert('Profile Error', profileError.message);
      } else {
        Alert.alert('Success', 'Please check your inbox for email verification!');
      }
    } else {
      Alert.alert('Success', 'Please check your inbox for email verification!');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      {isSignUp ? (
        <>
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
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Input
              label="Username"
              leftIcon={{ type: 'font-awesome', name: 'user' }}
              onChangeText={setUsername}
              value={username}
              placeholder="Username"
              autoCapitalize="none"
            />
          </View>
        </>
      ) : (
        // In sign in mode, the input field now accepts either an email or a username.
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Input
            label="Email or Username"
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            onChangeText={setEmail}
            value={email}
            placeholder="Email or Username"
            autoCapitalize="none"
          />
        </View>
      )}

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

      <View style={[styles.verticallySpaced, styles.mt20]}>
        {isSignUp ? (
          <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} />
        ) : (
          <Button title="Sign in" disabled={loading} onPress={signInWithEmail} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 12,
  },
  verticallySpaced: {
    paddingVertical: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
