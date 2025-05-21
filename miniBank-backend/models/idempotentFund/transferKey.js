const mongoose = require('mongoose');

const transferKeySchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    response: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TransferKey', transferKeySchema);
