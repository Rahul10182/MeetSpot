// placesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  places: [],
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    setPlaces: (state, action) => {
      state.places = action.payload; // Set the array of places
    },
    clearPlaces: (state) => {
      state.places = []; // Clear the places
    },
  },
});

export const { setPlaces, clearPlaces } = placesSlice.actions;
export default placesSlice.reducer;
