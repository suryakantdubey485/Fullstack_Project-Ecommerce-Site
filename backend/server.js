import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import Product from './models/Product.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    
    // Seed initial data if database is empty
    const count = await Product.countDocuments();
    if (count === 0) {
      const productsData = await fs.readFile(path.join(__dirname, 'data/products.json'), 'utf-8');
      const products = JSON.parse(productsData);
      await Product.insertMany(products);
      console.log('✅ Initial products seeded');
    }
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MERN E-Commerce API' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
