const { tradeService } = require('../../../services');

class TradeController {
  async createTrade(req, res, next) {
    try {
      await tradeService.createTrade(req, res, next);
    } catch (err) {
      return res.status(500).json({ message: 'Error ' + err });
    }
  }
}

module.exports = new TradeController();
