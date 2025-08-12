import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },  
  contact: String,


  // ✅ Add favorite skills field
  favorites: {
    type: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    default: []
  }
});

export default mongoose.model('User', userSchema);
