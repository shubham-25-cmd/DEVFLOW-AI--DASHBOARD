import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import repoRoutes from './routes/repoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/devflow')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/repos', repoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DevFlow API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
