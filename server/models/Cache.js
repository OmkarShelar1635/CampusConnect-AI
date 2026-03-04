const mongoose = require("mongoose");

const cacheSchema = new mongoose.Schema({
  question: { type: String, unique: true },
  answer: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Cache", cacheSchema);