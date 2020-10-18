const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const sanpham_controller = require('../controllers/SanPham.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validateSanPham(), sanpham_controller.sanpham_create);
router.get('/list', auth, sanpham_controller.sanpham_list);
router.get('/get/:id', auth, sanpham_controller.sanpham_get);
router.put('/update/:id', auth, validate.validateSanPham(), sanpham_controller.sanpham_update);
router.delete('/del/:id', auth, sanpham_controller.sanpham_delete);
router.put('/:id/active', auth, sanpham_controller.sanpham_active);
router.put('/:id/deactive', auth, sanpham_controller.sanpham_deactive);

module.exports = router;