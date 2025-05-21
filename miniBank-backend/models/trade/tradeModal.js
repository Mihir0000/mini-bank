const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema(
  {
    instrument: { type: String, required: true },
    price: { type: Number, required: true },
    volume: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trade', tradeSchema);
