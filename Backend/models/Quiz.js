const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quizId: { type: String, required: true, unique: true },
  episodeId: { type: Number, required: true },
  questions: [
    {
      question: { type: String, required: true },
      options: [String],
      correctAnswer: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model('Quiz', quizSchema);