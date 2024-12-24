const mongoose = require('mongoose');

// Define the schema for a famous event
const famousEventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
  },
  venue: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// Create the model
const FamousEvent = mongoose.model('FamousEvent', famousEventSchema);

module.exports = FamousEvent;