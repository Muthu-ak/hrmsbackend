const express = require("express");
const performanceController = require("../controllers/performanceController");
const router = express.Router();

router.get('/appraisalCycleList', performanceController.appraisalCycleList);
router.post('/saveAppraisalCycle', performanceController.saveAppraisalCycle);
router.get('/appraiseelist', performanceController.appraiseelist);
router.post('/saveAppraiseelist', performanceController.saveAppraiseelist);
router.get('/competency', performanceController.competency);
router.post('/saveCompetency', performanceController.saveCompetency);

router.get('/questions', performanceController.questions);
router.post('/saveSelfAppraisal', performanceController.saveSelfAppraisal);
router.get('/viewAppraisee', performanceController.viewAppraisee);

module.exports = router;