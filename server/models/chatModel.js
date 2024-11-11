import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  participants: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    }
  ],  // Only two participants for a one-to-one chat
  lastMessage: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Message" 
  },  // Reference to the last message sent
  createdAt: { 
    type: Date, 
    default: Date.now 
  },  // When the chat was created'
  updatedAt: { 
    type: Date, 
    default: Date.now 
  },  // When the chat was last updated
});

export const Chat = mongoose.model("Chat", chatSchema);
