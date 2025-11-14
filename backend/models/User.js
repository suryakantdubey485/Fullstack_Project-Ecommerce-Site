import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String, required: true },
  fullAddress: { type: String, required: true },
  phone: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  addresses: [addressSchema]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
