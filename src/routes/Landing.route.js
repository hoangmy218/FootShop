const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const Landing_controller = require('../controllers/Landing.controller');
const { validate } = require('../validator');
// a simple test url to check that all of our files are communicating correctly.

//Total Customer
router.post('/search', validate.validateTimKiem(), Landing_controller.sanpham_timkiem);

//List product
router.get('/product', Landing_controller.sanpham_list);
router.get('/:id/:color/details', Landing_controller.sanpham_details);
router.get('/:id/comment', Landing_controller.sanpham_comment);
router.get('/category', Landing_controller.danhmuc_list);
router.get('/brand', Landing_controller.thuonghieu_list);
router.get('/quantity/:id', Landing_controller.soluong_get);
router.get('/htvc', Landing_controller.htvc_get);
router.get('/htvc/:id', Landing_controller.htvc_details);
router.get('/httt', Landing_controller.httt_get);
router.post('/payWithStripe', Landing_controller.stripePost);

module.exports = router;