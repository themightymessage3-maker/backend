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
const CryptoAddress = require('./CryptoAddress');

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
      status: 'active' // Ensure user is active on registration
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
    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        status: user.status
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get crypto addresses
app.get('/crypto-addresses', async (req, res) => {
  try {
    let addresses = await CryptoAddress.findOne();
    if (!addresses) {
      addresses = new CryptoAddress();
      await addresses.save();
    }
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update crypto addresses
app.put('/crypto-addresses', async (req, res) => {
  try {
    const { bitcoin, ethereum, usdt } = req.body;
    let addresses = await CryptoAddress.findOne();
    if (!addresses) {
      addresses = new CryptoAddress({ bitcoin, ethereum, usdt });
    } else {
      addresses.bitcoin = bitcoin;
      addresses.ethereum = ethereum;
      addresses.usdt = usdt;
      addresses.updatedAt = Date.now();
    }
    await addresses.save();
    res.json({ message: 'Crypto addresses updated', addresses });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// TEMPORARY: Create admin user route (remove after use)
app.post('/create-admin', async (req, res) => {
  try {
    const { username = 'admin', email = 'admin@example.com', password = 'admin123' } = req.body;
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin user already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });
    await admin.save();
    res.json({ message: 'Admin user created', admin: { id: admin._id, email: admin.email, username: admin.username } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// --- Product Routes ---
const Product = require('./Product');
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, description, price, image, category, variants, available } = req.body;
    const product = new Product({ name, description, price, image, category, variants, available });
    await product.save();
    res.json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ error: 'Error uploading product' });
  }
});

// --- Order Routes ---
const Order = require('./Order');
app.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { user, products, total, billingInfo, paymentAddresses } = req.body;
    const order = new Order({ user, products, total, billingInfo, paymentAddresses });
    await order.save();
    res.json({ message: 'Order placed', order });
  } catch (err) {
    res.status(500).json({ error: 'Error placing order' });
  }
});

// Cancel order endpoint
app.patch('/orders/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order cancelled', order });
  } catch (err) {
    res.status(500).json({ error: 'Error cancelling order' });
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/docushop';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));


