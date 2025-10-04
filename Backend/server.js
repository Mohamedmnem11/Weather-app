// server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { Server } = require('socket.io');

dotenv.config();
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/episodes', require('./routes/episodes'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/exams', require('./routes/exams'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/profile', require('./routes/profile'));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || '*' } });
app.use('/videos', express.static('videos'));

// socket auth (optional)
io.use((socket, next) => {
  // optionally implement token auth here
  next();
});

io.on('connection', socket => {
  console.log('Socket connected', socket.id);

  socket.on('joinExam', ({ examId }) => {
    if (!examId) return;
    socket.join(`exam_${examId}`);
    console.log('Socket joined exam room', examId);
  });

  socket.on('leaveExam', ({ examId }) => {
    if (!examId) return;
    socket.leave(`exam_${examId}`);
    console.log('Socket left exam room', examId);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id);
  });
});

// schedule exams
const { scheduleAll } = require('./utils/examScheduler');

(async () => {
  try {
    await connectDB();
    scheduleAll(io);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Startup error:', err.message);
    process.exit(1);
  }
})();
