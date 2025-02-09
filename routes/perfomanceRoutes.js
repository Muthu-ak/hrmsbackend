const express = require("express");
const performanceController = require("../controllers/performanceController");
const router = express.Router();

router.get('/appraisalCycleList', performanceController.appraisalCycleList);
router.post('/saveAppraisalCycle', performanceController.saveAppraisalCycle);

module.exports = router;