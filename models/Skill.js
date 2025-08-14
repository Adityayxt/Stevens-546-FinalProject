import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Skill title is required'],
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    match: [/^[\u4e00-\u9fa5a-zA-Z0-9\s\-\&\./]+$/, 'Title contains invalid characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'Languages & Translation',
        'Academics & Tutoring', 
        'Programming & Technology',
        'Design & Creativity',
        'Music, Performing Arts & Writing',
        'Business, Marketing & Management',
        'Cooking & Culinary Arts',
        'Fitness, Sports & Wellness',
        'Lifestyle, Travel & Outdoor Activities',
        'Finance & Investment',
        'Other'
      ],
      message: 'Please select a valid category'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [1, 'Description cannot be empty'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  postedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Posted by user is required']
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Skill', skillSchema);