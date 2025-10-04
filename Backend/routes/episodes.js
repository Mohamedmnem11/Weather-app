const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Episode = require('../models/Episode');
const Progress = require('../models/Progress');
const Exam = require('../models/Exam');

// جلب كل الحلقات
router.get('/', async (req, res) => {
  try {
    const episodes = await Episode.find().select("title description createdAt");
    res.json({ episodes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تفاصيل حلقة
router.get('/:id', auth, async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) return res.status(404).json({ message: "Episode not found" });

    let progress = await Progress.findOne({ userId: req.user._id, episodeId: episode._id });
    if (!progress) progress = await Progress.create({ userId: req.user._id, episodeId: episode._id });

    const videos = episode.videos.map(v => ({
      title: v.title,
      url: v.url,
      index: v.index,
      unlocked: v.index <= progress.unlockedVideoIndex
    }));

    res.json({ episode, videos, progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// علامة انتهاء الفيديو وفتح التالي
router.post('/:id/videos/:videoIndex/complete', auth, async (req, res) => {
  try {
    const { id, videoIndex } = req.params;
    let progress = await Progress.findOne({ userId: req.user._id, episodeId: id });
    if (!progress) progress = await Progress.create({ userId: req.user._id, episodeId: id });

    if (!progress.watchedVideos.some(v => v.videoIndex === parseInt(videoIndex))) {
      progress.watchedVideos.push({ videoIndex: parseInt(videoIndex), watchedAt: new Date() });
      progress.unlockedVideoIndex = Math.max(progress.unlockedVideoIndex, parseInt(videoIndex) + 1);
      await progress.save();
    }

    res.json({ progress });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
