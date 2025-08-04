import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { supabase } from '../lib/supabase';

// Screens
import BlogListScreen from '../screens/BlogListScreen';
import GalleryScreen from '../screens/GalleryScreen';
import DonationScreen from '../screens/DonationScreen';
import VolunteerSignUpScreen from '../screens/VolunteerSignUpScreen';
import NewGalleryPostScreen from '../screens/NewGalleryPostScreen';
import HomeScreen from '../screens/HomeScreen';
import BlogDetailScreen from '../screens/BlogDetailScreen';
import AboutUsScreen from '../screens/AboutUsScreen';
import ContactUsScreen from '../screens/ContactUsScreen';

// Admin Screens
import ManageBlogPostsScreen from '../screens/ManageBlogPostsScreen';
import ManageEventsScreen from '../screens/ManageEventsScreen';
import CreateBlogScreen from '../screens/CreateBlogScreen';
import ManageUsersScreen from '../screens/ManageUserScreen';
import ViewDonationsScreen from '../screens/ViewDonations';
import CreateOutreachScreen from '../screens/CreateOutreachScreen';
import SocialMediaScreen from '../screens/SocialMediaScreen';
import ExportReportScreen from '../screens/ExportScreen';
import OutreachScreen from '../screens/OutReachProgramScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Blog Stack
function BlogStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BlogList" component={BlogListScreen} options={{ title: 'Blog' }} />
      <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
      <Stack.Screen name="CreateBlog" component={CreateBlogScreen} />
    </Stack.Navigator>
  );
}

// Gallery Stack
function GalleryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Gallery" component={GalleryScreen} />
      <Stack.Screen name="NewGalleryPost" component={NewGalleryPostScreen} />
    </Stack.Navigator>
  );
}

// Admin Stack
function AdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
      <Stack.Screen name="ManageBlogPosts" component={ManageBlogPostsScreen} />
      <Stack.Screen name="ManageEvents" component={ManageEventsScreen} />
      <Stack.Screen name="ViewDonations" component={ViewDonationsScreen} />
      <Stack.Screen name="ExportReport" component={ExportReportScreen} />
      <Stack.Screen name="CreateOutreach" component={CreateOutreachScreen} />
    </Stack.Navigator>
  );
}

export default function TabNavigator() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching admin status:', error);
      } else {
        setIsAdmin(data?.role === 'admin');
      }
      setLoading(false);
    };

    checkAdmin();
  }, []);

  if (loading) return null;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Blog':
              iconName = 'document-text-outline';
              break;
            case 'Gallery':
              iconName = 'images-outline';
              break;
            case 'Donate':
              iconName = 'heart-outline';
              break;
            case 'Volunteer':
              iconName = 'people-outline';
              break;
            case 'About':
              iconName = 'information-circle-outline';
              break;
            case 'Contact':
              iconName = 'mail-outline';
              break;
            case 'Outreach':
              iconName = 'megaphone-outline';
              break;
            case 'SocialMedia':
              iconName = 'logo-instagram';
              break;
            case 'Admin':
              iconName = 'settings-outline';
              break;
            default:
              iconName = 'ellipse-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#FFA500',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Blog" component={BlogStack} />
      <Tab.Screen name="Gallery" component={GalleryStack} />
      <Tab.Screen name="Donate" component={DonationScreen} />
      <Tab.Screen name="Volunteer" component={VolunteerSignUpScreen} />
      <Tab.Screen name="About" component={AboutUsScreen} />
      <Tab.Screen name="Contact" component={ContactUsScreen} />
      <Tab.Screen name="SocialMedia" component={SocialMediaScreen} /> {/* ✅ Unique name */}
      <Tab.Screen name="Outreach" component={OutreachScreen} /> {/* ✅ Unique name */}

      {isAdmin && (
        <Tab.Screen name="Admin" component={AdminStack} />
      )}
    </Tab.Navigator>
  );
}
