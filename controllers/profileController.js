import Skill from '../models/Skill.js';
import User from '../models/User.js';
import { validateSkill, compressWhitespace, isValidUsername } from '../utils/validator.js';

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill || skill.postedBy.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ error: 'No permission' });
    }

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
      return res.redirect(`/html/editSkill.html?id=${req.params.id}&${params.toString()}`);
    }

    skill.title = title.trim();
    skill.category = category;
    skill.description = description.trimStart().trimEnd();
    await skill.save();

    res.redirect('/profile/myskills');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill || skill.postedBy.toString() !== req.session.user._id.toString()) {
      return res.status(403).json({ error: 'No permission' });
    }

    await skill.deleteOne();
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, contact } = req.body;
    const userId = req.session.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Username validation
    if (username && username !== user.username) {
      if (!isValidUsername(username)) {
        const params = new URLSearchParams({
          error: 'Username must be 3-20 characters and contain letters or numbers',
          username: username || '',
          email: email || '',
          contact: contact || ''
        });
        return res.redirect(`/html/editProfile.html?${params.toString()}`);
      }

      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        const params = new URLSearchParams({
          error: 'Username is already taken',
          username: username || '',
          email: email || '',
          contact: contact || ''
        });
        return res.redirect(`/html/editProfile.html?${params.toString()}`);
      }
      user.username = username;
    }

    // Email validation
    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const params = new URLSearchParams({
          emailError: 'Please enter a valid email address',
          username: username || '',
          email: email || '',
          contact: contact || ''
        });
        return res.redirect(`/html/editProfile.html?${params.toString()}`);
      }
      
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId.toString()) {
        const params = new URLSearchParams({
          emailError: 'Email is already taken',
          username: username || '',
          email: email || '',
          contact: contact || ''
        });
        return res.redirect(`/html/editProfile.html?${params.toString()}`);
      }
      user.email = email;
    } else if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        const params = new URLSearchParams({
          emailError: 'Please enter a valid email address',
          username: username || '',
          email: email || '',
          contact: contact || ''
        });
        return res.redirect(`/html/editProfile.html?${params.toString()}`);
      }
      user.email = email;
    }

    // Contact validation
    if (contact) {
        if (contact.length > 50) {
            const params = new URLSearchParams({
                contactError: 'Contact information cannot exceed 50 characters',
                username: username || '',
                email: email || '',
                contact: contact || ''
            });
            return res.redirect(`/html/editProfile.html?${params.toString()}`);
        }
        user.contact = contact;
    } else {
        user.contact = '';
    }
    
    await user.save();

    req.session.user.username = user.username;
    req.session.user.email = user.email;

    res.redirect('/profile/me');
  } catch (error) {
    console.error('Error updating profile:', error);

    if (error.code === 11000) {
      let errorMsg = 'Duplicate entry error';
      if (error.keyPattern && error.keyPattern.email) {
        errorMsg = 'Email is already taken';
      } else if (error.keyPattern && error.keyPattern.username) {
        errorMsg = 'Username is already taken';
      }
      
      const params = new URLSearchParams({
        error: errorMsg,
        username: req.body.username || '',
        email: req.body.email || '',
        contact: req.body.contact || ''
      });
      return res.redirect(`/html/editProfile.html?${params.toString()}`);
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Default export for compatibility
export default {
  updateSkill,
  deleteSkill,
  updateProfile
};
