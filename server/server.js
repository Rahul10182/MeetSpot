import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from './config/database.js';
import userRoutes from "./routes/authRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Message } from './models/messageModel.js'; // Import for real-time chat

dotenv.config();
connectDB();

const app = express();
const server = createServer(app); // Create a server with express
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:5173'],  // Use env variable or localhost for CORS
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
  origin: [process.env.CLIENT_URL || 'http://localhost:5173'],  // CORS config
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/venue', venueRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/friends', friendRoutes);
app.use('/api/v1/message', messageRoutes);

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  // Join specific chat rooms for a user
  socket.on('joinChat', ({ chatId }) => {
    socket.join(chatId);
    console.log(`User joined chat: ${chatId}`);
  });

  // Listen for chat messages
  socket.on('chatMessage', async ({ chatId, senderId, content, timestamp }) => {
    try {
      // Save the message to the database
      const message = new Message({
        chat: chatId,
        sender: senderId,
        content: content,
        timestamp: timestamp,  // Now timestamp is passed correctly
      });

      await message.save();
      await message.populate('sender', '_id name');

      // Emit the message to the users in the same chat room
      socket.to(chatId).emit('newMessage', message);  // Consistent event name 'newMessage'
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
