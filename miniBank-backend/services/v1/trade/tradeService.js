const tradeModal = require('../../../models/trade/tradeModal');

class TradeService {
  async createTrade(req, res) {
    try {
      const tradeData = req.body;
      const newTrade = new tradeModal(tradeData);
      await newTrade.save();
      return res
        .status(201)
        .json({ message: 'Trade saved successfully', trade: newTrade });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to save trade' });
    }
  }
}

module.exports = new TradeService();
