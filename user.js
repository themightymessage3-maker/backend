const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  billingInfo: {
    name: String,
    address: String,
    city: String,
    country: String,
    zip: String,
    phone: String,
    email: String
  }
});

module.exports = mongoose.model('User', userSchema);
