// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // Route definitions
// router.post('/login', userController.login);
// router.post('/signup', userController.signup);
// router.post('/confirm_signup', userController.confirmSignup);
// router.get('/home', userController.home);

// module.exports = router;


const express = require('express');
const router = express.Router();
const {login, signup, confirm_signup, auth, logout, home, questionnaire, questionnaire_responses, get_submission, submission_report, 
    daily_questionnaire, daily_questionnaire_responses, daily_reports, daily_get_submission,
    get_personal_info,update_personal_info, get_profile_picture,  reports, daily_save_draft, questionnaire_save_draft,
 confirm_personal_changes} = require('../controllers/controller');


router.post('/login', login);
router.post('/signup', signup); //need changes on how to handle temp data
router.get('/questionnaire', auth, questionnaire); 
router.post('/questionnaire_responses', auth, questionnaire_responses); 
router.post('/confirm_signup', confirm_signup); 
router.get('/logout', logout);
router.get('/home',auth, home);
router.get('/reports',auth, reports);//might need change for weightages
router.post('/get_submission', auth, get_submission)
router.get('/submission_report', auth, submission_report)
router.get('/daily_questionnaire', auth, daily_questionnaire)
router.post('/daily_questionnaire_responses', auth, daily_questionnaire_responses)
router.get('/daily_reports', auth, daily_reports)
router.post('/daily_get_submission', auth, daily_get_submission)
router.get('/get_personal_info', auth, get_personal_info)
router.put('/update_personal_info', auth, update_personal_info)   //need changes
router.post('/confirm_personal_changes', auth, confirm_personal_changes) //need changes
router.get('/get_profile_picture', auth, get_profile_picture);
router.post('/dail_save_draft',auth, daily_save_draft);

router.post('/questionnaire_save_draft',auth, questionnaire_save_draft);
// router.get('/get_latest_submission', auth, get_latest_submission)
// router.get('/get_daily_latest', auth, get_daily_latest)
module.exports = router;