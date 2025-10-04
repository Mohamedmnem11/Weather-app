const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  index: { type: Number, required: true },
  durationSec: { type: Number }
});

const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videos: [videoSchema]
}, { timestamps: true });

module.exports = mongoose.model("Episode", episodeSchema);
