const userModal = require('../../../models/user/userModal');

class WalletService {
  async getWalletDetails(req, res) {
    const user = await userModal.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ balance: user.wallet.balance });
  }
}

module.exports = new WalletService();
