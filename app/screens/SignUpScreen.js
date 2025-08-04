import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert
} from 'react-native';
import LottieView from 'lottie-react-native'; // 👈 Import Lottie
import { supabase } from '../lib/supabase';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert('Signup Error', error.message);
    } else {
      Alert.alert('Success!', 'Check your email to confirm your account.');
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>FEED MY PEOPLE</Text>
      <Text style={styles.header}>Create Account Now!</Text>

      <TextInput
        placeholder="E-Mail"
        placeholderTextColor="#444"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#444"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.signUpBtn} onPress={handleSignup}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.bottomText}>
        Already have an account?{' '}
        <Text onPress={() => navigation.navigate('Login')} style={styles.linkText}>
          Login
        </Text>
      </Text>

      {/* 👉 Bottom animation */}
      <LottieView
        source={require('../assets/animation.json')}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#005000',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    fontSize: 22,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 16,
  },
  signUpBtn: {
    backgroundColor: '#006400',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  signUpText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomText: {
    color: '#fff',
    textAlign: 'center',
  },
  linkText: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
  animation: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginTop: 10,
  },
});
