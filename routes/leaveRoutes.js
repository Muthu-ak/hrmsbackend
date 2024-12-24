const express = require("express");
const leaveController = require("../controllers/leaveController");
const router = express.Router();

router.get('/holiday', leaveController.holiday);
router.post('/saveHoliday', leaveController.saveHoliday);
router.get('/viewHoliday', leaveController.viewHoliday);

module.exports = router;