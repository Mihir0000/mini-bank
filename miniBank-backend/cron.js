const cron = require('node-cron');
const moment = require('moment');
const transactionModal = require('./models/transaction/transactionModal');
const dailySummaryModal = require('./models/transaction/dailySummaryModal');

// Run every day at 00:05 AM
cron.schedule('5 0 * * *', async () => {
  try {
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');

    const start = new Date(yesterday + 'T00:00:00Z');
    const end = new Date(yesterday + 'T23:59:59Z');

    const totalSentAgg = await transactionModal.aggregate([
      { $match: { timestamp: { $gte: start, $lte: end } } },
      { $group: { _id: null, totalSent: { $sum: '$amount' } } },
    ]);

    const totalReceivedAgg = await transactionModal.aggregate([
      { $match: { timestamp: { $gte: start, $lte: end } } },
      { $group: { _id: null, totalReceived: { $sum: '$amount' } } },
    ]);

    const totalSent = totalSentAgg[0]?.totalSent || 0;
    const totalReceived = totalReceivedAgg[0]?.totalReceived || 0;

    await dailySummaryModal.findOneAndUpdate(
      { date: yesterday },
      { totalSent, totalReceived },
      { upsert: true }
    );

    console.log(`Daily summary for ${yesterday} saved.`);
  } catch (error) {
    console.error('Error running daily summary job:', error);
  }
});
