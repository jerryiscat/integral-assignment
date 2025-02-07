// src/screens/PostScreen.tsx
import React from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import Header from '../components/common/Header';
import MessageList from '../components/post/MessageList';
import MessageInput from '../components/post/MessageInput';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useRoute } from "@react-navigation/native";

export default function PostScreen({ }) {
  const route = useRoute();
  const user = route.params?.user;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Post" showBackButton={false} />

      {user && <View style={styles.logoutContainer}>
        <Text style={styles.userText}> Username: {user.user_metadata.username}</Text>
        <Text style={styles.userText}> Email: {user.email}</Text>
        <Button title="Logout" onPress={handleLogout} color="#ff5c5c" />
      </View>}
      
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