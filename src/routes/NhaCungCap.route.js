const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const nhacungcap_controller = require('../controllers/NhaCungCap.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validateNhaCungCap(), nhacungcap_controller.nhacungcap_create);
router.get('/list', auth, nhacungcap_controller.nhacungcap_list);
router.get('/get/:id', auth, nhacungcap_controller.nhacungcap_get);
router.put('/update/:id', auth, validate.validateNhaCungCap(), nhacungcap_controller.nhacungcap_update);
router.delete('/del/:id', auth, nhacungcap_controller.nhacungcap_delete);

module.exports = router;