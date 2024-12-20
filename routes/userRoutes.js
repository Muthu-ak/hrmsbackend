
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

// Define routes
router.get('/getUserList', userController.getUserList);
router.post('/saveUser', userController.saveUser);

module.exports = router;
