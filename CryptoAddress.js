const mongoose = require('mongoose');

const cryptoAddressSchema = new mongoose.Schema({
  bitcoin: { type: String, default: '' },
  ethereum: { type: String, default: '' },
  usdt: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CryptoAddress', cryptoAddressSchema);
