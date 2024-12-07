import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (coords) {
          return coords.length === 2;  
        },
        message: 'Coordinates must have exactly two values [longitude, latitude]',
      },
    },
  },
  address: { type: String, required: true, trim: true },
  lastVisited: { type: Date, default: null },
  // Adjust 'time' to store as Date if possible or use a more structured string
  
  photo: { 
    type: String, 
    default: "", 
    validate: {
      validator: function (value) {
        return value === "" || /^(http|https):\/\/[^ "]+$/.test(value); 
      },
      message: 'Invalid URL format for photo',
    },
  },
  // Use a Date field for `date`, which allows combining with `time` easily
  date: { 
    type: Date, 
    required: true,
    // Automatically handle date-time validation
    set: function(value) {
      // This can be customized based on how you're combining the date and time in the application
      return new Date(value);
    }
  },
  user: { type: String, ref: 'User', required: true },
  friend: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

venueSchema.index({ location: '2dsphere' });
venueSchema.index({ firebaseId: 1, friendFirebaseId: 1 }); // Compound index

export default mongoose.model('Venue', venueSchema);
