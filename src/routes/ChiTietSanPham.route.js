const express = require('express');
const router = express.Router();
const { validate } = require('../validator');
// Require the controllers WHICH WE DID NOT CREATE YET!!
const chitietsanpham_controller = require('../controllers/ChiTietSanPham.controller');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, chitietsanpham_controller.chitietsanpham_create);
router.get('/list', auth, chitietsanpham_controller.chitietsanpham_list);
router.get('/get/:id', auth, chitietsanpham_controller.chitietsanpham_get);
router.put('/update/:id', auth, chitietsanpham_controller.chitietsanpham_update);
router.delete('/del/:id', auth, chitietsanpham_controller.chitietsanpham_delete);
router.post('/:id/add-list-size', auth, chitietsanpham_controller.chitietsanpham_create_arr);
module.exports = router;