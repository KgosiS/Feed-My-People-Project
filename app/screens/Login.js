import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../lib/supabase';
import LottieView from 'lottie-react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      const userId = data.user.id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const isIncomplete = !profile?.name || !profile?.phone || !profile?.role;

      if (isIncomplete) {
        navigation.replace('ProfileCompletion');
      } else {
        navigation.replace('Main'); // Tab navigator or main screen
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>FEED MY PEOPLE</Text>
        <Text style={styles.welcome}>Welcome Back!</Text>
        <Text style={styles.subtext}>Login to continue</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#444"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#444"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.bottomText}>
          Don’t have an account?{' '}
          <Text onPress={() => navigation.navigate('SignUp')} style={styles.linkText}>
            Sign Up
          </Text>
        </Text>
      </View>

      {/* Lottie Animation */}
      <View style={styles.animationContainer}>
        <LottieView
    source={require('../assets/animation.json')}
    autoPlay
    loop
    style={{ width: 200, height: 200 }}
  />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#005000',
    padding: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 50,
    marginBottom: 16,
  },
  loginBtn: {
    backgroundColor: '#006400',
    padding: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginText: {
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
  animationContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});
