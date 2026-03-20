
import mongoose from "mongoose"
const cacheSchema = new mongoose.Schema({
  question: { type: String, unique: true },
  answer: String,
  createdAt: { type: Date, default: Date.now }
});

export default  mongoose.model("Cache", cacheSchema);
