// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Header from '../components/Header';
import EmailPasswordLogin from '../components/EmailPasswordLogin';
import MagicLinkLogin from '../components/MagicLinkLogin';
import GoogleLogin from '../components/GoogleLogin';

export default function LoginScreen() {
  // Modes: 'signup' or 'signin'
  const [mode, setMode] = useState<'signup' | 'signin'>('signup');

  return (
    <View style={styles.container}>
      <Header title="Login" showBackButton={false} />
      
      {mode === 'signup' && (
        <>
          {/* Sign Up Form */}
          <EmailPasswordLogin isSignUp={true} />
          <TouchableOpacity onPress={() => setMode('signin')}>
            <Text style={styles.toggleText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
          <View style={styles.alternativeContainer}>
            <Text style={styles.altTitle}>Or use another login method:</Text>
            <MagicLinkLogin buttonTitle="Login with Email" />
            <GoogleLogin buttonTitle="Login with Google" />
          </View>
        </>
      )}

      {mode === 'signin' && (
        <>
          {/* Sign In Form */}
          <EmailPasswordLogin isSignUp={false} />
          {/* Alternative Sign In Methods */}
          <View style={styles.alternativeContainer}>
            <Text style={styles.altTitle}>Or use another login method:</Text>
            <MagicLinkLogin buttonTitle="Login with Email" />
            <GoogleLogin buttonTitle="Login with Google" />
          </View>
          <TouchableOpacity onPress={() => setMode('signup')}>
            <Text style={styles.toggleText}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
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
