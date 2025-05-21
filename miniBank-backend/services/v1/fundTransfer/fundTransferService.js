const audit = require('../../../models/idempotentFund/audit');
const transferKey = require('../../../models/idempotentFund/transferKey');
const transactionModal = require('../../../models/transaction/transactionModal');
const userModal = require('../../../models/user/userModal');
const mongoose = require('mongoose');

class FundTransferService {
  async transferFund(req, res) {
    const { idempotencyKey, toUserEmail, amount } = req.body;

    if (!idempotencyKey || !toUserEmail || !amount)
      return res.status(400).json({ message: 'Missing required fields' });

    const existing = await transferKey.findOne({ key: idempotencyKey });
    if (existing) return res.json(existing.response);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const fromUser = await userModal.findById(req.userId).session(session);
      const toUser = await userModal
        .findOne({ email: toUserEmail })
        .session(session);

      if (!toUser) throw new Error('Recipient not found');
      if (fromUser._id.equals(toUser._id))
        throw new Error('Self transfer is not possible');
      if (fromUser.wallet.balance < amount)
        throw new Error('Insufficient funds');
      fromUser.wallet.balance -= amount;
      toUser.wallet.balance += amount;

      await fromUser.save({ session });
      await toUser.save({ session });

      await audit.create(
        [{ fromUser: fromUser._id, toUser: toUser._id, amount }],
        { session }
      );

      await transactionModal.create(
        [
          {
            from: fromUser._id,
            to: toUser._id,
            amount,
            timestamp: new Date(),
          },
        ],
        { session }
      );

      const response = {
        success: true,
        message: `Transferred ₹${amount} to ${toUserEmail}`,
      };

      await transferKey.create([{ key: idempotencyKey, response }], {
        session,
      });

      await session.commitTransaction();
      session.endSession();

      return res.json(response);
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new FundTransferService();
