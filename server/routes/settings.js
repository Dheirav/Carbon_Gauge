const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Ensure your auth middleware is in place
const User = require('../models/User'); // Adjust the path to your User model if needed

// GET user settings
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Return the complianceThreshold from user's settings, defaulting to 10 if not set.
    const complianceThreshold = user.settings && typeof user.settings.complianceThreshold === 'number'
      ? user.settings.complianceThreshold
      : 10;
    res.json({ complianceThreshold });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH user settings to update complianceThreshold
router.patch('/', auth, async (req, res) => {
  try {
    const { complianceThreshold } = req.body;
    if (typeof complianceThreshold !== 'number') {
      return res.status(400).json({ message: 'complianceThreshold must be a number' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Initialize settings if not present and update complianceThreshold
    user.settings = user.settings || {};
    user.settings.complianceThreshold = complianceThreshold;
    await user.save();

    res.json({ complianceThreshold: user.settings.complianceThreshold });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 