import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
  latitude: { 
    type: Number,
  },
  longitude: { 
    type: Number, 
  },
});

export const Location = mongoose.model('Location', locationSchema);