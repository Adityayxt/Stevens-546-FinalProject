import Skill from '../models/Skill.js';
import User from '../models/User.js';
import { validateSkill, compressWhitespace, isValidUsername } from '../utils/validator.js';


export const getMySkills = async (req, res) => {
  try {
    const skills = await Skill.find({ postedBy: req.session.user._id }).sort({ createdAt: -1 });
    res.render('pages/mySkills', { skills });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const renderEditSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill || skill.postedBy.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('No permission');
    }
    res.render('pages/editSkill', { skill });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill || skill.postedBy.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('No permission');
    }

    const { title, category, description } = req.body;
    
    // Validate skill data
    const validation = validateSkill({ title, category, description });
    
    if (!validation.isValid) {
      return res.render('pages/editSkill', {
        skill: { ...skill.toObject(), title, category, description },
        errors: validation.errors
      });
    }

    skill.title = title.trim();
    skill.category = category;
    skill.description = description.trimStart().trimEnd();
    await skill.save();

    res.redirect('/profile/myskills');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill || skill.postedBy.toString() !== req.session.user._id.toString()) {
      return res.status(403).send('No permission');
    }

    await skill.deleteOne();
    res.redirect('/profile/myskills');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const renderProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const skills = await Skill.find({ postedBy: user._id }).sort({ createdAt: -1 });
    res.render('pages/profile', { user, skills, isViewingOtherProfile: false });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const renderProfileEdit = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('pages/editProfile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
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

    
    if (username && username !== user.username) {
      if (!isValidUsername(username)) {
        return res.render('pages/editProfile', {
          user: { ...user.toObject(), email, contact },
          error: 'Username must be 3-20 characters and contain  letters or numbers'
        });
      }

      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser._id.toString() !== userId.toString()) {
        return res.render('pages/editProfile', {
          user: { ...user.toObject(), email, contact },
          error: 'Username is already taken'
        });
      }
      user.username = username;
    }

    
    if (email && email !== user.email) {
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.render('pages/editProfile', {
          user: { ...user.toObject(), username, contact },
          emailError: 'Please enter a valid email address'
        });
      }
      
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId.toString()) {
        return res.render('pages/editProfile', {
          user: { ...user.toObject(), username, contact },
          emailError: 'Email is already taken'
        });
      }
      user.email = email;
    } else if (email) {
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.render('pages/editProfile', {
          user: { ...user.toObject(), username, contact },
          emailError: 'Please enter a valid email address'
        });
      }
      user.email = email;
    }

    user.contact = contact;
    await user.save();

    req.session.user.username = user.username;
    req.session.user.email = user.email; 

    res.redirect('/profile/me');
  } catch (error) {
    console.error('Error updating profile:', error);

 
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.email) {
        return res.render('pages/editProfile', {
          user: { ...user.toObject(), ...req.body },
          error: 'Email is already taken'
        });
      } else if (error.keyPattern && error.keyPattern.username) {
        return res.render('pages/editProfile', {
          user: { ...user.toObject(), ...req.body },
          error: 'Username is already taken'
        });
      }
    }
    res.status(500).json({ message: 'Server error' });
  }
}





// ✅ My favorites
export const getMyFavorites = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/login?redirect=/profile/favorites');
    }
    
    const user = await User.findById(req.session.user._id);
    
    if (!user) {
      req.session.destroy();
      return res.redirect('/auth/login?redirect=/profile/favorites');
    }

    if (!user.favorites) {
      user.favorites = [];
      await user.save();
    }

    await user.populate({
      path: 'favorites',
      populate: {
        path: 'postedBy',
        select: 'username _id'
      },
      options: { sort: { createdAt: -1 } }
    });

    res.render('pages/myFavorites', {
      favorites: user.favorites || [],
      user: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};



// Default export for compatibility
export default {
  getMySkills,
  renderEditSkill,
  updateSkill,
  deleteSkill,
  renderProfile,
  renderProfileEdit,
  updateProfile,
  getMyFavorites 
};