
const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticate');
const controller = require('../controllers/user')


router.post('/signup',  controller.signup)
router.post('/verifyEmail', authenticateUser ,controller.verifyEmail);
router.post('/login' ,controller.login)


 module.exports = router