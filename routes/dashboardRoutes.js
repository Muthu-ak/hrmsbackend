const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const router = express.Router();

// Define routes
router.get('/getAll', dashboardController.getAll);
router.get('/attendance', dashboardController.attendance);

module.exports = router;