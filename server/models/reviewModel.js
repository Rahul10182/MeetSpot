import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    venue: {  
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Venue', 
        required: true 
    },
    rating: { 
        type: Number, 
        required: true, 
        min: 1, 
        max: 5 },
    comment: { type: String },
}, { timestamps: true });

export const Review = mongoose.model('Review', reviewSchema);