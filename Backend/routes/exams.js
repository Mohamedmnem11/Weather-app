const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get all exams (مثال)
router.get('/', auth, async (req, res) => {
  try {
    // افترض وجود نموذج Exam
    const exams = await Exam.find().select('title date').lean();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;