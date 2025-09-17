import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, Animated
} from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true }),
    ]).start();
  }, []);

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
        navigation.replace('Main');
      }
    }
  };

  return (
    <LinearGradient colors={['#ff9a3c', '#ff6f3c', '#c46b07']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.centerWrapper}>
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.logo}>FEED MY PEOPLE</Text>
            <Text style={styles.header}>Welcome Back!</Text>
            <Text style={styles.subtext}>Login to continue</Text>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <FontAwesome name="envelope" size={18} color="#c46b07" style={styles.inputIcon} />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#888"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <FontAwesome name="lock" size={20} color="#c46b07" style={styles.inputIcon} />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity onPress={handleLogin} activeOpacity={0.85} style={{ width: '100%' }}>
              <LinearGradient colors={['#ffaf40', '#ff9f1c']} style={styles.loginBtn}>
                <Text style={styles.loginText}>Login</Text>
                <FontAwesome name="arrow-right" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.bottomText}>
              Don’t have an account?{' '}
              <Text onPress={() => navigation.navigate('SignUp')} style={styles.linkText}>
                Sign Up
              </Text>
            </Text>

            {/* Animation */}
            <LottieView
              source={require('../assets/animation.json')}
              autoPlay
              loop
              style={styles.animation}
            />
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFE7C2',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    fontSize: 26,
    color: '#c46b07',
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  header: {
    fontSize: 18,
    color: '#ff6f3c',
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#FFD7A0',
    marginBottom: 16,
    width: '100%',
    paddingHorizontal: 15,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, color: '#000' },
  loginBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 2, height: 3 },
    shadowRadius: 5,
    marginTop: 4,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  bottomText: {
    color: '#444',
    textAlign: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#c46b07',
    fontWeight: 'bold',
  },
  animation: {
    width: 150,
    height: 150,
    marginTop: 20,
  },
});
