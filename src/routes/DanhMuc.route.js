const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { validate } = require('../validator');
// Require the controllers WHICH WE DID NOT CREATE YET!!
const danhmuc_controller = require('../controllers/DanhMuc.controller');

// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validateDanhMuc(), danhmuc_controller.danhmuc_create);
router.get('/list', auth, danhmuc_controller.danhmuc_list);
router.get('/get/:id', auth, danhmuc_controller.danhmuc_get);
router.put('/update/:id', auth, validate.validateDanhMuc(),danhmuc_controller.danhmuc_update);
router.delete('/del/:id', auth, danhmuc_controller.danhmuc_delete);

module.exports = router;