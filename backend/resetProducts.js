import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Product from './models/Product.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

async function resetProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete all existing products
    await Product.deleteMany({});
    console.log('🗑️  Deleted all existing products');

    // Read products from JSON file
    const productsData = await fs.readFile(path.join(__dirname, 'data/products.json'), 'utf-8');
    const products = JSON.parse(productsData);

    // Insert new products
    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} new products`);

    console.log('\n🎉 Database reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetProducts();
