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
import notifcationRoutes from "./routes/notificationRoutes.js"
import { Server } from "socket.io";

import { createServer } from "http";
import userSearch from "./routes/userSearchRoute.js";
import Message from "./models/messageModel.js"; 
import Chat from "./models/chatModel.js";
import notificationRoutes from "./routes/notificationRoutes.js"
import messageRoutes from "./routes/messageRoutes.js"
import mailRoutes from "./routes/mailRoutes.js"
import meetingRoutes from "./routes/meetingRoutes.js"

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
  origin: [process.env.CLIENT_URL || 'http://localhost:5173'],  
  credentials: true,
};
app.use(cors(corsOptions));

// Routes
app.use('/search', userSearch);
app.use('/api/v1/user', userRoutes);
app.use('/eventRegister', eventRoutes);
app.use('/friend', friendRoute);
app.use('/api/v1/venue', venueRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use("/notifications", notificationRoutes);
app.use('/api/v1/mail', mailRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/meeting', meetingRoutes);



server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});