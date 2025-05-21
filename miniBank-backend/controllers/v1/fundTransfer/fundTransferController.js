const { fundTransferService } = require('../../../services');

class FundTransferController {
  async transferFund(req, res, next) {
    try {
      await fundTransferService.transferFund(req, res, next);
    } catch (err) {
      return res.status(500).json({ message: 'Error ' + err });
    }
  }
}

module.exports = new FundTransferController();
