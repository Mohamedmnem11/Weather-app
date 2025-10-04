const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Progress = require('../models/Progress');

router.post('/episodes/:episodeId/videos/:videoIndex/quiz', auth, async (req, res) => {
  const { episodeId, videoIndex } = req.params;
  const { passed } = req.body;

  if (!passed) return res.status(400).json({ message: 'Failed quiz' });

  let progress = await Progress.findOne({ userId: req.user._id, episodeId });
  if (!progress) progress = await Progress.create({ userId: req.user._id, episodeId });

  if (videoIndex >= progress.unlockedVideoIndex) {
    progress.unlockedVideoIndex = parseInt(videoIndex) + 1;
    await progress.save();
  }

  res.json({ progress });
});

module.exports = router;
