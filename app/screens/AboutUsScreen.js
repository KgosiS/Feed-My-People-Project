// screens/AboutUsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

export default function AboutUsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>About Us</Text>

      <Text style={styles.paragraph}>
        FEED MY PEOPLE is a faith-based non-profit organization. Inspired by Jesus’ words in Matthew 25:35
        “I was hungry and you gave me something to eat”
      </Text>
      <Text style={styles.paragraph}>
        We provide meals, food parcels, and support to those in need. We believe that feeling people is more than giving food,
        It's sharing hope, love, and dignity.
      </Text>
      <Text style={styles.paragraph}>
        Join us in making a difference, one meal at a time.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => Alert.alert('More info coming soon!')}>
        <Text style={styles.buttonText}>Learn More</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8e9', padding: 20 },
  header: { fontSize: 32, fontWeight: 'bold', color: '#d35400', textAlign: 'center', marginBottom: 16 },
  paragraph: { color: '#d35400', fontSize: 25, textAlign: 'center', marginBottom: 10 },
  button: {
    backgroundColor: '#d35400',
    padding: 12,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' ,fontSize:25},
});
