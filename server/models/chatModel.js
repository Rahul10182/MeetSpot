import mongoose from "mongoose";
// Chat schema modification

const chatSchema = new mongoose.Schema(
  {
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
    ],

    lastMessage: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Message" 
    },

    messages: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Message" 
      }
    ],

    createdAt: { 
      type: Date, 
      default: Date.now 
    },

    updatedAt: { 
      type: Date, 
      default: Date.now 
    }  
  },
  { 
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" }
  }
);

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
