import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ThankYouScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo1.png')} style={styles.logo} />
      <Text style={styles.title}>THANK YOU FOR YOUR DONATION</Text>
      <Text style={styles.message}>
        Your donation and generosity will go a long way in helping our organization continue to feed the people of God.
      </Text>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Main')}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#263238', padding: 24, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FF7043', textAlign: 'center', marginBottom: 12 },
  message: { fontSize: 16, color: '#fff', textAlign: 'center', paddingHorizontal: 12, marginBottom: 20 },
  homeButton: { backgroundColor: '#FFA726', padding: 12, borderRadius: 8 },
  buttonText: { color: '#000', fontWeight: 'bold' },
});
