const { walletService } = require('../../../services');

class WalletController {
  async getWalletDetails(req, res, next) {
    try {
      await walletService.getWalletDetails(req, res, next);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new WalletController();
