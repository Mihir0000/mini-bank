const rateLimitSchema = require('../models/rateLimit/rateLimitSchema');

const rateLimiter = async (req, res, next) => {
  try {
    const userId = req?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const now = new Date();
    const windowSize = 60 * 1000;
    const maxRequests = 100;
    const windowStart = new Date(now.getTime() - windowSize);

    const userLimit = await rateLimitSchema.findOneAndUpdate(
      { userId },
      {
        $pull: { timestamps: { $lt: windowStart } },
      },
      { new: true, upsert: true }
    );

    const requestCount = userLimit?.timestamps?.length ?? 0;

    if (requestCount >= maxRequests) {
      const retryAfter = Math.ceil(
        (userLimit.timestamps[0].getTime() + windowSize - now.getTime()) / 1000
      );
      res.set('Retry-After', retryAfter);
      return res
        .status(429)
        .json({ message: 'Too many requests. Try again later.' });
    }

    await rateLimitSchema.findOneAndUpdate(
      { userId },
      {
        $push: { timestamps: now },
        $setOnInsert: { userId },
      },
      { upsert: true }
    );

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = rateLimiter;
