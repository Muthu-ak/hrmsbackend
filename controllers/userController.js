const userModel = require('../models/userModel');

const userController = {

  async getUserList(req, res){
      try {
        const users = await userModel.getUserList();
        res.status(200).json(users);
      } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
  },

  async saveUser(req, res){
    const { name, email, password } = req.body;
    try {
      const newUser = await userModel.createUser({ name, email, password });
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

}

module.exports = userController;
