const nodemailer = require('nodemailer');

let transporter;

function createSMTPTransporter() {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // SMTP username
        pass: process.env.SMTP_PASS, // SMTP password
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.error('SMTP transporter verification failed:', error.message);
        throw new Error('Failed to verify SMTP transporter. Please check your SMTP settings.');
      }
      if (success) {
        console.log('SMTP transporter is ready to send emails.');
      }
    });
  } catch (error) {
    console.error('Error creating SMTP transporter:', error.message);
    throw new Error('Failed to create SMTP transporter. Please ensure SMTP credentials and host are correct.');
  }
}

function getSMTPTransporter() {
  if (!transporter) {
    throw new Error('SMTP transporter is not initialized. Call createSMTPTransporter first.');
  }
  return transporter;
}

module.exports = {
  createSMTPTransporter,
  getSMTPTransporter,
};