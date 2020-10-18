const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const trangthai_controller = require('../controllers/TrangThai.controller');
const { validate } = require('../validator');
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', trangthai_controller.trangthai_create);
router.get('/list', trangthai_controller.trangthai_list);
router.get('/get/:id', trangthai_controller.trangthai_get);
router.put('/update/:id', trangthai_controller.trangthai_update);
router.delete('/del/:id', trangthai_controller.trangthai_delete);

module.exports = router;