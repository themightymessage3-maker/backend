const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    qty: Number,
    variant: String
  }],
  total: Number,
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  billingInfo: {
    name: String,
    address: String,
    city: String,
    country: String,
    zip: String,
    phone: String,
    email: String
  },
  paymentAddresses: {
    usdt: String,
    bitcoin: String,
    eth: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
