// screens/AboutUsScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import ChatBotScreen from './ChatbotScreen';

export default function AboutUsScreen() {
  const [chatVisible, setChatVisible] = useState(false);

  return (
    <LinearGradient
      colors={['#ff9800', '#ff5722']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <Ionicons name="people-circle-outline" size={80} color="#ff5722" style={{ marginBottom: 10 }} />
          <Text style={styles.header}>About Us</Text>

          <Text style={styles.paragraph}>
            FEED MY PEOPLE is a faith-based non-profit organization. Inspired by Jesus’ words in Matthew 25:35:
          </Text>
          <Text style={styles.quote}>
            “I was hungry and you gave me something to eat”
          </Text>
          <Text style={styles.paragraph}>
            We provide meals, food parcels, and support to those in need. We believe feeding people is more than giving food—it's sharing hope, love, and dignity.
          </Text>
          <Text style={styles.paragraph}>
            Join us in making a difference, one meal at a time.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => Alert.alert('More info coming soon!')}
          >
            <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
            <Text style={styles.buttonText}>Learn More</Text>
          </TouchableOpacity>
        </View>

        {/* Floating Chatbot Button */}
        <TouchableOpacity
          style={styles.floatingBtn}
          onPress={() => setChatVisible(true)}
        >
          <Ionicons name="chatbubbles-outline" size={30} color="#fff" />
        </TouchableOpacity>

        {/* ChatBot Modal */}
        <ChatBotScreen visible={chatVisible} onClose={() => setChatVisible(false)} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff5722',
    textAlign: 'center',
    marginBottom: 16,
  },
  paragraph: {
    color: '#444',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  quote: {
    fontStyle: 'italic',
    fontSize: 20,
    color: '#ff9800',
    textAlign: 'center',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#ff5722',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
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
