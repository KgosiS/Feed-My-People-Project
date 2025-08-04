// screens/BlogDetailScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function BlogDetailScreen({ route }) {
  const { blogId } = route.params;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data, error } = await supabase
        .from('blog_posts') // ✅ fixed table name
        .select('*')
        .eq('id', blogId)
        .single();

      if (error) {
        console.error(error);
      } else {
        setBlog(data);
      }
      setLoading(false);
    };

    fetchBlog();
  }, [blogId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }

  if (!blog) {
    return (
      <View style={styles.centered}>
        <Text>Blog post not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {blog.image_url ? (
        <Image source={{ uri: blog.image_url }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{blog.title}</Text>
      <Text style={styles.meta}>
        By {blog.author_name || 'Anonymous'} •{' '}
        {new Date(blog.created_at).toLocaleDateString()}
      </Text>
      <Text style={styles.content}>{blog.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  meta: { fontSize: 14, color: '#888', marginBottom: 20 },
  content: { fontSize: 16, lineHeight: 24 },
});
