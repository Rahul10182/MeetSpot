import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fireBaseId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    fullName: { 
        type: String, 
        required: true 
    },
    reviews: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Review' 
    }],
    profile: {
        bio: { type: String },
        phoneNumber: { type: Number },
        venues: [{ type: mongoose.Schema.Types.ObjectId, 
            ref: 'Venue' }], 
        profilePhoto: { type: String, default: "" }
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    sentFriendRequests: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    }],
    events: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Event' 
    }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
