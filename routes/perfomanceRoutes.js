const express = require("express");
const performanceController = require("../controllers/performanceController");
const router = express.Router();

router.get('/appraisalCycleList', performanceController.appraisalCycleList);
router.post('/saveAppraisalCycle', performanceController.saveAppraisalCycle);
router.get('/competency', performanceController.competency);
router.post('/saveCompetency', performanceController.saveCompetency);
router.get('/goal', performanceController.goal);
router.post('/saveGoal', performanceController.saveGoal);

module.exports = router;