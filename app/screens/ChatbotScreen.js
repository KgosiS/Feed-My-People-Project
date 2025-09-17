import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  LayoutAnimation,
  UIManager,
} from 'react-native';
import { askGemini } from './geminiApi';
import { supabase } from '../lib/supabase';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function ChatBotPopup({ visible, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [contextData, setContextData] = useState('');

  useEffect(() => {
    if (visible) {
      setMessages([
        {
          type: 'bot',
          text: "Hey there! I'm your assistant. How can I help you today? 😊",
        },
      ]);
    }
  }, [visible]);

  useEffect(() => {
    const loadContext = async () => {
      try {
        const { data: about } = await supabase
          .from('organization_info')
          .select('*')
          .single();
        const { data: events } = await supabase
          .from('events')
          .select('title, event_date');

        const context = `
About: ${about?.description || 'No description available.'}
Upcoming events: ${
          events?.length
            ? events
                .map(
                  (e) =>
                    `${e.title} on ${new Date(e.event_date).toDateString()}`
                )
                .join(', ')
            : 'No upcoming events.'
        }
        `;
        setContextData(context);
      } catch (err) {
        console.error('Error loading context:', err);
      }
    };
    loadContext();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { type: 'user', text: input.trim() };

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const reply = await askGemini(userMessage.text, contextData);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [...prev, { type: 'bot', text: reply }]);
    } catch (error) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          text: 'Apologies, I am having a bit of trouble. Please try again later!',
        },
      ]);
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.message,
        item.type === 'user' ? styles.userMsg : styles.botMsg,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />
        <View style={styles.popupContainer}>
          <View style={styles.popupHeader}>
            <Text style={styles.title}>Your AI Assistant</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.chatListContainer}>
            <FlatList
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(_, i) => i.toString()}
              contentContainerStyle={{ paddingVertical: 12 }}
            />
          </View>

          <View style={styles.inputArea}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything..."
              placeholderTextColor="#FFB74D"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleSend}
              multiline
            />
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSend}
              disabled={!input.trim()}
            >
              <Ionicons
                name="send"
                size={22}
                color={input.trim() ? '#fff' : '#FFD580'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  popupContainer: {
    backgroundColor: '#fff8e1', // Welcome theme background
    borderRadius: 28,
    width: '90%',
    height: '85%', // bigger so user can read messages
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 12,
  },
  popupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF8600',
  },
  closeBtn: { padding: 5 },
  chatListContainer: {
    flex: 1,
    paddingHorizontal: 5,
    marginBottom: 14,
  },
  message: {
    padding: 14,
    borderRadius: 22,
    marginVertical: 6,
    maxWidth: '85%',
  },
  messageText: {
    fontSize: 17,
    lineHeight: 24,
  },
  userMsg: {
    backgroundColor: '#FFB74D',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
    color: '#fff',
  },
  botMsg: {
    backgroundColor: '#FF8600',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
    color: '#fff',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#FFD580',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff3e0',
    color: '#333',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    fontSize: 17,
    maxHeight: 130,
  },
  sendBtn: {
    marginLeft: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF8600',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
