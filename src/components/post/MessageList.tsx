import React, { useState, useEffect } from "react";
import { FlatList, View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../context/AuthContext";

export default function MessageList() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [usernames, setUsernames] = useState({}); // Store user_id → username mapping

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, content, user_id")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error.message);
      } else {
        setMessages(data || []);
        fetchUsernames(data);
      }
    };

    fetchMessages();

    // Subscribe to real-time message updates
    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, (payload) => {
        if (payload.eventType === "INSERT") {
          setMessages((prev) => [...prev, payload.new]);
          fetchUsernames([payload.new]); // Fetch the new username if needed
        } else if (payload.eventType === "DELETE") {
          setMessages((prev) => prev.filter((m) => m.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchUsernames = async (messagesList) => {
    const uniqueUserIds = [...new Set(messagesList.map((msg) => msg.user_id))];

    const { data, error } = await supabase
      .from("profiles")
      .select("id, username")
      .in("id", uniqueUserIds);

    if (error) {
      console.error("Error fetching usernames:", error);
      return;
    }

    // Update the username mapping
    const newUsernames = {};
    data.forEach((user) => {
      newUsernames[user.id] = user.username;
    });

    setUsernames((prev) => ({ ...prev, ...newUsernames }));
  };

  const handleDelete = async (id) => {
    Alert.alert("Delete Message", "Are you sure you want to delete this message?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase.from("messages").delete().eq("id", id);
          if (error) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const canDelete = user && item.user_id === user.id;
    const username = usernames[item.user_id] || "Loading...";

    return (
      <View style={styles.messageItem}>
        <Text style={styles.emailText}>{username}</Text>
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
      keyExtractor={(item) => item.id.toString()}
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
    backgroundColor: "#f1f1f1",
  },
  emailText: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
  },
  messageText: {
    fontSize: 16,
    color: "#555",
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: "flex-end",
    backgroundColor: "#ff5c5c",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
