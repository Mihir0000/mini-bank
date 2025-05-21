const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth API', () => {
  it('should register a user and return a JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        name: 'test user',
        email: 'test@example.com',
        password: 'test1234',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User created');
  });

  it('should login a user', async () => {
    await request(app)
      .post('/api/auth/register')
      .set('Content-Type', 'application/json')
      .send({
        name: 'test 2',
        email: 'login@example.com',
        password: 'test1234',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'login@example.com',
        password: 'test1234',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
