import User from '../models/User.js';

export const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect(`/auth/login?redirect=${encodeURIComponent(req.originalUrl)}`);
  }
  next();
};

// API authentication middleware, check if user still exists in database
export const requireAuthAPI = async (req, res, next) => {
  try {
    // Check if user information exists in session
    if (!req.session.user) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'Current login status is invalid, may have been removed or session expired, please login again.',
        needLogin: true
      });
    }

    // Check if user still exists in database
    const user = await User.findById(req.session.user._id);
    if (!user) {
      // User does not exist in database, clear session
      req.session.destroy();
      return res.status(401).json({ 
        error: 'User not found',
        message: 'Current login status is invalid, may have been removed or session expired, please login again.',
        needLogin: true
      });
    }

    // Update user information in session (prevent data inconsistency)
    req.session.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'System error, please try again later.'
    });
  }
};