const express = require("express");
const organizationController = require("../controllers/organizationController");
const router = express.Router();

router.get('/department', organizationController.department);
router.post('/saveDepartment', organizationController.saveDepartment);
router.get('/viewDepartment', organizationController.viewDepartment);

router.get('/designation', organizationController.designation);
router.post('/saveDesignation', organizationController.saveDesignation);
router.get('/viewDesignation', organizationController.viewDesignation);

module.exports = router;