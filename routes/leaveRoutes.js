const express = require("express");
const leaveController = require("../controllers/leaveController");
const {getNofLeaveDays, checkLeaveExist, checkLeaveBalance} = require("../middleware/leaveMiddleware");
const router = express.Router();

router.get('/holiday', leaveController.holiday);
router.post('/saveHoliday', leaveController.saveHoliday);
router.get('/viewHoliday', leaveController.viewHoliday);

router.get('/leaveType', leaveController.leaveType);
router.post('/saveLeaveType', leaveController.saveLeaveType);
router.get('/viewLeaveType', leaveController.viewLeaveType);

router.get('/myleaves', leaveController.myleaves);
router.get('/leaveRequest', leaveController.leaveRequest);
router.post('/saveLeaveRequest', getNofLeaveDays, checkLeaveExist, checkLeaveBalance, leaveController.saveLeaveRequest);
router.get('/viewLeaveRequest', leaveController.viewLeaveRequest);

module.exports = router;