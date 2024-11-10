import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  places: [],
};

const placesSlice = createSlice({
  name: 'places',
  initialState,
  reducers: {
    setPlaces: (state, action) => {
      state.places = action.payload; 
    },
    clearPlaces: (state) => {
      state.places = []; 
    },
  },
});

export const { setPlaces, clearPlaces } = placesSlice.actions;
export default placesSlice.reducer;
