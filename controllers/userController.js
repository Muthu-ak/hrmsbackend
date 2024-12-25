const userModel = require('../models/userModel');
const adodb = require('../adodb');
const db = require('../config/db');
const bcrypt = require("bcrypt");
const moment = require("moment");

const userController = {

  async getUserList(req, res){
    let params = req.query;
    let cal = (params.currentpage - 1) * params.postperpage;
    let offset = cal < 0 ? 0 : cal;
    try {
      const users = await userModel.getUserList(params.postperpage, offset);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async saveUser(req, res){

    const {first_name, last_name, user_login_id, emp_code, date_of_joining, date_of_birth} = req.body;

    req.body['user_name'] = `${first_name} ${last_name}`;

    // Only New User Create
    if(user_login_id == -1){
      req.body['pass_word'] = await bcrypt.hash(`${first_name}@${emp_code}` , 10);
    }
    
    req.body['date_of_joining'] = moment(date_of_joining).format('YYYY-MM-DD');
    req.body['date_of_birth'] = moment(date_of_birth).format('YYYY-MM-DD');

    try {

      await db.query('BEGIN');
      const id = await adodb.saveData('user_login', 'user_login_id', req.body);
      req.body['user_login_id'] = id;
      const employee_id = await adodb.saveData('employees', 'employee_id', req.body);
      await db.query('COMMIT');
      res.status(201).json({'msg':`${user_login_id > 0 ? "Updated Successfully" : "Saved Successfully"}`, 'user_login_id':id, 'employee_id':employee_id });

    } catch (err) {

      await db.query('ROLLBACK');
      res.status(500).json({ error: 'Internal Server Error' });

    }
  },

  async saveEducation(req, res){

    const {employee_education_id} = req.body;
    
    try {

      const id = await adodb.saveData('employee_education', 'employee_education_id', req.body);

      res.status(201).json({'msg':`${employee_education_id > 0 ? "Updated Successfully" : "Saved Successfully"}`, 'employee_education_id':id});

    } catch (err) {
      res.status(400).json({ error: 'Something went Wrong' });

    }
  },

  async saveExperience(req, res){

    const {employee_experience_id} = req.body;
    
    try {

      const id = await adodb.saveData('employee_experience', 'employee_experience_id', req.body);

      res.status(201).json({'msg':`${employee_experience_id > 0 ? "Updated Successfully" : "Saved Successfully"}`, 'employee_experience_id':id});

    } catch (err) {
      res.status(400).json({ error: 'Something went Wrong' });

    }
  },



}

module.exports = userController;
