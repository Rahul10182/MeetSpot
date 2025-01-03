import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  connectDB from './config/database.js';
import userRoutes from "./routes/authRoutes.js"
import venueRoutes from "./routes/venueRoutes.js"
import eventRoutes from "./routes/eventRouter.js"
import friendRoute from "./routes/friendRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import notificationRoutes from "./routes/notificationRoutes.js"
import { Server } from "socket.io";

import { createServer } from "http";
import userSearch from "./routes/userSearchRoute.js";
import Message from "./models/messageModel.js"; 

import Chat from "./models/chatModel.js";
import notificationRoutes from "./routes/notificationRoutes.js"

dotenv.config();
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: [process.env.CLIENT_URL || 'http://localhost:5173'],  
  credentials: true,
};
app.use(cors(corsOptions));

app.use('/search', userSearch);
app.use('/api/v1/user', userRoutes);
app.use('/eventRegister', eventRoutes);
app.use('/friend', friendRoute);
app.use('/api/v1/venue', venueRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use("/notifications", notificationRoutes);

io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  socket.on('joinChat', ({ chatId }) => {
    socket.join(chatId);
    console.log('User joined chat: ${chatId}');
  });

  socket.on('chatMessage', async ({ chatId, senderId, content, timestamp }) => {
    try {
      const message = new Message({
        chat: chatId,
        sender: senderId,
        content: content,
        timestamp: timestamp,  
      });

      await message.save();
      await message.populate('sender', '_id name');


      await Chat.findByIdAndUpdate(chatId, {
        $set: { lastMessage: message._id },
        $push: { messages: message._id },
      });
  
  

      // Emit the message to the users in the same chat room
      socket.to(chatId).emit('newMessage', message);  // Consistent event name 'newMessage'
      
      socket.on('typing', ({ chatId, isTyping }) => {
        socket.to(chatId).emit('typing', { chatId, isTyping });
      });

    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  console.log('Server running on port ${PORT}');
});