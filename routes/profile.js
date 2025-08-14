import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { sanitizeInput } from '../middleware/validationMiddleware.js';
import profileController from '../controllers/profileController.js';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import { isValidUsername } from '../utils/validator.js';

const router = express.Router();

// My skills
router.get('/myskills', requireAuth, (req, res) => {
  res.redirect('/html/mySkills.html');
});

// My favorites page
router.get('/favorites', requireAuth, (req, res) => {
  res.redirect('/html/myFavorites.html');
});

// Personal homepage
router.get('/me', requireAuth, (req, res) => {
  res.redirect('/html/profile.html');
});

// Edit profile page
router.get('/edit', requireAuth, (req, res) => {
  res.redirect('/html/editProfile.html');
});

// Submit profile changes
router.post('/edit', requireAuth, sanitizeInput, profileController.updateProfile);

// Username and email check routes
router.post('/check-username', requireAuth, async (req, res) => {
  try {
    const { username } = req.body;

   
    if (!isValidUsername(username)) {
      return res.status(400).json({
        exists: false,
        error: 'Username must be 3-20 characters and contain only letters, numbers, and underscores'
      });
    }

    const user = await User.findOne({ username });
    const exists = !!user && user._id.toString() !== req.session.user._id.toString();
    res.json({ exists });
  } catch (error) {
    console.error('Error checking username:', error);
    res.status(500).json({
      exists: false,
      error: 'Error checking username. Please try again.'
    });
  }
});

router.post('/check-email', requireAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user && user._id.toString() !== req.session.user._id.toString()) {
      return res.json({ exists: true });
    }
    res.json({ exists: false });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/api/user/:userId/skills', async (req, res) => {
  try {
    const userId = req.params.userId;
    const skills = await Skill.find({ postedBy: userId }).select('title');
    res.json(skills);
  } catch (error) {
    console.error('Error fetching user skills:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit skill page - moved after specific routes
router.get('/edit/:id', requireAuth, (req, res) => {
  res.redirect(`/html/editSkill.html?id=${req.params.id}`);
});

// Update skill - moved after specific routes
router.put('/:id', requireAuth, sanitizeInput, profileController.updateSkill);

// Delete skill - moved after specific routes
router.delete('/:id', requireAuth, profileController.deleteSkill);

export default router;
