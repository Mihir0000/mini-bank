const rateLimitSchema = require('../models/rateLimit/rateLimitSchema');

const rateLimiter = async (req, res, next) => {
  try {
    const userId = req?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const now = Date.now();
    const windowSize = 60 * 1000; // 1 minute
    const maxRequests = 100;

    let userLimit = await rateLimitSchema.findOne({ userId });

    if (!userLimit) {
      userLimit = new rateLimitSchema({ userId, timestamps: [] });
    }

    // Filter timestamps within the sliding window
    userLimit.timestamps = userLimit.timestamps.filter(
      (ts) => now - new Date(ts).getTime() < windowSize
    );

    if (userLimit.timestamps.length >= maxRequests) {
      const retryAfter = Math.ceil(
        (new Date(userLimit.timestamps[0]).getTime() + windowSize - now) / 1000
      );
      res.set('Retry-After', retryAfter);
      return res
        .status(429)
        .json({ message: 'Too many requests. Try again later.' });
    }

    userLimit.timestamps.push(new Date());
    await userLimit.save();

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = rateLimiter;
