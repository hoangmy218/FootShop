const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const phieunhap_controller = require('../controllers/PhieuNhap.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validatePhieuNhap(),  phieunhap_controller.phieunhap_create);
router.get('/list', auth, phieunhap_controller.phieunhap_list);
router.get('/get/:id', auth, phieunhap_controller.phieunhap_get);
router.put('/update/:id', auth, validate.validatePhieuNhap(), phieunhap_controller.phieunhap_update);
router.put('/:id/save',  auth, phieunhap_controller.phieunhap_save);
router.delete('/del/:id', auth, phieunhap_controller.phieunhap_delete);
router.post('/:id/create', auth, phieunhap_controller.chitietphieunhap_create);
router.get('/:id/list',  auth,phieunhap_controller.chitietphieunhap_list);
router.delete('/chitiet/del/:id', auth, phieunhap_controller.chitietphieunhap_delete);
router.put('/chitiet/update/:id', auth, phieunhap_controller.chitietphieunhap_update);
//add pro color size 
router.post('/:id/add', auth, phieunhap_controller.chitietphieunhap_create_pcs);
router.post('/:id/add-list-pro', auth, phieunhap_controller.chitietphieunhap_create_arr);
module.exports = router;