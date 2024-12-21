javascript
const nodemailer = require('nodemailer');
const Email = require('../models/email.model');
const { getSMTPTransporter } = require('../config/smtp.config');

class EmailService {
  constructor() {
    this.transporter = getSMTPTransporter();
  }

  async sendEmail({ sender, recipient, subject, content, attachment }) {
    try {
      // Validate required fields
      if (!sender || !recipient) {
        throw new Error('Sender and recipient email addresses are required.');
      }

      // Prepare email options
      const mailOptions = {
        from: sender,
        to: recipient,
        subject: subject || 'No Subject',
        text: content || '',
        attachments: attachment ? [{ path: attachment }] : [],
      };

      // Send email via transporter
      const info = await this.transporter.sendMail(mailOptions);

      // Log email in database
      const email = await Email.create({ sender, recipient, subject, content, attachment });

      return {
        message: 'Email sent successfully.',
        info,
        email,
      };
    } catch (error) {
      console.error('Error in sendEmail:', error.message);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  async fetchEmails() {
    try {
      const emails = await Email.findAll({ order: [['createdAt', 'DESC']] });
      if (!emails || emails.length === 0) {
        return { message: 'No emails found.' };
      }
      return emails;
    } catch (error) {
      console.error('Error in fetchEmails:', error.message);
      throw new Error('Failed to fetch emails. Please try again later.');
    }
  }
}

module.exports = new EmailService();