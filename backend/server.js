import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import canteenRoutes from './routes/canteenRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors({
  origin: [
    "https://online-food-ordering-system-dusky.vercel.app",
    "https://online-food-ordering-system-mwxrwsm2b.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.options("*", cors());

// Routes
app.get('/', (req, res) => {
    res.send('Smart Canteen API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/canteens', canteenRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

