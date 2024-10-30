// locationSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  lat: null,
  lng: null,
  name: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action) => {
      state.lat = action.payload.lat;
      state.lng = action.payload.lng;
      state.name = action.payload.name;
    },
    clearLocation: (state) => {
      state.lat = null;
      state.lng = null;
      state.name = null;
    },
  },
});

export const { setLocation, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
