import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { validateRegistration, validateLogin } from '../utils/validator.js';

export const renderLogin = (req, res) => {
  res.render('pages/login');
};

export const renderRegister = (req, res) => {
  res.render('pages/register');
};

export const register = async (req, res) => {
  const { username, password, email } = req.body;

  // Validate input data
  const validation = validateRegistration({ username, password, email });
  if (!validation.isValid) {
    return res.render('pages/register', {
      error: validation.errors[0], 
      formData: { username, email }
    });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.render('pages/register', { 
        error: 'Username already exists',
        formData: { username, email }
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      email
    });

    await newUser.save();
    res.redirect('/auth/login');
  } catch (err) {
    let errorMessage = 'Registration failed, please try again';
    if (err.name === 'MongoServerError' && err.code === 11000) {
     
      if (err.keyPattern.username) {
        errorMessage = 'Username already taken, please choose another';
      } else if (err.keyPattern.email) {
        errorMessage = 'Email already registered, please use another';
      }
    } else {
      
      errorMessage = 'An error occurred during registration. Please try again.';
    }

    res.render('pages/register', {
      error: errorMessage,
      formData: { username, email }
    });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  // Validate input data
  const validation = validateLogin({ username, password });
  if (!validation.isValid) {
    return res.render('pages/login', { 
      error: validation.errors.join(', '),
      formData: { username } // Keep username for user convenience
    });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.render('pages/login', { 
        error: 'User does not exist',
        formData: { username }
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('pages/login', { 
        error: 'Incorrect password',
        formData: { username }
      });
    }

    req.session.user = user;
    res.redirect('/skills');
  } catch (err) {
    console.error(err);
    res.render('pages/login', { 
      error: 'Login failed, please try again',
      formData: { username }
    });
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};
