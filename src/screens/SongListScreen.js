import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const SongListScreen = () => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Using the Ghibli API's locations endpoint as a placeholder for a song list,
  // as a specific song API was not provided. The API structure is similar to the movie list.
  
  
  
  

  useEffect(() => {
    fetch('https://ghibliapi.vercel.app/locations')
      .then(response => response.json())
      .then(data => {
        // Renaming to 'songs' for consistency with the component's state
        setSongs(data.map(item => ({
          id: item.id,
          title: item.name, // Using 'name' as 'title'
          artist: item.climate, // Using 'climate' as 'artist'
          album: item.terrain, // Using 'terrain' as 'album'
        })));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching songs/locations:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Song List (Locations API)...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.artist}>Climate: {item.artist}</Text>
      <Text style={styles.album}>Terrain: {item.album}</Text>
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
