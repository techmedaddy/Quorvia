const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class UserAuthenticationController {
  // Register a new user
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required.' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already in use.' });
      }

      const newUser = await User.create({ name, email, password });

      return res.status(201).json({
        message: 'User registered successfully.',
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      });
    } catch (error) {
      console.error('Error in register:', error.message);
      return res.status(500).json({ message: 'Failed to register user. Please try again later.' });
    }
  }

  // User login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({
        message: 'Login successful.',
        token,
      });
    } catch (error) {
      console.error('Error in login:', error.message);
      return res.status(500).json({ message: 'Failed to login. Please try again later.' });
    }
  }

  // User profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // Assume user ID is attached by auth middleware

      const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'createdAt'],
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error('Error in getProfile:', error.message);
      return res.status(500).json({ message: 'Failed to retrieve profile. Please try again later.' });
    }
  }
}

module.exports = new UserAuthenticationController();