import express from 'express';
import Skill from '../models/Skill.js';
import Comment from '../models/Comment.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { sanitizeInput } from '../middleware/validationMiddleware.js';
import { validateSkill, validateComment } from '../utils/validator.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

const router = express.Router();

// ✅ Skills marketplace (redirect to static HTML)
router.get('/', requireAuth, (req, res) => {
  res.redirect('/html/skills.html');
});

// ✅ New skill page (note: this must be placed before :id!)
router.get('/new', requireAuth, (req, res) => {
  res.redirect('/html/skillNew.html');
});

// ✅ Create new skill
router.post('/', requireAuth, sanitizeInput, async (req, res) => {
  const { title, category, description } = req.body;
  
  // Validate skill data
  const validation = validateSkill({ title, category, description });
  
  if (!validation.isValid) {
    const params = new URLSearchParams({
      errors: JSON.stringify(validation.errors),
      title: title || '',
      category: category || '',
      description: description || ''
    });
    return res.redirect(`/html/skillNew.html?${params.toString()}`);
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
    const params = new URLSearchParams({
      errors: JSON.stringify(['An error occurred while creating the skill. Please try again.']),
      title: title || '',
      category: category || '',
      description: description || ''
    });
    res.redirect(`/html/skillNew.html?${params.toString()}`);
  }
});

// ✅ Comment (AJAX)
router.post('/:id/comment', requireAuth, sanitizeInput, async (req, res) => {
  const { content } = req.body;
  const skillId = req.params.id;
  
  // Validate skill ID format
  if (!skillId || skillId === 'undefined' || skillId === 'null') {
    return res.status(400).json({ 
      success: false, 
      errors: ['Invalid skill ID'] 
    });
  }
  
  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(skillId)) {
    return res.status(400).json({ 
      success: false, 
      errors: ['Invalid skill ID format'] 
    });
  }
  
  // Validate comment data
  const validation = validateComment({ content });
  
  if (!validation.isValid) {
    return res.status(400).json({ 
      success: false, 
      errors: validation.errors 
    });
  }
  
  try {
    // Verify if skill exists
    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ 
        success: false, 
        errors: ['Skill not found'] 
      });
    }
    
    const comment = new Comment({
      content: content.trim(),
      postedBy: req.session.user._id,
      skill: skillId
    });
    await comment.save();
    
    // Return newly created comment with user information
    await comment.populate('postedBy', 'username');
    
    res.json({ success: true, comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ 
      success: false, 
      errors: ['An error occurred while posting the comment. Please try again.'] 
    });
  }
});

// Favorite/unfavorite skill
router.post('/:id/favorite', requireAuth, async (req, res) => {
  const skillId = req.params.id;
  
  // Validate MongoDB ObjectId format
  if (!mongoose.Types.ObjectId.isValid(skillId)) {
    return res.status(400).json({ error: 'Invalid skill ID format' });
  }
  
  const user = await User.findById(req.session.user._id);

  if (!user) {
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

// ✅ Skill detail page (redirect to static HTML)
router.get('/:id', requireAuth, (req, res) => {
  res.redirect(`/html/skillDetail.html`);
});

export default router;