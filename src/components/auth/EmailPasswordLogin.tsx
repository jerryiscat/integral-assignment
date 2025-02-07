import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { Button, Input } from '@rneui/themed';

export default function EmailPasswordLogin({ isSignUp }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const getEmailByUsername = async (username) => {
    const { data, error } = await supabase
      .from('profiles') 
      .select('email')
      .eq('username', username); 

    if (error) {
      console.error('Error fetching email by username:', error.message);
      return null;
    }

    if (data.length === 0) {
      console.error('No user found with that username');
      return null;
    }

    if (data.length > 1) {
      console.error('Multiple users found with the same username');
      return null;
    }

    return data[0].email; 
  };


  async function signInWithEmailOrUsername() {
    setLoading(true);
    let loginEmail = email.trim();

    if (!loginEmail && username.trim()) {
      loginEmail = await getEmailByUsername(username.trim());
    }

    if (!loginEmail) {
      Alert.alert('Error', 'No account found with that username or email');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    }

    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);

    const { data: existingProfiles, error: profileError } = await supabase
      .from('profiles') 
      .select('username')
      .eq('username', username);

    if (profileError) {
      Alert.alert('Error', profileError.message);
      setLoading(false);
      return;
    }

    if (existingProfiles.length > 0) {
      Alert.alert('Error', 'Username already taken');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          },
        },
      },
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

      {isSignUp && (
        <View style={styles.verticallySpaced}>
          <Input
            label="Username"
            leftIcon={{ type: 'font-awesome', name: 'user' }}
            onChangeText={setUsername}
            value={username}
            placeholder="Choose a username"
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
          <Button
            title="Sign up"
            disabled={loading || !email.trim() || !password.trim() || !username.trim()}
            onPress={signUpWithEmail}
          />
        ) : (
          <Button
            title="Sign in"
            disabled={loading || (!email.trim() && !username.trim()) || !password.trim()}
            onPress={signInWithEmailOrUsername}
          />
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
