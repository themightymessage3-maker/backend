// Script to ensure the admin user in the database has role: 'admin' and status: 'active'
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/docushop';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const result = await User.updateOne(
      { email: 'admin@example.com' },
      { $set: { role: 'admin', status: 'active' } }
    );
    console.log(`Admin user updated:`, result);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
