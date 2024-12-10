const authModel = require('../models/authModel');

const authController = {
  async login(req, res){
      try {
        const users = await authModel.login(req.body);
        res.status(200).json(users);
      } catch (err) {
        res.status(400).json({ error: err});
      }
  },

}

module.exports = authController;
