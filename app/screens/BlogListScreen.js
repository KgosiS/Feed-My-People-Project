// screens/BlogListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ChatBot from './ChatbotScreen'; // ✅ must match default export in ChatBotScreen.js

export default function BlogListScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatVisible, setChatVisible] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
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
        <Ionicons name="calendar-outline" size={14} color="#BF6B00" />
        <Text style={styles.metaText}>
          {new Date(item.created_at).toDateString()}
        </Text>
        <Ionicons name="person-outline" size={14} color="#BF6B00" style={{ marginLeft: 8 }} />
        <Text style={styles.metaText}>Admin</Text>
        <Ionicons name="chatbubble-outline" size={14} color="#BF6B00" style={{ marginLeft: 8 }} />
        <Text style={styles.metaText}>3</Text>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>
        {item.content?.slice(0, 80)}...
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#FFF3E0', '#FFD8A8']}
      style={styles.container}
    >
      <Text style={styles.header}>Blog Posts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#BF6B00" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
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
      {chatVisible && (
        <ChatBot visible={chatVisible} onClose={() => setChatVisible(false)} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#BF6B00',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#FFD8A8',
  },
  image: {
    width: '100%',
    height: 160,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    flexWrap: 'wrap',
  },
  metaText: {
    fontSize: 12,
    color: '#555',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginTop: 8,
    color: '#BF6B00',
  },
  description: {
    fontSize: 14,
    color: '#444',
    marginHorizontal: 10,
    marginBottom: 12,
    marginTop: 4,
  },
floatingBtn: {
  position: 'absolute',
  bottom: 20,
  right: 20,       // ✅ bottom-right corner
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#d35400',
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 5,
},


});
