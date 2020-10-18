const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator')
const auth = require('../middleware/auth')


// Require the controllers WHICH WE DID NOT CREATE YET!!
const diachi_controller = require('../controllers/DiaChi.controller');
const { validate } = require('../validator');

// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validateDiaChi(), diachi_controller.diachi_create);
router.get('/list', auth, diachi_controller.diachi_list);
router.get('/get/:id', auth, diachi_controller.diachi_get);
router.put('/update/:id', auth, validate.validateDiaChi(), diachi_controller.diachi_update);
router.delete('/del/:id', auth, diachi_controller.diachi_delete);

module.exports = router;