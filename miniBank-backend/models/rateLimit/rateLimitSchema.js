const mongoose = require('mongoose');

const rateLimitSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    timestamps: { type: [Date], default: [] },
  },
  { timestamps: true }
);

rateLimitSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 }); // TTL of 60s

module.exports = mongoose.model('RateLimit', rateLimitSchema);
