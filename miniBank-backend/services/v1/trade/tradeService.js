const tradeModal = require('../../../models/trade/tradeModal');

class TradeService {
  async createTrade(req, res) {
    try {
      const { instrument, price, volume } = req.body;

      if (!instrument || typeof instrument !== 'string') {
        return res
          .status(400)
          .json({ message: 'Instrument is required and must be a string' });
      }

      if (typeof price !== 'number' || price <= 0) {
        return res
          .status(400)
          .json({ message: 'Price must be a positive number' });
      }

      if (typeof volume !== 'number' || volume <= 0) {
        return res
          .status(400)
          .json({ message: 'Volume must be a positive number' });
      }

      const newTrade = new tradeModal({ instrument, price, volume });
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
