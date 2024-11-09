import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Venue name is required'],
    trim: true,  // Removes extra spaces
  },
  type: {
    type: String,
    required: [true, 'Venue type is required'],
    trim: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],  // GeoJSON type must be 'Point'
      required: true,
    },

    coordinates: {
      type: [Number],
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function (coords) {
          return coords.length === 2;  // Ensures array contains exactly [longitude, latitude]
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
    default: null,  // Default to null if not visited yet
  },
}, { timestamps: true });

venueSchema.index({ location: '2dsphere' });

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;
