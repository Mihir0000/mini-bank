const tradeModal = require('../models/trade/tradeModal');

module.exports = function watchTrades(io) {
  const changeStream = tradeModal.watch([], { fullDocument: 'updateLookup' });

  let batch = [];

  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      batch.push(change.fullDocument);

      if (batch.length >= 20) {
        console.log('🚀 Emitting 20 trades via socket');
        io.emit('tradeBatch', batch);
        batch = [];
      }
    }
  });

  changeStream.on('error', (error) => {
    console.error('ChangeStream error:', error);
  });

  changeStream.on('close', () => {
    console.warn('ChangeStream closed');
  });

  setInterval(() => {
    if (batch.length > 0) {
      io.emit('tradeBatch', batch);
      batch = [];
    }
  }, 1000);

  process.on('SIGINT', () => {
    clearInterval(interval);
    changeStream.close();
    process.exit();
  });
};
