const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/doctors/available
router.get('/doctors/available', async (req, res) => {
  try {
    const verifiedDoctors = await User.find({ role: 'doctor', isVerified: true, available: true }).select('username email');
    res.status(200).json(verifiedDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
});

module.exports = router;
