// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// مكان تخزين الفيديوهات
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/videos'); // هيتخزن في backend/public/videos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// رفع فيديو واحد
router.post('/video', upload.single('video'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  res.json({ url: `/videos/${req.file.filename}` });
});

module.exports = router;
