const mongoose = require('mongoose');

const dailySummarySchema = new mongoose.Schema(
  {
    date: { type: String, required: true, unique: true },
    totalSent: { type: Number, default: 0 },
    totalReceived: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DailySummary', dailySummarySchema);
