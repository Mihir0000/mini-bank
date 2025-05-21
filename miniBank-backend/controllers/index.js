const fundTransferController = require('./v1/fundTransfer/fundTransferController');
const tradeController = require('./v1/trade/tradeController');
const transactionController = require('./v1/transaction/transactionController');
const userController = require('./v1/user/userController');
const walletController = require('./v1/user/walletController');

module.exports = {
  userController,
  walletController,
  fundTransferController,
  transactionController,
  tradeController,
};
