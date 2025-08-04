import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function ManageGalleryScreen() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('gallery_posts').select('*').order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      Alert.alert('Error fetching gallery');
    } else {
      setGallery(data);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Image', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const { error } = await supabase.from('gallery_posts').delete().eq('id', id);
          if (error) {
            Alert.alert('Failed to delete');
          } else {
            fetchGallery();
          }
        }
      }
    ]);
  };

  const startEdit = (id, currentTitle) => {
    setEditingId(id);
    setEditedTitle(currentTitle);
  };

  const handleUpdate = async (id) => {
    if (!editedTitle.trim()) {
      Alert.alert('Title cannot be empty');
      return;
    }

    const { error } = await supabase
      .from('gallery_posts')
      .update({ title: editedTitle })
      .eq('id', id);

    if (error) {
      Alert.alert('Update failed');
    } else {
      setEditingId(null);
      setEditedTitle('');
      fetchGallery();
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image_url }} style={styles.image} />
      {editingId === item.id ? (
        <View style={styles.editSection}>
          <TextInput
            value={editedTitle}
            onChangeText={setEditedTitle}
            style={styles.input}
            placeholder="Edit title"
            placeholderTextColor="#ccc"
          />
          <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdate(item.id)}>
            <Text style={styles.buttonText}>Update</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.editButton} onPress={() => startEdit(item.id, item.title)}>
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Gallery</Text>
      {loading ? (
        <ActivityIndicator color="#fff" size="large" />
      ) : (
        <FlatList
          data={gallery}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#166534',
    padding: 16,
    paddingTop: 60, // adjust if you have a toolbar above
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4ade80',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#f87171',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#374151',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  editSection: {
    marginTop: 10,
  },
});
