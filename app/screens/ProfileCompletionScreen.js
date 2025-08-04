// screens/ProfileCompletionScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { Picker } from '@react-native-picker/picker';
import DropDownPicker from 'react-native-dropdown-picker';

export default function ProfileCompletionScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: 'Select Role', value: '' },
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ]);

  const handleSave = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  const updates = {
    id: user.id,
    name: fullName,
    email: user.email,  // <-- Add this
    phone,
    role,
  
  };

  const { error } = await supabase.from('profiles').upsert(updates);

  if (error) {
    Alert.alert('Update failed', error.message);
  } else {
    Alert.alert('Profile updated!');
    navigation.replace('Main'); // or 'Main'
  }
};



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>

      <TextInput
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        placeholderTextColor="#666"
      />

      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
        placeholderTextColor="#666"
      />

      <View >
     <DropDownPicker
        open={open}
        value={role}
        items={items}
        setOpen={setOpen}
        setValue={setRole}
        setItems={setItems}
        style={styles.picker}
        dropDownContainerStyle={styles.dropdown}
        placeholder="Select Role"
      />

      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff',
  },
  title: {
    fontSize: 26, fontWeight: 'bold', marginBottom: 28, textAlign: 'center', color: '#228B22',
  },
  input: {
    borderWidth: 1,
    borderColor: '#228B22',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#228B22',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
    color: '#000',
  },
  button: {
    backgroundColor: '#228B22',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold', fontSize: 16,
  },
});
