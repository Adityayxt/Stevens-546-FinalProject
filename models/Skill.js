import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  title: String,
  category: String,
  description: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Skill', skillSchema);