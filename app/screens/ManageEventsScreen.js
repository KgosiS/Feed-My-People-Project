import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  Modal, TextInput, Alert, SafeAreaView, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';

export default function ManageEventsScreen() {
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchEvents = async () => {
    const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
    if (error) console.error(error);
    else setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModalForCreate = () => {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setDate('');
    setImage(null);
    setModalVisible(true);
  };

  const openModalForEdit = (event) => {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setImage({ uri: event.image_url });
    setModalVisible(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const { uri, base64 } = result.assets[0];
      setImage({ uri, base64 });
    }
  };

  const uploadImageAndGetURL = async () => {
    const fileName = `event_${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from('events-picture')
      .upload(fileName, decode(image.base64), {
        contentType: 'image/jpeg',
      });

    if (uploadError) throw uploadError;

    const { data: publicURLData } = supabase.storage
      .from('events-picture')
      .getPublicUrl(fileName);

    return publicURLData.publicUrl;
  };

  const handleSave = async () => {
    if (!title || !description || !date) return alert('All fields are required');

    try {
      setUploading(true);
      let imageUrl = editingEvent?.image_url || null;

      if (image?.base64) {
        imageUrl = await uploadImageAndGetURL();
      }

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update({ title, description, event_date:date, image_url: imageUrl })
          .eq('id', editingEvent.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([{ title, description, event_date:date, image_url: imageUrl }]);
        if (error) throw error;
      }

      setModalVisible(false);
      fetchEvents();
    } catch (error) {
      console.error('Upload error:', error.message);
      Alert.alert('Upload Failed', error.message);
    } finally {
      setUploading(false);
    }
  };

const handleDelete = async (id) => {
  Alert.alert('Confirm Delete', 'Are you sure you want to delete this event?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Delete', style: 'destructive', onPress: async () => {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) alert('Delete failed');
        else fetchEvents(); // Refresh list after deletion
      }
    }
  ]);
};


  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.cardImage} />
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => openModalForEdit(item)}>
          <Text style={styles.btnTextDark}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={openModalForCreate} style={styles.addBtn}>
        <Text style={styles.btnText}>+ Add Event</Text>
      </TouchableOpacity>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              {editingEvent ? 'Edit Event' : 'Add Event'}
            </Text>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Event Title"
              placeholderTextColor="#888"
              style={styles.input}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Description"
              placeholderTextColor="#888"
              multiline
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            />
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#888"
              style={styles.input}
            />

            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
              <Text style={styles.btnTextDark}>Select Image</Text>
            </TouchableOpacity>

            {image?.uri && (
              <Image source={{ uri: image.uri }} style={{ width: '100%', height: 180, marginTop: 10, borderRadius: 8 }} />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={uploading}>
                <Text style={styles.btnText}>{uploading ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007F5F',
    padding: 16,
  },
  addBtn: {
    backgroundColor: '#2B9348',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  date: {
    fontStyle: 'italic',
    color: '#444',
    marginVertical: 4,
  },
  description: {
    color: '#555',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  editBtn: {
    backgroundColor: '#B7E4C7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: '#B22222',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  btnTextDark: {
    color: '#222',
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#e9f5ef',
    padding: 24,
    borderRadius: 14,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2B9348',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveBtn: {
    backgroundColor: '#2B9348',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#777',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
   cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageBtn: {
    backgroundColor: '#d1fae5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});
