const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');
const Episode = require('../models/Episode');
const Joi = require('joi');

const progressUpdateSchema = Joi.object({
  episodeId: Joi.string().required(),
  unlockedVideoIndex: Joi.number().integer().min(0).required(),
});

// Update progress
router.put('/', auth, async (req, res) => {
  try {
    const { error } = progressUpdateSchema.validate(req.body);
    if (error) return res.status(400).json({ message: 'Invalid input', error: error.details });

    const { episodeId, unlockedVideoIndex } = req.body;
    const episode = await Episode.findById(episodeId);
    if (!episode) return res.status(404).json({ message: 'Episode not found' });

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, episodeId },
      { unlockedVideoIndex },
      { new: true, lean: true }
    );

    if (!progress) return res.status(404).json({ message: 'Progress not found' });

    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;