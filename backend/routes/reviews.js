import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// Get reviews for a product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product.reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review
router.post('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ id: parseInt(req.params.id) });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    product.reviews.push(req.body);
    
    // Calculate new average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;
    
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
