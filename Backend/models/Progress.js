const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  episodeId: { type: mongoose.Schema.Types.ObjectId, ref: "Episode" },
  unlockedVideoIndex: { type: Number, default: 0 },
  watchedVideos: [{ videoIndex: Number, watchedAt: Date }]
});

module.exports = mongoose.model("Progress", progressSchema);
