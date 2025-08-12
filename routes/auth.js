import express from 'express';
import { sanitizeInput } from '../middleware/validationMiddleware.js';
import { renderLogin, renderRegister, register, login, logout } from '../controllers/authController.js';
import { isValidUsername } from '../utils/validator.js';
import User from '../models/User.js';

const router = express.Router();


router.get('/login', renderLogin);
router.get('/register', renderRegister);
router.post('/register', sanitizeInput, register);
router.post('/login', sanitizeInput, login);
router.get('/logout', logout);

router.get('/check-username', async (req, res) => {
  try {
    const { username } = req.query;

 
    if (!isValidUsername(username)) {
      return res.status(400).json({
        available: false,
        error: 'Username must be 3-20 characters and contain only letters or numbers'
      });
    }

    const user = await User.findOne({ username });
    res.json({ available: !user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/check-email', async (req, res) => {
  try {
    const { email } = req.query;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        available: false,
        error: 'Please enter a valid email address'
      });
    }

    const user = await User.findOne({ email });
    res.json({ available: !user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;