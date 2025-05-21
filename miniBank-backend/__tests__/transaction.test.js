const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const userModal = require('../models/user/userModal');
const transactionModal = require('../models/transaction/transactionModal');
const dailySummaryModal = require('../models/transaction/dailySummaryModal');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  process.env.JWT_SECRET = 'testsecret';

  const user = new userModal({
    name: 'User1',
    email: 'user1@example.com',
    password: 'hashedpw',
    wallet: { balance: 10000 },
  });
  await user.save();
  userId = user._id;
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

  const anotherUser = new userModal({
    name: 'User2',
    email: 'user2@example.com',
    password: 'hashedpw',
    wallet: { balance: 5000 },
  });
  await anotherUser.save();

  await transactionModal.create([
    { from: user._id, to: anotherUser._id, amount: 1000 },
    { from: anotherUser._id, to: user._id, amount: 500 },
  ]);
  await dailySummaryModal.create({
    date: '2025-05-21',
    totalSent: 10,
    totalReceived: 5000,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /api/transactions/', () => {
  it('should return last 50 transactions for the user', async () => {
    const res = await request(app)
      .get('/api/transactions/')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('from');
    expect(res.body[0]).toHaveProperty('to');
    expect(res.body[0]).toHaveProperty('amount');
  });
});

describe('GET /api/transactions/summary/:date', () => {
  it('should return summary for the given date', async () => {
    const res = await request(app)
      .get('/api/transactions/summary/2025-05-21')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('date', '2025-05-21');
    expect(res.body).toHaveProperty('totalSent', 10);
    expect(res.body).toHaveProperty('totalReceived', 5000);
  });

  it('should return null if no summary exists for the date', async () => {
    const res = await request(app)
      .get('/api/transactions/summary/1999-01-01')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeNull();
  });
});
