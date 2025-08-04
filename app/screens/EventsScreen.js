import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, Image,
  TouchableOpacity, ActivityIndicator, ScrollView,
} from 'react-native';
import { supabase } from '../lib/supabase';

export default function EventsScreen() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    const now = new Date().toISOString();

    const [upcoming, past] = await Promise.all([
      supabase.from('events').select('*').gte('event_date', now).order('event_date', { ascending: true }),
      supabase.from('events').select('*').lt('event_date', now).order('event_date', { descending: true }),
    ]);

    if (upcoming.error || past.error) {
      console.error('Error fetching events:', upcoming.error || past.error);
    } else {
      setUpcomingEvents(upcoming.data);
      setPastEvents(past.data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    const intervalId = setInterval(fetchEvents, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (dateString) => new Date(dateString).toDateString();

  const renderEventCard = ({ item }) => (
    <View style={styles.card}>
      {item.image_url && (
        <Image
          source={{ uri: item.image_url || 'https://via.placeholder.com/300x150?text=No+Image' }}
          style={styles.image}
        />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.meta}>
          {formatDate(item.event_date)}   Admin   💬 3
        </Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.timeVenue}>
          🕒 {item.start_time} - {item.end_time}   🗺️ Venue: {item.location}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
        <TouchableOpacity>
          <Text style={styles.link}>Join Event ➤</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFA500" />
      ) : upcomingEvents.length > 0 ? (
        <FlatList
          data={upcomingEvents}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventCard}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.empty}>No upcoming events.</Text>
      )}

      <Text style={[styles.header, { marginTop: 30 }]}>Past Events</Text>
      {loading ? (
        <ActivityIndicator size="small" color="#FF6347" />
      ) : pastEvents.length > 0 ? (
        <FlatList
          data={pastEvents}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventCard}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.empty}>No past events yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f0',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FF8600',
    marginBottom: 10,
  },
  card: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardContent: {
    padding: 5,
  },
  meta: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  timeVenue: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  link: {
    color: '#FF8600',
    fontWeight: 'bold',
    marginTop: 5,
  },
  empty: {
    color: '#888',
    fontStyle: 'italic',
    marginLeft: 10,
  },
});
      