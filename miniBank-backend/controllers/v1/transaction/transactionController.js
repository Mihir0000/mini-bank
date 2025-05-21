const { transactionService } = require('../../../services');

class TransactionController {
  async getTopTransaction(req, res, next) {
    try {
      await transactionService.getTopTransaction(req, res, next);
    } catch (err) {
      return res.status(500).json({ message: 'Error ' + err });
    }
  }
  async getSummary(req, res, next) {
    try {
      await transactionService.getSummary(req, res, next);
    } catch (err) {
      return res.status(500).json({ message: 'Error ' + err });
    }
  }
}

module.exports = new TransactionController();
