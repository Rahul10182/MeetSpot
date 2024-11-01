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
            enum: ['Point'],  // This specifies the type of GeoJSON object
            required: true
        },
        coordinates: {  
            type: [Number],  // Array of numbers
            required: true
        }
    },
    address: String,
    
});

// Create a geospatial index on the location field
venueSchema.index({ location: '2dsphere' });

const Venue = mongoose.model('Venue', venueSchema);

export default Venue;