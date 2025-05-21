const fundTransferService = require('./v1/fundTransfer/fundTransferService');
const tradeService = require('./v1/trade/tradeService');
const transactionService = require('./v1/transaction/transactionService');
const userService = require('./v1/user/userService');
const walletService = require('./v1/user/walletService');

module.exports = {
  userService,
  walletService,
  fundTransferService,
  transactionService,
  tradeService,
};
