const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const thuonghieu_controller = require('../controllers/ThuongHieu.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.
router.get('/test', thuonghieu_controller.test);

router.post('/create', auth, validate.validateThuongHieu(), thuonghieu_controller.thuonghieu_create);
router.get('/list',  auth, validate.validateThuongHieu(), thuonghieu_controller.thuonghieu_list);
router.get('/get/:id',  auth, validate.validateThuongHieu(), thuonghieu_controller.thuonghieu_get);
router.put('/update/:id',  auth, validate.validateThuongHieu(), thuonghieu_controller.thuonghieu_update);
router.delete('/del/:id',  auth, validate.validateThuongHieu(), thuonghieu_controller.thuonghieu_delete);

module.exports = router;