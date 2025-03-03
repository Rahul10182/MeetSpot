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
  reviews: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review' 
    }
],
meetings: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Meeting'
    }
],
visitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
}
}, { timestamps: true });

venueSchema.index({ location: '2dsphere' });

export default mongoose.model('Venue', venueSchema);

