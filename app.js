import express from 'express';
import session from 'express-session';
import methodOverride from 'method-override';
import MongoStore from 'connect-mongo';
import mongoose from './config/mongoConnection.js';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}));

// Static files
app.use('/html', express.static(path.join(__dirname, 'html')));

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import skillsRouter from './routes/skills.js';
import profileRouter from './routes/profile.js';
import { requireAuth, requireAuthAPI } from './middleware/authMiddleware.js';
import Skill from './models/Skill.js';
import User from './models/User.js';
import Comment from './models/Comment.js';  // Add this line

// API Routes
app.get('/api/skills', requireAuthAPI, async (req, res) => {
  try {
    const category = req.query.category;
    let skills;
    if (category) {
      skills = await Skill.find({ category }).populate('postedBy').sort({ createdAt: -1 });
    } else {
      skills = await Skill.find().populate('postedBy').sort({ createdAt: -1 });
    }
    
    res.json({ skills, user: req.session.user });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// API endpoint for skill details
app.get('/api/skills/:id', requireAuthAPI, async (req, res) => {
  try {
    const skillId = req.params.id;
    const userId = req.session.user._id;
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(skillId)) {
      return res.status(400).json({ error: 'Invalid skill ID format' });
    }

    const skill = await Skill.findById(skillId).populate('postedBy', 'username contact');
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    const comments = await Comment.find({ skill: skillId })
      .populate('postedBy', 'username')
      .sort({ createdAt: 1 });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isFavorited = user.favorites.includes(skillId);
    const favoriteCount = await User.countDocuments({ favorites: skillId });

    res.json({
      skill,
      user: req.session.user,
      isFavorited,
      favoriteCount,
      comments
    });
  } catch (error) {
    console.error('Error fetching skill details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for user's skills
app.get('/api/profile/myskills', requireAuthAPI, async (req, res) => {
  try {
    const skills = await Skill.find({ postedBy: req.session.user._id })
      .sort({ createdAt: -1 });

    res.json({ skills, user: req.session.user });
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for user's favorite skills
app.get('/api/profile/favorites', requireAuthAPI, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate({
      path: 'favorites',
      populate: {
        path: 'postedBy',
        select: 'username'
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ favorites: user.favorites || [], user: req.session.user });
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for user profile
app.get('/api/profile/me', requireAuthAPI, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const skills = await Skill.find({ postedBy: user._id }).sort({ createdAt: -1 });

    res.json({ user, skills });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/skills', skillsRouter);
app.use('/profile', profileRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));