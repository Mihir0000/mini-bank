const dailySummaryModal = require('../../../models/transaction/dailySummaryModal');
const transactionModal = require('../../../models/transaction/transactionModal');
const mongoose = require('mongoose');

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
      if (!date) {
        return res.status(400).json({ message: 'Date is required' });
      }

      const summary = await dailySummaryModal.findOne({ date });

      return res.json(summary || []);
    } catch (err) {
      return res.status(500).json({ error: 'Error ' + err?.message });
    }
  }

  async getDailyExpenses(req, res) {
    try {
      const userId = req.userId;

      const lastThirtyDays = new Date();
      lastThirtyDays.setDate(lastThirtyDays.getDate() - 30);
      const expenses = await transactionModal.aggregate([
        {
          $match: {
            from: new mongoose.Types.ObjectId(userId),
            createdAt: { $gte: lastThirtyDays },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
            },
            amount: { $sum: '$amount' },
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $project: {
            _id: 0,
            date: '$_id',
            amount: 1,
          },
        },
      ]);

      return res.json(expenses);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to fetch expenses' });
    }
  }
}

module.exports = new TransactionService();
