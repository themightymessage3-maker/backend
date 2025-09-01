const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  discreet: { type: Number, default: 30.00 },
  express: { type: Number, default: 50.00 }
});

module.exports = mongoose.model('Shipping', shippingSchema);
