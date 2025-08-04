// screens/OutreachScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function OutreachScreen({ navigation }) {
  const [outreachPrograms, setOutreachPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOutreachPrograms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('outreach_programs')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching outreach programs:', error);
    } else {
      setOutreachPrograms(data);
    }
    setLoading(false);
  };

  useEffect(() => {
      fetchOutreachPrograms();
  
      const intervalId = setInterval(() => {
        fetchOutreachPrograms();
      }, 30000);
  
      return () => clearInterval(intervalId);
    }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>
        {new Date(item.date).toLocaleDateString()} • {item.location}
      </Text>
      <Text style={styles.description}>
        {item.description.length > 120
          ? item.description.slice(0, 120) + '...'
          : item.description}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Outreach Programs</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : (
        <FlatList
          data={outreachPrograms}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8e1', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 ,color:'#FF8600'},
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
  },
  image: { width: '100%', height: 180, borderRadius: 8, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  meta: { fontSize: 13, color: '#555', marginBottom: 8 },
  description: { fontSize: 14, color: '#333' },
});
