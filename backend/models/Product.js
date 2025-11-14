import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
});

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  images: [{ type: String }],
  rating: { type: Number, default: 0 },
  reviews: [reviewSchema]
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
