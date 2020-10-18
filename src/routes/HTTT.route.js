const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const httt_controller = require('../controllers/HTTT.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validateHTTT(), httt_controller.httt_create);
router.get('/list', auth, httt_controller.httt_list);
router.get('/get/:id', auth, httt_controller.httt_get);
router.put('/update/:id',auth, validate.validateHTTT(), httt_controller.httt_update);
router.delete('/del/:id', auth, httt_controller.httt_delete);

module.exports = router;