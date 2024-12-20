const express = require('express');
const masterController = require('../controllers/masterController');
const router = express.Router();

// Define routes
router.get('/userType', masterController.userType);
router.get('/department', masterController.department);
router.get('/designation', masterController.designation);
router.get('/employeeStatus', masterController.employeeStatus);
router.get('/attendanceStatus', masterController.attendanceStatus);
router.get('/leaveStatus', masterController.leaveStatus);
router.get('/leaveType', masterController.leaveType);
router.get('/employeeFormMasters', masterController.employeeFormMasters);

module.exports = router;