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

module.exports = router;