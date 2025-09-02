// Script to update all users in the database to have status: 'active'
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/docushop';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const result = await User.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'active' } }
    );
    console.log(`Updated ${result.nModified || result.modifiedCount} users to status: active`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
