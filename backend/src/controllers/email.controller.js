const EmailService = require('../services/email.service');
const CacheService = require('../services/cache.service');

class EmailController {
  // Send email
  async sendEmail(req, res) {
    try {
      const { sender, recipient, subject, content, attachment } = req.body;

      if (!sender || !recipient) {
        return res.status(400).json({ message: 'Sender and recipient are required.' });
      }

      const cachedEmailKey = `email:${sender}:${recipient}:${Date.now()}`;
      await CacheService.setCache(cachedEmailKey, { sender, recipient, subject, content }, 600); // Cache for 10 minutes

      const emailResponse = await EmailService.sendEmail({ sender, recipient, subject, content, attachment });

      return res.status(200).json({
        message: 'Email sent successfully.',
        emailResponse,
      });
    } catch (error) {
      console.error('Error in sendEmail:', error.message);
      return res.status(500).json({ message: `Failed to send email: ${error.message}` });
    }
  }

  // Fetch emails
  async getEmails(req, res) {
    try {
      const emails = await EmailService.fetchEmails();

      if (emails.message === 'No emails found.') {
        return res.status(404).json({ message: 'No emails available.' });
      }

      return res.status(200).json(emails);
    } catch (error) {
      console.error('Error in getEmails:', error.message);
      return res.status(500).json({ message: 'Failed to fetch emails. Please try again later.' });
    }
  }
}

module.exports = new EmailController();