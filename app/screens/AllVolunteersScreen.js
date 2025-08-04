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

export default function AllVolunteersScreen() {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('volunteers')
        .select('name, email, phone, message, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error.message);
      } else {
        setVolunteers(data);
      }
      setLoading(false);
    };

    fetchVolunteers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.full_name}</Text>
      <Text style={styles.email}>📧 {item.email}</Text>
      <Text style={styles.phone}>📞 {item.phone}</Text>
      {item.message ? (
        <Text style={styles.message}>💬 {item.message}</Text>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>All Volunteers</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF8600" />
      ) : (
        <FlatList
          data={volunteers}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#E8F5E9' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#43A047', marginBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  email: { fontSize: 14, color: '#555', marginTop: 4 },
  phone: { fontSize: 14, color: '#555' },
  message: { fontSize: 14, color: '#777', marginTop: 6 },
});
