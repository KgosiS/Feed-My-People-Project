import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { supabase } from '../lib/supabase';
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  const [galleryPosts, setGalleryPosts] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);

  useEffect(() => {
    fetchGallery();
    fetchBlogs();
  }, []);

  const fetchGallery = async () => {
    const { data, error } = await supabase
      .from('gallery_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setGalleryPosts(data);
  };

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setBlogPosts(data);
  };

  const renderGalleryItem = ({ item }) => (
    <View style={styles.galleryItem}>
      <Image source={{ uri: item.image_url }} style={styles.galleryImage} />
      <Text style={styles.galleryTitle}>{item.title}</Text>
    </View>
  );

  const renderBlogItem = ({ item }) => (
    <View style={styles.blogCard}>
      <Text style={styles.blogTitle}>{item.title}</Text>
      <Text style={styles.blogContent}>
        {item.content.length > 100
          ? item.content.substring(0, 100) + '...'
          : item.content}
      </Text>
      <Text style={styles.blogAuthor}>By {item.author_name}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionHeader}>📸 Gallery</Text>
      <FlatList
        data={galleryPosts}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderGalleryItem}
        contentContainerStyle={styles.galleryList}
      />

      <Text style={styles.sectionHeader}>📰 Blog Posts</Text>
      {blogPosts.map((item) => renderBlogItem({ item }))}

      <View style={styles.animationContainer}>
        <LottieView
          source={require('../assets/animation.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#FF6B00', // Orange theme
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginVertical: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#FFA64D',
  },
  galleryList: {
    paddingBottom: 20,
  },
  galleryItem: {
    backgroundColor: '#FFF7EF', // Soft cream
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    width: screenWidth * 0.6,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  galleryImage: {
    width: '100%',
    height: 140,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  galleryTitle: {
    padding: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FF6B00',
  },
  blogCard: {
    backgroundColor: '#FFE4C4', // Muted peach
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D35400',
    marginBottom: 6,
  },
  blogContent: {
    fontSize: 15,
    color: '#333',
    lineHeight: 20,
  },
  blogAuthor: {
    marginTop: 10,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#6e6e6e',
  },
  animationContainer: {
    alignItems: 'center',
    marginTop: 30,
    paddingBottom: 50,
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
