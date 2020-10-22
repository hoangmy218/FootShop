const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
// Require the controllers WHICH WE DID NOT CREATE YET!!
const GioHang_controller = require('../controllers/GioHang.controller');
const { validate } = require('../validator');
// a simple test url to check that all of our files are communicating correctly.

//Add to cart
router.post('/create', auth, validate.validateGioHang(), GioHang_controller.giohang_create);
//Update cart
router.post('/:id/update', auth, validate.validateGioHang(), GioHang_controller.giohang_update);
//Remove from cart
router.delete('/:id/delete', auth, GioHang_controller.giohang_delete);
//Clear cart
router.delete('/clear', auth, GioHang_controller.giohang_clear);
//View cart
router.get('/list', auth, GioHang_controller.giohang_list);
//Submit cart

router.get('/shortlist', auth, GioHang_controller.giohang_shortlist);






module.exports = router;