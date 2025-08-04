import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function CreateOutreachScreen() {
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    date: '',
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    const { name, description, location, date } = form;

    if (!name || !description || !location || !date) {
      Alert.alert('All fields are required.');
      return;
    }

    const { error } = await supabase.from('outreach_programs').insert([form]);

    if (error) {
      console.error(error);
      Alert.alert('Submission failed. Try again.');
    } else {
      Alert.alert('Outreach program created!');
      setForm({ name: '', description: '', location: '', date: '' });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Outreach Program</Text>

          <TextInput
            placeholder="Program Name"
            value={form.name}
            onChangeText={(text) => handleChange('name', text)}
            style={styles.input}
          />

          <TextInput
            placeholder="Description"
            value={form.description}
            onChangeText={(text) => handleChange('description', text)}
            multiline
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          />

          <TextInput
            placeholder="Location"
            value={form.location}
            onChangeText={(text) => handleChange('location', text)}
            style={styles.input}
          />

          <TextInput
            placeholder="Date (YYYY-MM-DD)"
            value={form.date}
            onChangeText={(text) => handleChange('date', text)}
            style={styles.input}
          />

          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#000',
    width: '100%',
  },
  button: {
    backgroundColor: '#34d400',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
