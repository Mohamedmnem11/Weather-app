const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get leaderboard (مثال)
router.get('/', auth, async (req, res) => {
  try {
    // افترض وجود نموذج User مع حقل score
    const leaderboard = await User.find()
      .select('username score')
      .sort({ score: -1 })
      .limit(10)
      .lean();
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;