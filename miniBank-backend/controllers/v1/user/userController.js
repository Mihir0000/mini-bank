const { userService } = require('../../../services');
class UserController {
  async login(req, res, next) {
    try {
      await userService.login(req, res, next);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }

  async register(req, res, next) {
    try {
      await userService.register(req, res, next);
    } catch (err) {
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

module.exports = new UserController();
