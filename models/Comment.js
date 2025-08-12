import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: String,
  skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Comment', commentSchema);