import mongoose from 'mongoose';

const venueSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    location: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {  
            type: [Number], 
            required: true
        }
    },
    address: String,
},{timestamps:true});

venueSchema.index({ location: '2dsphere' });

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;