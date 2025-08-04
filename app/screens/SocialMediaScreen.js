// screens/SocialMediaScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function SocialMediaScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>OUR SOCIAL MEDIA PAGES</Text>

      <View style={styles.row}>
        <Image source={require('../assets/x.png')} style={styles.icon} />
        <Text style={styles.label}>@feedMyPeopleOrg</Text>
      </View>

      <View style={styles.row}>
        <Image source={require('../assets/facebook.png')} style={styles.icon} />
        <Text style={styles.label}>Feed My People Community</Text>
      </View>

      <View style={styles.row}>
        <Image source={require('../assets/instagram.png')} style={styles.icon} />
        <Text style={styles.label}>@feedmypeople_official</Text>
      </View>

      <View style={styles.row}>
        <Image source={require('../assets/tiktok.png')} style={styles.icon} />
        <Text style={styles.label}>@feedmypeople.ngo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff8e9', padding: 20 },
  header: { color: '#d35400', fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  icon: { width: 80, height: 80, marginRight: 12 },
  label: { color: '#d35400', fontSize: 20 },
});
