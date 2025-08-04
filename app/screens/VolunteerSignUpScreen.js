import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function VolunteerSignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!fullName || !phone || !email) {
      Alert.alert('Error', 'Please fill out all required fields.');
      return;
    }

    const { error } = await supabase.from('volunteers').insert([
      {
        name: fullName,
        email,
        phone,
        message,
      },
    ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Thank you for signing up as a volunteer!');
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Become a Volunteer</Text>

      <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
      <TextInput style={styles.input} placeholder="Phone no." value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="E-Mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Why would you like to volunteer?"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff8e9' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#FF8600', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#FF8600',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
});
