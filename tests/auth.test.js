const request = require('supertest');
const app = require('../server'); // Adjust this to point to your main Express app file
const { sequelize, User } = require('../models');


// Clear the users table before testing to ensure a clean slate
beforeAll(async () => {
  await sequelize.sync({ force: true }); 
});

describe('Authentication API', () => {
  const testUser = {
    username: 'testpilot',
    password: 'securepassword123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully!');
    });

    it('should fail to register a duplicate username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser); // Sending the exact same user again
      
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login the user and return a JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(testUser);
      
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('role', 'USER');
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testpilot',
          password: 'wrongpassword' // Deliberately wrong
        });
      
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Incorrect password!');
    });
  });
});