const request = require('supertest');
const app = require('../app');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

jest.mock('../models/user.model');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');

describe('User Authentication Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/users/register', () => {
    it('should register a new user', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 'user123', name: 'Test User', email: 'user@test.com' });

      const response = await request(app)
        .post('/api/users/register')
        .send({ name: 'Test User', email: 'user@test.com', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully.');
      expect(User.create).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should return 409 for duplicate email', async () => {
      User.findOne.mockResolvedValue({ email: 'user@test.com' });

      const response = await request(app)
        .post('/api/users/register')
        .send({ name: 'Test User', email: 'user@test.com', password: 'password123' });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe('Email is already in use.');
    });
  });

  describe('POST /api/users/login', () => {
    it('should log in a user and return a token', async () => {
      const mockPassword = 'password123';
      const mockHashedPassword = '$2b$10$mockedHashedPassword';

      User.findOne.mockResolvedValue({ id: 'user123', email: 'user@test.com', password: mockHashedPassword });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mocked_token');

      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'user@test.com', password: mockPassword });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful.');
      expect(response.body.token).toBe('mocked_token');
    });

    it('should return 401 for invalid credentials', async () => {
      User.findOne.mockResolvedValue({ email: 'user@test.com', password: '$2b$10$mockedHashedPassword' });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'user@test.com', password: 'wrongPassword' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials.');
    });

    it('should return 404 for non-existing user', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/users/login')
        .send({ email: 'nonexisting@test.com', password: 'password123' });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });
  });
});