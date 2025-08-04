// screens/admin/ExportReportScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';

export default function ExportReportScreen() {
  const [loading, setLoading] = useState(false);

  const exportData = async (tableName) => {
    setLoading(true);

    const { data, error } = await supabase.from(tableName).select('*');

    if (error) {
      Alert.alert('Error', `Failed to fetch ${tableName}: ${error.message}`);
      setLoading(false);
      return;
    }

    const csv = Papa.unparse(data);

    const fileUri = `${FileSystem.documentDirectory}${tableName}_export.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert('CSV saved', `File saved to ${fileUri}`);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Export Reports</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={() => exportData('donations')}>
            <Text style={styles.buttonText}>Export Donations</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => exportData('users')}>
            <Text style={styles.buttonText}>Export Users</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => exportData('blog_posts')}>
            <Text style={styles.buttonText}>Export Blog Posts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => exportData('events')}>
            <Text style={styles.buttonText}>Export Events</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  button: {
    backgroundColor: '#228B22',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
