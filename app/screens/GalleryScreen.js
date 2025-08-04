import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function GalleryScreen() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching gallery:', error);
    } else {
      setGalleryItems(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();

    const intervalId = setInterval(() => {
      fetchGallery();
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <Text style={styles.caption}>{item.title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : (
      <FlatList
  key={'2-columns'} // <-- force remount when columns change (or silence warning)
  data={galleryItems}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  numColumns={2}
  columnWrapperStyle={styles.row}
  showsVerticalScrollIndicator={false}
/>

      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 20,
    backgroundColor: '#fff8e1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#d35400',
    textAlign: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FF8600',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    backgroundColor: '#FF8600',
    resizeMode: 'cover',
  },
  caption: {
    marginTop: 8,
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
