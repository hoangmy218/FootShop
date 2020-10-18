const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const khuyenmai_controller = require('../controllers/KhuyenMai.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validateKhuyenMai(), khuyenmai_controller.khuyenmai_create);
router.get('/list', auth, khuyenmai_controller.khuyenmai_list);
router.get('/get/:id', auth, khuyenmai_controller.khuyenmai_get);
router.put('/update/:id', auth, validate.validateKhuyenMai(), khuyenmai_controller.khuyenmai_update);
router.delete('/del/:id', auth, khuyenmai_controller.khuyenmai_delete);
router.put('/:id/active', auth, khuyenmai_controller.khuyenmai_active);
router.put('/:id/deactive', auth, khuyenmai_controller.khuyenmai_deactive);
router.put('/:id/addproduct', auth, khuyenmai_controller.khuyenmai_sanpham);

module.exports = router;