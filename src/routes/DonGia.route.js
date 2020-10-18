const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const dongia_controller = require('../controllers/DonGia.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/:id/create',auth, validate.validateDonGia(), dongia_controller.dongia_create);
router.get('/:id/list', auth, dongia_controller.dongia_list);
router.get('/:id/new', auth, dongia_controller.dongia_new);

module.exports = router;