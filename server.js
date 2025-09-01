require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.json());
app.use(cors());

// Health check
app.get('/', (req, res) => {
  res.send('DocuShop backend is running');
});

const User = require('./user');

// Update admin login details
app.put('/users/admin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    // Find admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      return res.status(404).json({ error: 'Admin user not found' });
    }
    admin.email = email;
    admin.password = password; // In production, hash the password!
    await admin.save();
    res.json({ message: 'Admin login details updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User registration
app.post('/users/register', async (req, res) => {
  try {
    const { firstname, lastname, username, email, phone, password } = req.body;
    if (!firstname || !lastname || !username || !email || !phone || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstname,
      lastname,
      username,
      email,
      phone,
      password: hashedPassword,
      role: 'user',
      status: 'active'
    });
    await user.save();
    res.json({ message: 'Registration successful', user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Incorrect password' });
    }
    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Account not active' });
    }
    res.json({ message: 'Login successful', user: { id: user._id, email: user.email, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// TODO: Add routes for products, cart, orders, shipping, billing, and authentication

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/docushop';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));
