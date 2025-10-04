const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  q: { type: String },
  options: [String],
  correctIndex: { type: Number }
});

const examSchema = new mongoose.Schema({
  episodeId: { type: mongoose.Schema.Types.ObjectId, ref: "Episode" },
  videoIndex: { type: Number },
  title: String,
  startTime: Date,
  durationMin: Number,
  passingScore: Number,
  questions: [questionSchema]
});

module.exports = mongoose.model("Exam", examSchema);
