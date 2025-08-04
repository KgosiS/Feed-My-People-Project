import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FEED MY PEOPLE</Text>

      <Image source={require('../assets/logo1.png')} style={styles.logo} />

      <Text style={styles.subtitle}>
        Welcome to <Text style={styles.highlight}>FEED MY PEOPLE</Text>
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.loginButton]}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.socialText}>Or continue with</Text>
      <View style={styles.socialIcons}>
        <TouchableOpacity style={styles.iconWrapper}>
          <FontAwesome name="facebook" size={24} color="#1877F2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <FontAwesome name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <FontAwesome name="linkedin" size={24} color="#0077B5" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C46B07',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 16,
    letterSpacing: 1,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 20,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 6 },
    }),
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#FFE7C2',
  },
  button: {
    backgroundColor: '#FF8C00',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginVertical: 8,
    width: '85%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#FF8C00',
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  socialText: {
    color: '#fff',
    marginTop: 30,
    fontSize: 14,
    marginBottom: 10,
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  iconWrapper: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 1, height: 2 },
  },
});

export default WelcomeScreen;
