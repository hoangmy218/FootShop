const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
// Require the controllers WHICH WE DID NOT CREATE YET!!
const donhang_controller = require('../controllers/DonHang.controller');
const { validate } = require('../validator');
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, donhang_controller.donhang_create);
router.get('/:id/list', auth, donhang_controller.donhang_userlist);
router.put('/:id/cancel', auth, donhang_controller.donhang_cancel);
router.get('/details/:id', auth, donhang_controller.donhang_get);
// router.get('/get/:id', donhang_controller.donhang_get);
// router.put('/:id/save', donhang_controller.donhang_save);
// router.delete('/del/:id', donhang_controller.donhang_delete);




module.exports = router;