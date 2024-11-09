// eventModel.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true,
  },
  eventType: {
    type: String,
    enum: ['Music', 'Party', 'Cultural', 'Technical', 'Other'],
    default: 'Music',
  },
  status: {
    type: String,
    enum: ['Planning', 'Confirmed', 'Completed'],
    default: 'Planning',
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  photoUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (v) {
        return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(v);
      },
      message: 'Please enter a valid URL for the photo.',
    },
  },
  description: {
    type: String,
    trim: true,
  },
  beginDate: {
    type: Date,
    required: true,
  },
  beginTime: {
    type: String,
    required: true,
    trim: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
    trim: true,
  },
  firebaseID: {
    type: String,
    required: true, 
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

export default Event;
