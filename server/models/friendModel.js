import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    friend: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["pending", "accepted", "blocked"], 
        default: "pending" 
    },
    createdAt: { type: Date, default: Date.now }
});

export const Friend = mongoose.model("Friend", friendSchema);