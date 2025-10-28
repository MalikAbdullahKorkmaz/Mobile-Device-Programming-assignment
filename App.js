import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native'; // Import Text for custom tab labels

// Import screens
import MovieListScreen from './src/screens/MovieListScreen';
import SongListScreen from './src/screens/SongListScreen';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Movies') {
              // Placeholder for an icon (e.g., a film reel or movie icon)
              // In a real app, you would use a library like react-native-vector-icons
              iconName = focused
                ? '🎬' // Film emoji for focused state
                : '🎥'; // Camera emoji for unfocused state
            } else if (route.name === 'Songs') {
              // Placeholder for a music icon
              iconName = focused ? '🎶' : '🎵'; // Musical note emojis
            }

            // You can return any component that you like here!
            return <Text style={{ fontSize: size, color: color }}>{iconName}</Text>;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Movies" component={MovieListScreen} />
        <Tab.Screen name="Songs" component={SongListScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
