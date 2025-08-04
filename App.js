import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/screens/Login';
import SignUpScreen from './app/screens/SignUpScreen';
import WelcomeScreen from './app/screens/WelcomeScreen';
import ProfileCompletionScreen from './app/screens/ProfileCompletionScreen';
import DrawerNavigator from './app/navigation/DrawerNavigator';
import HomeScreen from './app/screens/HomeScreen';
import ManageUsersScreen from './app/screens/ManageUserScreen';
import ManageEventsScreen from './app/screens/ManageEventsScreen';
import ManageBlogPostsScreen from './app/screens/ManageBlogPostsScreen';
import DonationScreen from './app/screens/DonationScreen';
import NewGalleryPostScreen from './app/screens/NewGalleryPostScreen';
import CreateBlogScreen from './app/screens/CreateBlogScreen';
import CreateOutreachScreen from './app/screens/CreateOutreachScreen';
import ExportReportScreen from './app/screens/ExportScreen';
import ManageGalleryScreen from './app/screens/ManageGalleryScreen';
import ThankYouScreen from './app/screens/ThankYouScreen';
import AllDonationsScreen from './app/screens/AllDonationsScreen';
import AllVolunteersScreen from './app/screens/AllVolunteersScreen';
import AllMessagesScreen from './app/screens/AllMessagesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="ProfileCompletion" component={ProfileCompletionScreen} />
        <Stack.Screen name="Main" component={DrawerNavigator} />
        <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
        <Stack.Screen name="ManageEvents" component={ManageEventsScreen} />
        <Stack.Screen name="ManageBlogPosts" component={ManageBlogPostsScreen} />
        <Stack.Screen name="ViewDonations" component={DonationScreen} />
        <Stack.Screen name="AddGalleryPost" component={NewGalleryPostScreen} />
        <Stack.Screen name="AddBlogPost" component={CreateBlogScreen} />
        <Stack.Screen name="CreateOutreach" component={CreateOutreachScreen} />
        <Stack.Screen name="ManageGallery" component={ManageGalleryScreen} />
        <Stack.Screen name="AllDonations" component={AllDonationsScreen} />
        <Stack.Screen name="AllVolunteers" component={AllVolunteersScreen} />
        <Stack.Screen name="AllMessages" component={AllMessagesScreen} />
        <Stack.Screen name="ThankYou" component={ThankYouScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
