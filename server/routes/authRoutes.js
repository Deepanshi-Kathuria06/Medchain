const express = require('express');
const router = express.Router();
const User = require('../models/User'); // assuming path is correct

// NEW ROUTE ADDED (without modifying existing code)
router.get('/auth/me', async (req, res) => {
  try {
    // This assumes you're using some authentication middleware that sets req.user
    // If not, you'll need to implement authentication logic here
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ 
      username: user.username,
      email: user.email,
      walletAddress: user.walletAddress 
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error fetching user data' });
  }
});

// EXISTING CODE BELOW (unchanged)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already registered.' });
    }

    const user = new User({ username, email, password, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

router.patch('/user/wallet', async (req, res) => {
  const { username, email, walletAddress } = req.body;

  if ((!username && !email) || !walletAddress) {
    return res.status(400).json({ message: 'Username or email AND wallet address are required.' });
  }

  try {
    const query = username ? { username } : { email };

    const user = await User.findOneAndUpdate(
      query,
      { $set: { walletAddress } },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Wallet connected successfully', user });
  } catch (err) {
    console.error('Wallet update error:', err);

    if (err.code === 11000) {
      return res.status(409).json({ message: 'This wallet is already linked to another account.' });
    }

    res.status(500).json({ message: 'Server error while updating wallet' });
  }
});
// Add to your authRoutes.js
router.get('/user/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;