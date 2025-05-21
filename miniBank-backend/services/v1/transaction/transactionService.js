const dailySummaryModal = require('../../../models/transaction/dailySummaryModal');
const transactionModal = require('../../../models/transaction/transactionModal');

class TransactionService {
  async getTopTransaction(req, res, next) {
    try {
      const userId = req.userId;

      const transactions = await transactionModal
        .find({ $or: [{ from: userId }, { to: userId }] })
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('from', 'email')
        .populate('to', 'email');

      return res.json(transactions);
    } catch (err) {
      return res.status(500).json({ error: 'Error ' + err?.message });
    }
  }

  async getSummary(req, res, next) {
    try {
      const { date } = req.params;

      const summary = await dailySummaryModal.findOne({ date });

      // if (!summary)
      //   return res
      //     .status(404)
      //     .json({ error: 'Summary not found for this date' });

      return res.json(summary);
    } catch (err) {
      return res.status(500).json({ error: 'Error ' + err?.message });
    }
  }
}

module.exports = new TransactionService();
