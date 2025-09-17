import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../lib/supabase';
import ChatBotScreen from './ChatbotScreen';
import { Ionicons } from '@expo/vector-icons';

export default function DonateScreen() {
  const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [chatVisible, setChatVisible] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', user.id)
          .single();

        if (!error && profile) setCardHolder(profile.name || '');
      }
    };
    fetchProfile();
  }, []);

  const handleDonate = async () => {
    if (!amount || !cardHolder || !cardNumber || !expiryMonth || !expiryYear || !cvv) {
      Alert.alert('Please fill all the fields');
      return;
    }

    const { data, error } = await supabase.from('donations').insert([
      {
        amount: parseFloat(amount),
        card_holder: cardHolder,
        card_last4: cardNumber.slice(-4),
        expiry: `${expiryMonth}/${expiryYear}`,
      },
    ]);

    if (error) {
      console.error(error);
      Alert.alert('Donation failed. Try again.');
    } else {
      navigation.navigate('ThankYou');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>DONATE</Text>

        <View style={styles.cardMock}>
          <Text style={styles.cardText}>**** **** **** {cardNumber.slice(-4) || '3947'}</Text>
          <View style={styles.cardDetails}>
            <Text style={styles.labelSmall}>{cardHolder || 'John Henry'}</Text>
            <Text style={styles.labelSmall}>{expiryMonth || '05'}/{expiryYear || '23'}</Text>
          </View>
        </View>

        <Text style={styles.subText}>Enter your payment details</Text>
        <Text style={styles.terms}>By continuing you agree to our Terms</Text>

        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          onChangeText={setAmount}
        />
        <TextInput
          style={[styles.input, { backgroundColor: '#eee' }]}
          placeholder="Card Holder"
          value={cardHolder}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="**** **** **** 3947"
          keyboardType="number-pad"
          onChangeText={setCardNumber}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="MM"
            keyboardType="number-pad"
            onChangeText={setExpiryMonth}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="YYYY"
            keyboardType="number-pad"
            onChangeText={setExpiryYear}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="123"
          keyboardType="number-pad"
          onChangeText={setCvv}
        />

        <TouchableOpacity style={styles.button} onPress={handleDonate}>
          <Text style={styles.buttonText}>DONATE</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Chatbot Button */}
      <TouchableOpacity
        style={styles.floatingBtn}
        onPress={() => setChatVisible(true)}
      >
        <Ionicons name="chatbubbles-outline" size={30} color="#fff" />
      </TouchableOpacity>

      {/* ChatBot Modal */}
      <ChatBotScreen visible={chatVisible} onClose={() => setChatVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#FFA726' },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  cardMock: {
    backgroundColor: '#2B2C3E',
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    color: 'white',
  },
  cardText: { color: '#fff', fontSize: 18 },
  cardDetails: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  labelSmall: { color: '#fff' },
  subText: { fontSize: 16 },
  terms: { fontSize: 12, marginBottom: 10 },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: { flexDirection: 'row', gap: 8 },
  button: {
    backgroundColor: '#FF6F00',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  floatingBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#d35400',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});
