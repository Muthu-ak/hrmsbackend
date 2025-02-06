const express = require('express');
const attendanceController = require('../controllers/attendanceController');
const router = express.Router();

router.get('/attendance', attendanceController.attendance);
router.post('/saveAttendance', attendanceController.saveAttendance);
router.get('/viewAttendance', attendanceController.viewAttendance);
router.get('/attendanceReport', attendanceController.attendanceReport);

module.exports = router;