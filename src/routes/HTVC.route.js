const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const htvc_controller = require('../controllers/HTVC.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validateHTVC(), htvc_controller.htvc_create);
router.get('/list', auth, htvc_controller.htvc_list);
router.get('/get/:id', auth, htvc_controller.htvc_get);
router.put('/update/:id', auth, validate.validateHTVC(), htvc_controller.htvc_update);
router.delete('/del/:id', auth, htvc_controller.htvc_delete);

module.exports = router;