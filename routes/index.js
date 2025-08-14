import express from 'express';
const router = express.Router();

// Unauthenticated users see landing page, authenticated users redirect to /skills
router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/skills');
  } else {
    res.redirect('/html/landing.html');
  }
});
export default router;