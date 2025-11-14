import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  user: { type: String, required: true },
  items: [{
    product_id: { type: Number, required: true },
    name: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  total_amount: { type: Number, required: true },
  status: { type: String, default: 'Pending', enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'] },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] },
  address: String,
  phone: String,
  paymentMethod: String
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
