// src/components/MagicLinkLogin.tsx
import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, Platform } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { Button } from '@rneui/themed';
import { Ionicons } from '@expo/vector-icons';

interface MagicLinkLoginProps {
  buttonTitle?: string;
}

export default function MagicLinkLogin({ buttonTitle = "Login with Email" }: MagicLinkLoginProps) {
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);

  // Function to send a magic link using the provided email
  const sendMagicLinkWithEmail = async (email: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setLinkSent(true);
    }
    setLoading(false);
  };

  const promptForEmail = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        "Enter your Email",
        "Please enter your email to receive a magic link.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "OK", 
            onPress: (email) => {
              if (email && email.trim().length > 0) {
                sendMagicLinkWithEmail(email.trim());
              } else {
                Alert.alert("Error", "Email is required.");
              }
            } 
          }
        ],
        "plain-text"
      );
    } else {
      Alert.alert("Not Supported", "This feature is only supported on iOS for now.");
    }
  };

  return (
    <View style={styles.container}>
      {!linkSent ? (
        <Button
          title={buttonTitle}
          disabled={loading}
          onPress={promptForEmail}
          icon={
            <Ionicons name="mail" size={20} color="white" style={styles.icon} />
          }
        />
      ) : (
        <Text style={styles.successText}>Check your email for the magic link!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  successText: {
    textAlign: 'center',
    color: 'green',
    marginTop: 10,
  },
  icon: {
    marginRight: 10,
  },
});
