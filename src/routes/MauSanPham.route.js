const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const mausanpham_controller = require('../controllers/MauSanPham.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validateMauSanPham(), mausanpham_controller.mausanpham_create);
router.get('/list', auth, mausanpham_controller.mausanpham_list);
router.get('/get/:id', auth, mausanpham_controller.mausanpham_get);
router.put('/update/:id', auth, validate.validateMauSanPham(), mausanpham_controller.mausanpham_update);
router.delete('/del/:id', auth, mausanpham_controller.mausanpham_delete);

module.exports = router;