import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import  connectDB from './config/database.js';
import userRoutes from "./routes/authRoutes.js";
import venueRoutes from "./routes/venueRoutes.js";
import eventRoutes from "./routes/eventRouter.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import friendRoute from './routes/friendRoutes.js';
import userSearch from './routes/userSearchRoute.js'

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOptions = {
    origin: ['http://localhost:5173', 'https://localhost:5173'], 
    credentials: true
};
app.use(cors(corsOptions));

//routes
app.get('/', (req, res) => {
    res.send('Hello, backend is working!');
  });

app.use('/search', userSearch);
app.use('/authenticate', userRoutes);
app.use('/eventRegister', eventRoutes);
app.use('/friend', friendRoute);
app.use('/api/v1/venue', venueRoutes);
app.use('/api/v1/review', reviewRoutes);

app.listen(PORT, () => {
    console.log(`Server Is Running On Port ${PORT}`);
});
