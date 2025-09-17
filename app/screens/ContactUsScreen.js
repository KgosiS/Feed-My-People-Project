// screens/ContactUsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatBotScreen from './ChatbotScreen';

export default function ContactUsScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [chatVisible, setChatVisible] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    const { error } = await supabase.from('contact_messages').insert([
      {
        name,
        email,
        message,
      },
    ]);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Thank You', 'Your message has been sent!');
      setName('');
      setEmail('');
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contact Us</Text>

      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={22} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={22} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start' }]}>
        <Icon name="chatbox-ellipses-outline" size={22} color="#999" style={styles.icon} />
        <TextInput
          style={[styles.input, { height: '100%', textAlignVertical: 'top' }]}
          placeholder="Your Message"
          value={message}
          onChangeText={setMessage}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>

      {/* Floating Chatbot Button */}
      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => setChatVisible(true)}
      >
        <Icon name="chatbubbles-outline" size={30} color="#fff" />
      </TouchableOpacity>

      {/* ChatBot Modal */}
      <ChatBotScreen visible={chatVisible} onClose={() => setChatVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8e9', padding: 20 },
  header: { fontSize: 28, fontWeight: 'bold', color: '#FF8600', textAlign: 'center', marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FF8600',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  floatingBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d35400',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
