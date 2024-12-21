const express = require('express');
const EmailController = require('../controllers/email.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Route to send an email
router.post('/send', authMiddleware, async (req, res) => {
  try {
    await EmailController.sendEmail(req, res);
  } catch (error) {
    console.error('Error in /send route:', error.message);
    res.status(500).json({ message: 'Internal server error while sending email.' });
  }
});

// Route to fetch emails
router.get('/', authMiddleware, async (req, res) => {
  try {
    await EmailController.getEmails(req, res);
  } catch (error) {
    console.error('Error in / route (fetch emails):', error.message);
    res.status(500).json({ message: 'Internal server error while fetching emails.' });
  }
});

module.exports = router;