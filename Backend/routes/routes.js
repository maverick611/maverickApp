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
const {login, signup, confirm_signup, auth, logout, home, questionnaire, questionnaire_responses } = require('../controllers/controller');

// router.post('/signup', signup);

router.post('/login', login);
router.post('/signup', signup)
router.get('/questionnaire', auth, questionnaire); 
router.get('/questionnaire_responses', auth, questionnaire_responses); 
router.post('/confirm_signup', confirm_signup); 
router.post('/logout', logout);
router.get('/home', home)




module.exports = router;