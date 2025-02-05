// src/screens/PostScreen.tsx
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import Header from '../components/Header';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

import { useNavigation } from '@react-navigation/native';

export default function PostScreen({ }) {
  const { user } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Header title="Post" showBackButton={false} />

      {/* Optionally display user information */}
      {user && <Text style={styles.userText}>Logged in as: {user.email}</Text>}

      <View style={styles.messageContainer}>
        <MessageList />
      </View>

      <MessageInput user={user} />

      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={handleLogout} color="#ff5c5c" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 12,
    backgroundColor: '#fff',
  },
  messageContainer: {
    flex: 1,
    marginBottom: 10,
  },
  logoutContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  userText: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 16,
  },
});
