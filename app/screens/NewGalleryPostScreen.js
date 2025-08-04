import React, { useState } from 'react';
import {
  View, Text, TextInput, Image, TouchableOpacity,
  StyleSheet, Alert, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

export default function NewGalleryPostScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [title, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const { uri, base64 } = result.assets[0];
      setImageUri({ uri, base64 });
    }
  };

  const handleUpload = async () => {
    if (!imageUri || !title) {
      Alert.alert('Error', 'Please select an image and write a caption.');
      return;
    }

    try {
      setUploading(true);
      const fileName = `gallery_${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('gallery-images')
        .upload(fileName, decode(imageUri.base64), {
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase.storage
        .from('gallery-images')
        .getPublicUrl(fileName);

      const imageUrl = publicURLData.publicUrl;

      const { error: insertError } = await supabase.from('gallery_posts').insert({
        image_url: imageUrl,
        title,
      });

      if (insertError) throw insertError;

      Alert.alert('Success', 'Image uploaded!');
      setImageUri(null);
      setCaption('');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>New Gallery Post</Text>

        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri.uri }} style={styles.image} />
          ) : (
            <Text style={styles.imagePlaceholder}>Tap to select image</Text>
          )}
        </TouchableOpacity>

        <TextInput
          placeholder="Enter caption"
          placeholderTextColor="#ccc"
          style={styles.input}
          value={title}
          onChangeText={setCaption}
        />

        <TouchableOpacity style={styles.button} onPress={handleUpload} disabled={uploading}>
          <Text style={styles.buttonText}>
            {uploading ? 'Uploading...' : 'Upload Post'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#166534',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  imageBox: {
    height: 200,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1fae5',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#34d399', // lighter green
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
