const express = require('express');
const UserAuthenticationController = require('../controllers/user.authentication.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Route to register a new user
router.post('/register', async (req, res) => {
  try {
    await UserAuthenticationController.register(req, res);
  } catch (error) {
    console.error('Error in /register route:', error.message);
    res.status(500).json({ message: 'Internal server error while registering user.' });
  }
});

// Route to login a user
router.post('/login', async (req, res) => {
  try {
    await UserAuthenticationController.login(req, res);
  } catch (error) {
    console.error('Error in /login route:', error.message);
    res.status(500).json({ message: 'Internal server error while logging in user.' });
  }
});

// Route to get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    await UserAuthenticationController.getProfile(req, res);
  } catch (error) {
    console.error('Error in /profile route:', error.message);
    res.status(500).json({ message: 'Internal server error while retrieving user profile.' });
  }
});

module.exports = router;