import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function MessageList() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Fetch messages with user_id and content
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('id, content, user_id')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    // Subscribe to real-time updates for messages
    const subscription = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const handleDelete = async (id) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from('messages').delete().eq('id', id);
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              setMessages((prev) => prev.filter((m) => m.id !== id));
            }
          },
        },
      ]
    );
  };

  const getUsernameByUserId = async (userId) => {
    const { data, error } = await supabase
      .from('profiles') 
      .select('username')
      .eq('id', userId)
      .single(); 
    
    if (error) {
      console.error('Error fetching username:', error);
    } else {
      console.log('Username:', data.username);
    }

    return data ? data.username : 'Unknown User'; 
  };

  const renderItem = ({ item }) => {
    const canDelete = user && item.user_id === user.id;

    console.log(item.user_id)

    // Fetch the username for the message
    const username = getUsernameByUserId(item.user_id);

    return (
      <View style={styles.messageItem}>
        <Text style={styles.emailText}>
          {username}
        </Text>
        <Text style={styles.messageText}>{item.content}</Text>
        {canDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  messageItem: {
    marginVertical: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  emailText: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  messageText: {
    fontSize: 16,
    color: '#555',
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#ff5c5c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
