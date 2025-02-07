// src/screens/LoginScreen.tsx
import React, { useState, useEffect} from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Header from '../components/common/Header';
import EmailPasswordLogin from '../components/auth/EmailPasswordLogin';
import MagicLinkLogin from '../components/auth/MagicLinkLogin';
// import GoogleLogin from '../components/auth/GoogleLogin';
import { Linking } from 'react-native';

export default function LoginScreen() {
  const [mode, setMode] = useState<'Sign Up' | 'Sign In'>('Sign Up');

  return (
    <View style={styles.container}>
      <Header title={mode} showBackButton={false} />
      
      {mode === 'Sign Up' && (
        <>
          <EmailPasswordLogin isSignUp={true} />
          <TouchableOpacity onPress={() => setMode('Sign In')}>
            <Text style={styles.toggleText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
          <View style={styles.alternativeContainer}>
            <Text style={styles.altTitle}>Or use another login method:</Text>
            <MagicLinkLogin />
            {/* <GoogleLogin /> */}
          </View>
        </>
      )}

      {mode === 'Sign In' && (
        <>
          <EmailPasswordLogin isSignUp={false} />
          <TouchableOpacity onPress={() => setMode('Sign Up')}>
            <Text style={styles.toggleText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
          <View style={styles.alternativeContainer}>
            <Text style={styles.altTitle}>Or use another login method:</Text>
            <MagicLinkLogin />
            {/* <GoogleLogin /> */}
          </View>
          
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 12,
  },
  toggleText: {
    textAlign: 'center',
    color: '#007bff',
    marginVertical: 10,
  },
  alternativeContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  altTitle: {
    fontSize: 16,
    marginBottom: 10,
  },
});