const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // 👈 Added name
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wallet: {
      balance: {
        type: Number,
        default: 0,
        set: (v) => Math.round(v * 100) / 100,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
