import express from 'express';
import Skill from '../models/Skill.js';
import Comment from '../models/Comment.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { sanitizeInput } from '../middleware/validationMiddleware.js';
import { validateSkill, validateComment } from '../utils/validator.js';
import User from '../models/User.js';

const router = express.Router();

// ✅ Skills marketplace (with category filtering)
router.get('/', async (req, res) => {
  const category = req.query.category;
  // Fixed category order to match skillNew.ejs
  const categories = [
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
  ];

  let skills;
  if (category) {
    skills = await Skill.find({ category }).populate('postedBy').sort({ createdAt: -1 });
  } else {
    skills = await Skill.find().populate('postedBy').sort({ createdAt: -1 });
  }

  res.render('pages/skills', {
    skills,
    user: req.session.user,
    categories,
    currentCategory: category || ''
  });
});

// ✅ New skill page (note: this must be placed before :id!)
router.get('/new', requireAuth, (req, res) => {
  res.render('pages/skillNew', {
    formData: {},
    errors: []
  });
});

// ✅ Create new skill
router.post('/', requireAuth, sanitizeInput, async (req, res) => {
  const { title, category, description } = req.body;
  
  // Validate skill data
  const validation = validateSkill({ title, category, description });
  
  if (!validation.isValid) {
    return res.render('pages/skillNew', {
      formData: { title, category, description },
      errors: validation.errors
    });
  }
  
  try {
  
    const skill = new Skill({
      title: validation.cleanedData.title,
      category: validation.cleanedData.category,
      description: validation.cleanedData.description,
      postedBy: req.session.user._id
    });
    await skill.save();
    res.redirect('/skills');
  } catch (error) {
    console.error('Error creating skill:', error);
    res.render('pages/skillNew', {
      formData: { title, category, description },
      errors: ['An error occurred while creating the skill. Please try again.']
    });
  }
});

// ✅ Comment (AJAX)
router.post('/:id/comment', requireAuth, sanitizeInput, async (req, res) => {
  const { content } = req.body;
  
  // Validate comment data
  const validation = validateComment({ content });
  
  if (!validation.isValid) {
    return res.status(400).json({ 
      success: false, 
      errors: validation.errors 
    });
  }
  
  try {
    const comment = new Comment({
      content: content.trim(),
      postedBy: req.session.user._id,
      skill: req.params.id
    });
    await comment.save();
    res.json({ success: true, comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ 
      success: false, 
      errors: ['An error occurred while posting the comment. Please try again.'] 
    });
  }
});

// ✅ Favorite/unfavorite skill
router.post('/:id/favorite', requireAuth, async (req, res) => {
  const skillId = req.params.id;
  const user = await User.findById(req.session.user._id);

  if (!user) {
    // Update the redirect path to the correct login route
    return res.redirect('/auth/login');
  }

  // Ensure favorites array exists
  if (!user.favorites) {
    user.favorites = [];
  }

  const index = user.favorites.indexOf(skillId);

  if (index === -1) {
    user.favorites.push(skillId); // Add to favorites
  } else {
    user.favorites.splice(index, 1); // Remove from favorites
  }

  await user.save();
  res.redirect(`/skills/${skillId}`);
});

// ✅ Skill detail page (includes comments + favorite status + favorite count)
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id).populate('postedBy');
    const comments = await Comment.find({ skill: skill._id }).populate('postedBy');

    let isFavorited = false;
    let favoriteCount = 0;

    if (req.session.user) {
      const user = await User.findById(req.session.user._id);
      if (user && user.favorites) { 
        isFavorited = user.favorites.includes(skill._id.toString());
      }
    }

    favoriteCount = await User.countDocuments({ favorites: skill._id });

    res.render('pages/skillDetail', {
      skill,
      comments,
      user: req.session.user,
      isFavorited,
      favoriteCount
    });
  } catch (error) {
    console.error('Error loading skill detail:', error);
    res.status(500).send('Server error');
  }
});

export default router;