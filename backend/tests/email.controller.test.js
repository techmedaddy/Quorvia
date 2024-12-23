const request = require('supertest');
const app = require('../app');
const EmailService = require('../services/email.service');
const jwt = require('jsonwebtoken');

jest.mock('../services/email.service');
jest.mock('jsonwebtoken');

describe('Email Controller Tests', () => {
  const mockToken = 'mocked_token';
  const userPayload = { id: 'user123', email: 'user@test.com' };

  beforeEach(() => {
    jwt.verify.mockImplementation((token, secret, callback) => callback(null, userPayload));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/emails/send', () => {
    it('should send an email and return success message', async () => {
      EmailService.sendEmail.mockResolvedValue({
        message: 'Email sent successfully.',
      });

      const response = await request(app)
        .post('/api/emails/send')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          sender: 'sender@test.com',
          recipient: 'recipient@test.com',
          subject: 'Test Email',
          content: 'This is a test email.',
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Email sent successfully.');
      expect(EmailService.sendEmail).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should return 400 for missing sender or recipient', async () => {
      const response = await request(app)
        .post('/api/emails/send')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ recipient: 'recipient@test.com', subject: 'Test Email' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Sender and recipient are required.');
    });

    it('should return 500 on service failure', async () => {
      EmailService.sendEmail.mockRejectedValue(new Error('Service Error'));

      const response = await request(app)
        .post('/api/emails/send')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          sender: 'sender@test.com',
          recipient: 'recipient@test.com',
          subject: 'Test Email',
          content: 'This is a test email.',
        });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Failed to send email: Service Error');
    });
  });
});