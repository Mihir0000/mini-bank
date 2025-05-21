const userModal = require('../../../models/user/userModal');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserServices {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const existing = await userModal.findOne({ email });
      if (existing)
        return res.status(400).json({ message: 'Email already registered' });

      const hashed = await bcrypt.hash(password, 10);
      const user = new userModal({ name, email, password: hashed });

      await user.save();
      return res.status(201).json({ message: 'User created' });
    } catch (err) {
      return res.status(500).json({ message: 'Error ' + err.message });
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModal.findOne({ email });
      if (!user)
        return res.status(400).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      return res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new UserServices();
