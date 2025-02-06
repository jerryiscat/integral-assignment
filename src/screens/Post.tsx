// src/screens/PostScreen.tsx
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import Header from '../components/common/Header';
import MessageList from '../components/post/MessageList';
import MessageInput from '../components/post/MessageInput';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function PostScreen({ }) {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Header title="Post" showBackButton={false} />

      <View style={styles.logoutContainer}>
        {user && <Text style={styles.userText}>Logged in as: {user.email}</Text>}
        <Button title="Logout" onPress={handleLogout} color="#ff5c5c" />
      </View>

      <View style={styles.messageContainer}>
        <MessageList />
      </View>

      <MessageInput />
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
    alignItems: 'flex-end',
    paddingRight: 16,
  },
  userText: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 16,
  },
});
