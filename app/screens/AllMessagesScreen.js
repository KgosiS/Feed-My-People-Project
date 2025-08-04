import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function AllMessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('contact_messages')
        .select('name, email, message, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data);
      }
      setLoading(false);
    };

    fetchMessages();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.email}>📧 {item.email}</Text>
      <Text style={styles.date}>🗓 {new Date(item.created_at).toLocaleDateString()}</Text>
      <Text style={styles.message}>💬 {item.message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>All Messages</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#388E3C" />
      ) : (
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9', // light green background
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#388E3C', // dark green
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderLeftWidth: 5,
    borderLeftColor: '#66BB6A',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
  date: {
    fontSize: 13,
    color: '#777',
    marginVertical: 4,
  },
  message: {
    fontSize: 15,
    color: '#333',
    marginTop: 8,
  },
});
