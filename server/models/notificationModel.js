
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    firebaseID:{
        type:String,
        required:true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['event_registration', 'friend_request', 'reminder', 'other'],
        default: 'other'
    },
    readStatus: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification