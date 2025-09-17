import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../lib/supabase';

export default function AdminDashboardScreen({ navigation }) {
  const [messageCount, setMessageCount] = useState(null);
  const [volunteerCount, setVolunteerCount] = useState(null);

  const buttons = [
    { label: 'Manage Users', icon: 'people', screen: 'ManageUsers' },
    { label: 'Manage Blog Posts', icon: 'document-text', screen: 'ManageBlogPosts' },
    { label: 'Manage Events', icon: 'calendar', screen: 'ManageEvents' },
    { label: 'Manage Gallery', icon: 'images', screen: 'ManageGallery' },
    { label: 'Create Outreach', icon: 'megaphone', screen: 'CreateOutreach' },
    { label: 'Add to Blog', icon: 'add-circle', screen: 'AddBlogPost' },
    { label: 'Add to Gallery', icon: 'image', screen: 'AddGalleryPost' },
    { label: 'View Messages', icon: 'chatbubbles', screen: 'AllMessages' },
    { label: 'View Volunteers', icon: 'hand-left', screen: 'AllVolunteers' },
    { label: 'View Donations', icon: 'cash', screen: 'AllDonations' },
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      const [{ count: msgCount }, { count: volCount }] = await Promise.all([
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('volunteers').select('*', { count: 'exact', head: true }),
      ]);

      setMessageCount(msgCount);
      setVolunteerCount(volCount);
    };

    fetchCounts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <View style={styles.badgesContainer}>
        <View style={styles.badge}>
          <Icon name="chatbubbles-outline" size={18} color="#fff" />
          <Text style={styles.badgeText}>
            {messageCount ?? <ActivityIndicator size="small" color="#fff" />}
          </Text>
        </View>
        <View style={styles.badge}>
          <Icon name="hand-left-outline" size={18} color="#fff" />
          <Text style={styles.badgeText}>
            {volunteerCount ?? <ActivityIndicator size="small" color="#fff" />}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {buttons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => navigation.navigate(btn.screen)}
          >
            <View style={styles.iconCircle}>
              <Icon name={btn.icon} size={26} color="#fff" />
            </View>
            <Text style={styles.buttonText}>{btn.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8e9', // warm background
    paddingTop: 40,
  },
  title: {
    color: '#d35400',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  badge: {
    backgroundColor: '#d35400',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#fff',
    width: '42%',
    height: 120,
    marginBottom: 20,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconCircle: {
    backgroundColor: '#d35400',
    borderRadius: 50,
    padding: 12,
    marginBottom: 8,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#d35400',
    fontSize: 14,
  },
});
