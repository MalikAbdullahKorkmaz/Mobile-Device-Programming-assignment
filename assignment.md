# Mobile Device Programming - Assignment

## Case: Implement tabbar and add song list on the second tab

**Name:** Abdullah Malik Korkmaz
**NIM/CLASS:** 20230040342/TI23T

### Changes Implemented:

1.  **Tab Bar Navigation:** Confirmed and utilized the existing `createBottomTabNavigator` in `App.js` to switch between the "Movies" and "Songs" tabs.
2.  **Movie List:** The "Movies" tab (`MovieListScreen.js`) continues to fetch and display data from the Ghibli Films API: `https://ghibliapi.vercel.app/films`.
3.  **Song List Implementation:**
    *   The "Songs" tab (`src/screens/SongListScreen.js`) was modified to fetch data from an external API, as requested.
    *   Since a specific public song API was not provided, the Ghibli API's **Locations** endpoint (`https://ghibliapi.vercel.app/locations`) was used as a placeholder to demonstrate the external API integration requirement.
    *   The data fields were mapped for display purposes:
        *   `item.name` -> Song Title
        *   `item.climate` -> Climate (used as Artist placeholder)
        *   `item.terrain` -> Terrain (used as Album placeholder)

### Files Modified:

*   `src/screens/SongListScreen.js`: Updated to fetch data from `https://ghibliapi.vercel.app/locations` and display the list.
*   `assignment.md`: This file.
