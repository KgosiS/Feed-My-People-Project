// screens/admin/ViewDonationsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function ViewDonationsScreen() {
  const [donations, setDonations] = useState([]);

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setDonations(data);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);
  const exportToCSV = async () => {
  if (!donations.length) return alert('No donations to export.');

  const csvHeader = 'Name,Amount,Message,Date\n';
  const csvRows = donations.map((d) =>
    `"${d.name || 'Anonymous'}",${d.amount},"${d.message || ''}",${new Date(d.created_at).toLocaleDateString()}`
  );
  const csvString = csvHeader + csvRows.join('\n');

  const fileUri = FileSystem.documentDirectory + 'donations_report.csv';
  await FileSystem.writeAsStringAsync(fileUri, csvString, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  if (!(await Sharing.isAvailableAsync())) {
    alert('Sharing is not available on this device');
    return;
  }

  await Sharing.shareAsync(fileUri);
};


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
      <Text style={styles.name}>{item.name || 'Anonymous'}</Text>
      {item.message ? <Text style={styles.message}>{item.message}</Text> : null}
      <Text style={styles.date}>
        {new Date(item.created_at).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={exportToCSV} style={styles.exportBtn}>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>Export to CSV</Text>
</TouchableOpacity>

      <FlatList
        data={donations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D17500', padding: 16 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#2a9d8f',
  },
  name: { fontSize: 16, marginTop: 4 },
  message: { fontStyle: 'italic', marginTop: 4, color: '#555' },
  date: { color: '#999', fontSize: 12, marginTop: 6 },
  exportBtn: {
  backgroundColor: '#1f2937',
  padding: 12,
  borderRadius: 6,
  alignItems: 'center',
  marginBottom: 16,
},

});
