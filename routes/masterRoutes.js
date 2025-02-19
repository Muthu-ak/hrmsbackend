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
router.get('/leaveYear', masterController.leaveYear);

router.get('/employeeFormMasters', masterController.employeeFormMasters);

router.get('/clients', masterController.clients);
router.get('/projects', masterController.projects);
router.get('/projectStatus', masterController.projectStatus);

router.get('/userList', masterController.userList);
router.get('/reportingList', masterController.reportingList);
router.get('/employeeList', masterController.employeeList);

router.get('/appraisalCycle', masterController.appraisalCycle);

router.get('/tasks', masterController.tasks);
router.get('/teamMembers', masterController.teamMembers);


module.exports = router;