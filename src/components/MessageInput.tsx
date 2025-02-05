// src/components/MessageInput.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function MessageInput() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (message.trim() === '') return;
    
    const { error } = await supabase.from('messages').insert([
      {
        user_id: user?.id, // Store the user id
        content: message,  // Insert into the 'content' field
      },
    ]);

    if (error) {
      console.error('Error sending message:', error.message);
    } else {
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Write a message..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
});
