import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    minlength: [1, 'Comment cannot be empty'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
    validate: {
      validator: function(v) {
        // Check if contains HTML tags or scripts
        return !/<[^>]*>/g.test(v) && !/script|javascript/gi.test(v);
      },
      message: 'Comment contains invalid content'
    }
  },
  skill: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Skill',
    required: [true, 'Skill reference is required']
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'User reference is required']
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Comment', commentSchema);