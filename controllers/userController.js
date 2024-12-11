const userModel = require('../models/userModel');
const adodb = require('../adodb');
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
    try {
      const newUser = await adodb.saveData('user_login', 'user_login_id', req.body);
      res.status(201).json(newUser);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

}

module.exports = userController;
