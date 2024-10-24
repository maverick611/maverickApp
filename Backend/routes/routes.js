const express = require('express');
const router = express.Router();
const { 
    addResource, 
    fetchResources, 
    deleteResource,
    login, 
    getAdmins, 
    addAdmin, 
    adminPersonalDetails,
    deleteAdmin,
    addQuestion,
    editQuestion,
    getQuestionsWithDetails,
    deleteQuestion,
    deactivateOption,
    addOption,
    editOption,
    getdailyQuestions,
    getAdminByUsername,
    updatePassword,
    editResource,
    getAllDiseases,
    addDisease,
    deleteDisease
} = require('../controllers/controller');  // Import your controllers

router.post('/addResource', addResource);
router.get('/fetchResources', fetchResources);
router.put('/deleteResource/:resource_id', deleteResource);
router.post('/login', login);
router.get('/getAdmins', getAdmins);
router.post('/addAdmin', addAdmin);
router.post('/adminPersonalDetails', adminPersonalDetails);
router.put('/deleteAdmin/:username', deleteAdmin);
router.post('/addQuestion', addQuestion);
router.put('/editQuestion/:question_id', editQuestion);
router.get('/getQuestionsWithDetails', getQuestionsWithDetails);
router.put('/deleteQuestion/:question_id', deleteQuestion);
router.put('/deactivateOption/:options_id', deactivateOption);
router.post('/addOption', addOption);
router.put('/editOption', editOption);
router.get('/getdailyQuestions', getdailyQuestions);
router.get('/getAdmin/:username', getAdminByUsername);
router.put('/updatePassword', updatePassword);
router.put('/editResource', editResource);
router.get('/getAllDiseases', getAllDiseases);
router.post('/addDisease', addDisease);
router.put('/deleteDisease/', deleteDisease);

module.exports = router;
