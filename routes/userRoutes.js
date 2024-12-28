
const express = require('express');
const {upload, userController} = require('../controllers/userController');
const router = express.Router();


// Define routes
router.get('/getUserList', userController.getUserList);
router.post('/saveUser', userController.saveUser);
router.post('/saveEducation', userController.saveEducation);
router.post('/saveExperience', userController.saveExperience);
router.post('/saveBankDetails', userController.saveBankDetails);
router.get('/experience', userController.experience);
router.post('/saveDocument',  upload.single('file'), userController.saveDocument);

module.exports = router;
