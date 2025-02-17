const express = require('express');
const projectController = require('../controllers/projectController');
const router = express.Router();

router.get('/clients', projectController.clients);
router.post('/saveClient', projectController.saveClient);
router.get('/viewClient', projectController.viewClient);

router.get('/projects', projectController.projects);
router.post('/saveProject', projectController.saveProject);
router.get('/viewProject', projectController.viewProject);

router.get('/projectDetails', projectController.projectDetails);

router.post('/saveTeamMember', projectController.saveTeamMember);
router.get('/teamMembers', projectController.teamMembers);

router.get('/tasks', projectController.tasks);
router.post('/saveTask', projectController.saveTask);

router.get('/timesheets', projectController.timesheets);
router.post('/saveTimesheets', projectController.saveTimesheets);

module.exports = router;