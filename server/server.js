import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  connectDB from './config/database.js';
import userRoutes from "./routes/authRoutes.js"
import venueRoutes from "./routes/venueRoutes.js"

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: 'https://localhost:4000', 
    credentials: true
};
app.use(cors(corsOptions));

//routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/venue', venueRoutes);

app.listen(PORT, () => {
    console.log(`Server Is Running On Port ${PORT}`);
});