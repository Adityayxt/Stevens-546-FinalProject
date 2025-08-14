import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { validateRegistration, validateLogin } from '../utils/validator.js';

export const renderLogin = (req, res) => {
  res.redirect('/html/login.html');
};

export const renderRegister = (req, res) => {
  res.redirect('/html/register.html');
};

export const register = async (req, res) => {
  const { username, password, email } = req.body;

  // Validate input data
  const validation = validateRegistration({ username, password, email });
  if (!validation.isValid) {
    return res.redirect(`/html/register.html?error=${encodeURIComponent(validation.errors[0])}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`);
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.redirect(`/html/register.html?error=${encodeURIComponent('Username already exists')}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`);
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

    res.redirect(`/html/register.html?error=${encodeURIComponent(errorMessage)}&username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}`);
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  // Validate input data
  const validation = validateLogin({ username, password });
  if (!validation.isValid) {
    return res.redirect(`/html/login.html?error=${encodeURIComponent(validation.errors.join(', '))}&username=${encodeURIComponent(username)}`);
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.redirect(`/html/login.html?error=${encodeURIComponent('User does not exist')}&username=${encodeURIComponent(username)}`);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.redirect(`/html/login.html?error=${encodeURIComponent('Incorrect password')}&username=${encodeURIComponent(username)}`);
    }

    req.session.user = user;
    res.redirect('/skills');
  } catch (err) {
    console.error(err);
    res.redirect(`/html/login.html?error=${encodeURIComponent('Login failed, please try again')}&username=${encodeURIComponent(username)}`);
  }
};

export const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};
