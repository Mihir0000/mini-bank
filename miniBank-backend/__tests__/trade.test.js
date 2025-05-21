const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const tradeModal = require('../models/trade/tradeModal');
const userModal = require('../models/user/userModal');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
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
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await tradeModal.deleteMany();
});

describe('POST /api/trades', () => {
  it('should create a trade and return it', async () => {
    const tradeData = {
      instrument: 'BTCUSDT',
      price: 27250.75,
      volume: 0.5,
    };

    const res = await request(app)
      .post('/api/trades')
      .send(tradeData)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Trade saved successfully');
    expect(res.body.trade).toMatchObject(tradeData);

    const tradeInDb = await tradeModal.findOne({ instrument: 'BTCUSDT' });
    expect(tradeInDb).not.toBeNull();
    expect(tradeInDb.price).toBe(tradeData.price);
    expect(tradeInDb.volume).toBe(tradeData.volume);
  });

  it('should return 500 if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/trades')
      .send({})
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Failed to save trade');
  });
});
