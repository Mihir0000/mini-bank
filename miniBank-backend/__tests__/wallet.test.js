const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const userModel = require('../models/user/userModal');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  process.env.JWT_SECRET = 'your_secret_key';

  const user = new userModel({
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    wallet: { balance: 5000 },
  });
  await user.save();

  userId = user._id.toString();

  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /api/wallet', () => {
  it('should return user wallet balance', async () => {
    const res = await request(app)
      .get('/api/wallet')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.balance).toBeDefined();
    expect(res.body.balance).toBe(5000);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app).get('/api/wallet');
    expect(res.statusCode).toBe(401);
  });

  it('should return 404 if user not found', async () => {
    const fakeToken = jwt.sign(
      { id: new mongoose.Types.ObjectId() },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    const res = await request(app)
      .get('/api/wallet')
      .set('Authorization', `Bearer ${fakeToken}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('User not found');
  });
});
