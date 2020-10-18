const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
// Require the controllers WHICH WE DID NOT CREATE YET!!
const nguoidung_controller = require('../controllers/NguoiDung.controller');
const { validate } = require('../validator');
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', nguoidung_controller.nguoidung_create);
router.get('/list', auth, nguoidung_controller.nguoidung_list);
router.get('/get/:id', nguoidung_controller.nguoidung_get);
router.put('/update/:id', nguoidung_controller.nguoidung_update);
router.delete('/del/:id', nguoidung_controller.nguoidung_delete);
router.put('/:id/active', nguoidung_controller.nguoidung_active);
router.put('/:id/deactive', nguoidung_controller.nguoidung_deactive);
router.put('/avatar/:id', nguoidung_controller.nguoidung_avatar);
module.exports = router;