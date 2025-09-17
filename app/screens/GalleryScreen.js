import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../lib/supabase';
import ChatBot from './ChatbotScreen'; // make sure this is correct path
import { Ionicons } from '@expo/vector-icons';

export default function GalleryScreen() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);

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
          key={'2-columns'}
          data={galleryItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Chatbot Button */}
      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => setChatVisible(true)}
      >
        <Ionicons name="chatbubbles-outline" size={30} color="#fff" />
      </TouchableOpacity>

      {/* ChatBot Modal */}
      <ChatBot visible={chatVisible} onClose={() => setChatVisible(false)} />
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
  floatingBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20, // bottom-right corner
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d35400',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
