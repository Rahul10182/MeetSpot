
import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Venue name is required'],
    trim: true,  
  },
  type: {
    type: String,
    required: [true, 'Venue type is required'],
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      required: true,
    },

    coordinates: {
      type: [Number],
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function (coords) {
          return coords.length === 2;  
        },
        message: 'Coordinates must contain exactly two values: [longitude, latitude]',
      },
    },
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
  lastVisited: {
    type: Date,
    default: null, 
  },
}, { timestamps: true });

venueSchema.index({ location: '2dsphere' });

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;
