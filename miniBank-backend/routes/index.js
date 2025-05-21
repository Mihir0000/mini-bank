const express = require('express');
const router = express.Router();
const userRouter = require('./v1/userRoute');
const walletRouter = require('./v1/walletRoute');
const fundTransferRouter = require('./v1/fundTransferRoute');
const transactionRouter = require('./v1/transactionRoute');
const tradeRouter = require('./v1/tradeRoute');
const rateLimiter = require('../middlewares/rateLimiter');
const auth = require('../middlewares/auth');

router.use('/auth', userRouter);
router.use('/wallet', auth, rateLimiter, walletRouter);
router.use('/transfer', auth, rateLimiter, fundTransferRouter);
router.use('/transactions', auth, rateLimiter, transactionRouter);
router.use('/trades', auth, rateLimiter, tradeRouter);

router.get('/', (req, res) => {
  return res.status(200).json({ message: 'Welcome to Mini Bank' });
});

module.exports = router;
