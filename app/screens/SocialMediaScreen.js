// screens/SocialMediaScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SocialMediaScreen() {
  const socials = [
    {
      icon: require('../assets/x.png'),
      label: '@feedMyPeopleOrg',
      link: 'https://x.com/feedMyPeopleOrg',
    },
    {
      icon: require('../assets/facebook.png'),
      label: 'Feed My People Community',
      link: 'https://facebook.com/FeedMyPeopleCommunity',
    },
    {
      icon: require('../assets/instagram.png'),
      label: '@feedmypeople_official',
      link: 'https://instagram.com/feedmypeople_official',
    },
    {
      icon: require('../assets/tiktok.png'),
      label: '@feedmypeople.ngo',
      link: 'https://www.tiktok.com/@feedmypeople.ngo',
    },
  ];

  return (
    <LinearGradient colors={['#ff9f43', '#d35400']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>OUR SOCIAL MEDIA PAGES</Text>

        {socials.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => Linking.openURL(item.link)}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    width: 60,
    height: 60,
    marginRight: 15,
    resizeMode: 'contain',
  },
  label: {
    color: '#d35400',
    fontSize: 20,
    fontWeight: '600',
  },
});
