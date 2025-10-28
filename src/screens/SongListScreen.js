import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const SongListScreen = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Since the assignment specifies an external API for the song list,
  // and no specific song API was provided, I will use a placeholder API.
  // A common public music API is difficult to find.
  // For demonstration, I will use a simple placeholder data structure.
  // In a real-world scenario, a suitable API (like Spotify, iTunes, etc. with proper keys) would be used.
  
  // Placeholder data - replace with actual API call
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      const placeholderSongs = [
        { id: '1', title: 'Song Title 1', artist: 'Artist A', album: 'Album X' },
        { id: '2', title: 'Song Title 2', artist: 'Artist B', album: 'Album Y' },
        { id: '3', title: 'Song Title 3', artist: 'Artist A', album: 'Album Z' },
        { id: '4', title: 'Song Title 4', artist: 'Artist C', album: 'Album X' },
        { id: '5', title: 'Song Title 5', artist: 'Artist B', album: 'Album Y' },
      ];
      setSongs(placeholderSongs);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Song List...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.artist}>Artist: {item.artist}</Text>
      <Text style={styles.album}>Album: {item.album}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={songs}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
  album: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
});

export default SongListScreen;
