const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
// Require the controllers WHICH WE DID NOT CREATE YET!!
const binhluan_controller = require('../controllers/BinhLuan.controller');
const { validate } = require('../validator');

// a simple test url to check that all of our files are communicating correctly.

//create comment
router.post('/:id/create', auth, validate.validateBinhLuan(), binhluan_controller.binhluan_create);
//list comment order by product
router.get('/:id/list', binhluan_controller.binhluan_listbypro);
router.get('/list',auth, binhluan_controller.binhluan_list);
// //comment details
// router.get('/details/:id', binhluan_controller.binhluan_get);


module.exports = router;