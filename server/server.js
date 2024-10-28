const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./config/database')

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//routes
const locationRoutes = require('./routes/locationRoutes');
app.use('/api/v1', locationRoutes);

app.listen(PORT, () => {
    console.log(`Server Is Running On Port ${PORT}`);
});
