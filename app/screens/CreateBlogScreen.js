import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, Image, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { decode } from 'base64-arraybuffer';

export default function CreateBlogScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImageUri] = useState(null);
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
    if (!image || !title || !author || !content) {
      Alert.alert('Error', 'Please complete all fields and select an image.');
      return;
    }

    try {
      setUploading(true);
      const fileName = `blog_${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, decode(image.base64), {
          contentType: 'image/jpeg',
        });

      if (uploadError) throw uploadError;

      const { data: publicURLData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);

      const imageUrl = publicURLData.publicUrl;

      const { error: insertError } = await supabase.from('blog_posts').insert({
  image_url: imageUrl,
  title,
  author_name: author, // ✅ now it uses the correct value
  content,
});


      if (insertError) throw insertError;

      Alert.alert('Success', 'Blog post created!');
      setImageUri(null);
      setTitle('');
      setAuthor('');
      setContent('');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Upload Failed', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.header}>Create Blog Post</Text>

          <TextInput
            style={styles.input}
            placeholder="Blog Title"
            placeholderTextColor="#ccc"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.input}
            placeholder="Author"
            placeholderTextColor="#ccc"
            value={author}
            onChangeText={setAuthor}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Write your blog content here..."
            placeholderTextColor="#ccc"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
          />

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Text style={styles.buttonText}>Pick Image</Text>
          </TouchableOpacity>

          {image && (
            <Image
              source={{ uri: image.uri }}
              style={{ width: '100%', height: 200, marginBottom: 16, borderRadius: 10 }}
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleUpload} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#166534',
  },
  scrollContainer: {
    flexGrow: 1,
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#34d399', // lighter green
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#34d400', // lighter green
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
