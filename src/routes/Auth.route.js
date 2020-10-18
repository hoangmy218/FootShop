const express = require('express');
const router = express.Router();
const auth_controller = require('../controllers/Auth.Controller');
const auth = require('../middleware/auth')
const { validate } = require('../validator');

router.post('/signup', auth_controller.auth_signup);
router.post('/login', auth_controller.auth_login);
router.get('/profile/me', auth, auth_controller.auth_me);
router.post('/logout',auth, auth_controller.auth_logout);
router.post('/logoutall', auth, auth_controller.auth_logoutall);

module.exports = router;