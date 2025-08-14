import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9]+$/, 'Username can only contain letters and numbers']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [4, 'Password must be at least 4 characters']
  },
  email: { 
    type: String, 
    unique: true,
    required: [true, 'Email is required'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  contact: String,
  favorites: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    default: []
  }
});

export default mongoose.model('User', userSchema);
