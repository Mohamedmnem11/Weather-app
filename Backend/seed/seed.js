// seed/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Episode = require('../models/Episode');
const Exam = require('../models/Exam');
const bcrypt = require('bcryptjs');

dotenv.config();

(async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Episode.deleteMany();
    await Exam.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    const admin = await User.create({ name: 'Admin', email: 'admin@example.com', passwordHash, role: 'admin' });
    const alice = await User.create({ name: 'Alice', email: 'alice@example.com', passwordHash });
    const bob = await User.create({ name: 'Bob', email: 'bob@example.com', passwordHash });

    const episode = await Episode.create({
      title: 'Episode 1 - Intro',
      description: 'مقدمة عن الدورة',
     videos: [
  { title: 'Video 1', url: '/videos/episode1.mp4', index: 0, durationSec: 60 },
  { title: 'Video 2', url: '/videos/episode2.mp4', index: 1, durationSec: 60 },
 
]
    });

    // exam for video index 0 - starts after 2 minutes
    const exam = await Exam.create({
      episodeId: episode._id,
      title: 'Exam for Video 1',
      startTime: new Date(Date.now() + 2 * 60 * 1000),
      durationMin: 10,
      passingScore: 60,
      questions: [
        { q: '2 + 2 = ?', options: ['3', '4', '5'], correctIndex: 1 },
        { q: 'Capital of France?', options: ['Paris', 'Berlin', 'Rome'], correctIndex: 0 }
      ]
    });

    console.log('Seed finished');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
