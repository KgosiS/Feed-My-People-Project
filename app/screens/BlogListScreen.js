// screens/BlogListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function BlogListScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
    }
    setLoading(false);
  };

useEffect(() => {
  fetchPosts(); // 👈 ensure it runs once when mounted

  const unsubscribe = navigation.addListener('focus', fetchPosts);
  return unsubscribe;
}, [navigation]);


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('BlogDetail', { post: item })}
    >
      <Image source={{ uri: item.image_url }} style={styles.image} />
      <View style={styles.meta}>
        <Text style={styles.date}>
          {new Date(item.created_at).toDateString()}
        </Text>
        <Text style={styles.metaText}>Admin</Text>
        <Ionicons name="chatbubble-outline" size={14} color="#555" style={{ marginLeft: 4 }} />
        <Text style={styles.metaText}>3</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>
        {item.content?.slice(0, 80)}...
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Blog Posts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e9', // Orange background
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d35400',
    marginBottom: 16,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    width: 260,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    gap: 6,
  },
  date: {
    fontSize: 12,
    color: '#555',
  },
  metaText: {
    fontSize: 12,
    color: '#555',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginTop: 8,
    color: '#1f2937',
  },
  description: {
    fontSize: 20,
    color: '#444',
    marginHorizontal: 10,
    marginBottom: 12,
    marginTop: 4,
  },
});
