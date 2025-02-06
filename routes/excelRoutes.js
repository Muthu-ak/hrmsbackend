const express = require("express");
const leaveController = require("../controllers/leaveController");
const projectController = require("../controllers/projectController");
const excelController = require("../controllers/excelController");

const router = express.Router();

router.get('/holiday', leaveController.holiday, excelController.holiday);
router.get('/leaveType', leaveController.leaveType, excelController.leaveType);
router.get('/clients', projectController.clients, excelController.clients);
router.get('/projects', projectController.projects, excelController.projects);

module.exports = router;