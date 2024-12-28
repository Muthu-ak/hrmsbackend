const userModel = require('../models/userModel');
const adodb = require('../adodb');
const db = require('../config/db');
const bcrypt = require("bcrypt");
const moment = require("moment");
const multer = require('multer');
const path = require('path');
const crypto = require("crypto");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the folder where you want to save the file
    cb(null, './uploads'); // Ensure you have the folder created
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using the original name and current timestamp
    const randomString = crypto.randomBytes(4).toString('hex');
    cb(null, randomString + Date.now() + path.extname(file.originalname)); // Add extension (.pdf)
  }
});

// File filter to accept only PDF files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only PDF files are allowed!'), false); // Reject the file
  }
};

// Initialize multer upload with storage and file filter
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size (e.g., 10MB)
});



const userController = {

  async getUserList(req, res){
    let params = req.query;
    let cal = (params.currentpage - 1) * params.postperpage;
    let offset = cal < 0 ? 0 : cal;

    let where = "";

    for(let x in params.filter){
      if(params.filter[x] != null){
        if(x == 'm_user_type_id'){
          where += ` AND ul.${x} = ${Number(params.filter[x])}`;

        }
        else{
          where += ` AND e.${x} = ${Number(params.filter[x])}`;
        }
        
      }
    }

    let orderBY = "ORDER BY e.created_on DESC";
    if(params.hasOwnProperty("sorting") && params.sorting['direction'] != 'none'){
      orderBY = `ORDER BY ${params.sorting["accessor"]} ${params.sorting["direction"]}`; 
    }

    try {
      const users = await userModel.getUserList(params.postperpage, offset, orderBY, where);
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

    const {employee_experience_id, employment_date} = req.body;
    if(!req.body.hasOwnProperty('is_deleted')){
      req.body['start_date'] = moment(employment_date[0]).format('YYYY-MM-DD');
      req.body['end_date'] = moment(employment_date[1]).format('YYYY-MM-DD');
    }
    
    try {

      const id = await adodb.saveData('employee_experience', 'employee_experience_id', req.body);

      res.status(201).json({'msg':`${employee_experience_id > 0 ? "Updated Successfully" : "Saved Successfully"}`, 'employee_experience_id':id});

    } catch (err) {
      res.status(400).json({ error: 'Something went Wrong' });

    }
  },

  async saveBankDetails(req, res){

    const {employee_bank_id} = req.body;
    
    try {

      const id = await adodb.saveData('employee_bank', 'employee_bank_id', req.body);

      res.status(201).json({'msg':`${employee_bank_id > 0 ? "Updated Successfully" : "Saved Successfully"}`, 'employee_bank_id':id});

    } catch (err) {
      res.status(400).json({ error: 'Something went Wrong' });

    }
  },

  async experience(req, res){
    try {
      const users = await userModel.experience(req.query.employee_id);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  async saveDocument(req, res){
    try {
      // Check if a file is uploaded
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      // File is uploaded successfully
      res.status(200).json({ message: 'PDF uploaded successfully', file: req.file });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

}

module.exports = {upload, userController};
