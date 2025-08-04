import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { supabase } from '../lib/supabase';

// General Screens
import HomeScreen from '../screens/HomeScreen';
import BlogListScreen from '../screens/BlogListScreen';
import GalleryScreen from '../screens/GalleryScreen';
import DonationScreen from '../screens/DonationScreen';
import VolunteerSignUpScreen from '../screens/VolunteerSignUpScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import ContactUsScreen from '../screens/ContactUsScreen';
import SocialMediaScreen from '../screens/SocialMediaScreen';
import OutReachProgramScreen from '../screens/OutReachProgramScreen';

// Admin Screens
import ManageUsersScreen from '../screens/ManageUserScreen';
import ManageBlogPostsScreen from '../screens/ManageBlogPostsScreen';
import ManageEventsScreen from '../screens/ManageEventsScreen';
import ViewDonationsScreen from '../screens/ViewDonations';
import ExportReportScreen from '../screens/ExportScreen';
import CreateOutreachScreen from '../screens/CreateOutreachScreen';
import CreateBlogScreen from '../screens/CreateBlogScreen';
import NewGalleryPostScreen from '../screens/NewGalleryPostScreen';
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
        headerShown: true,
      
        drawerActiveTintColor: '#BF6B00',
      }}
    >
      
      <Drawer.Screen name="Blog" component={BlogListScreen} />
      <Drawer.Screen name="Gallery" component={GalleryScreen} />
      <Drawer.Screen name="Events" component={EventsScreen} />
      <Drawer.Screen name="Outreach" component={OutReachProgramScreen} />
      <Drawer.Screen name="Volunteer" component={VolunteerSignUpScreen} />
      <Drawer.Screen name="Donate" component={DonationScreen} />
      <Drawer.Screen name="About Us" component={AboutUsScreen} />
      <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
      <Drawer.Screen name="Social Media" component={SocialMediaScreen} />
      

      {/* Only include admin screens directly, no fragments */}
      {isAdmin && (
        <Drawer.Screen name="Admin Dashboard" component={AdminDashboardScreen} />
      )}
    
    </Drawer.Navigator>
  );
}
