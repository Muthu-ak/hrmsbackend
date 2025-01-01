const express = require("express");
const payrollController = require("../controllers/payrollController");
const router = express.Router();

router.get('/payrollList', payrollController.payrollList);
router.post('/savePayroll', payrollController.savePayroll);
router.get('/viewPayroll', payrollController.viewPayroll);

module.exports = router;