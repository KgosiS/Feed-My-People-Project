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

export default function AllDonationsScreen() {
  const [donations, setDonations] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('card_holder, amount, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error.message);
      } else {
        setDonations(data);
        const totalAmount = data.reduce((sum, d) => sum + parseFloat(d.amount), 0);
        setTotal(totalAmount);
      }
      setLoading(false);
    };

    fetchDonations();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.card_holder}</Text>
      <Text style={styles.amount}>R {parseFloat(item.amount).toFixed(2)}</Text>
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>All Donations</Text>
      <Text style={styles.total}>Total: R {total.toFixed(2)}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FF8600" />
      ) : (
        <FlatList
          data={donations}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFFBE6' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF8600', marginBottom: 10 },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
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
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  amount: { fontSize: 16, color: '#2E7D32' },
  date: { fontSize: 14, color: '#666', marginTop: 4 },
});
