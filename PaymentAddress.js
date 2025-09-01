const mongoose = require('mongoose');

const paymentAddressSchema = new mongoose.Schema({
  usdt: { type: String, default: '' },
  bitcoin: { type: String, default: '' },
  eth: { type: String, default: '' }
});

module.exports = mongoose.model('PaymentAddress', paymentAddressSchema);
