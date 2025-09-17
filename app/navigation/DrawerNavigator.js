import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { supabase } from '../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Screens
import BlogListScreen from '../screens/BlogListScreen';
import GalleryScreen from '../screens/GalleryScreen';
import DonationScreen from '../screens/DonationScreen';
import VolunteerSignUpScreen from '../screens/VolunteerSignUpScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import SocialMediaScreen from '../screens/SocialMediaScreen';
import OutReachProgramScreen from '../screens/OutReachProgramScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import EventsScreen from '../screens/EventsScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data?.role === 'admin') {
        setIsAdmin(true);
      }

      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return null;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#BF6B00' }, // same as welcome
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#FFF4E6' }, // light warm tone
        drawerActiveTintColor: '#BF6B00',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: { fontSize: 16, fontWeight: '500' },
      }}
    >
      <Drawer.Screen 
        name="Blog" 
        component={BlogListScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="newspaper-variant-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Gallery" 
        component={GalleryScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="image-multiple" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Events" 
        component={EventsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="calendar-month" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Outreach" 
        component={OutReachProgramScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="hand-heart" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Volunteer" 
        component={VolunteerSignUpScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="account-group" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Donate" 
        component={DonationScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="currency-usd" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="About Us" 
        component={AboutUsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="information-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Contact Us" 
        component={ContactUsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="phone" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Social Media" 
        component={SocialMediaScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="facebook" color={color} size={size} />
          ),
        }}
      />

      {isAdmin && (
        <Drawer.Screen 
          name="Admin Dashboard" 
          component={AdminDashboardScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="shield-account" color={color} size={size} />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
  );
}
