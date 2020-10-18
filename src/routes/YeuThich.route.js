const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
// Require the controllers WHICH WE DID NOT CREATE YET!!
const YeuThich_controller = require('../controllers/YeuThich.controller');
const { validate } = require('../validator');
// a simple test url to check that all of our files are communicating correctly.

//Add to cart
router.post('/:id/create', auth, YeuThich_controller.YeuThich_create);
//Remove from cart
router.delete('/:id/delete', auth, YeuThich_controller.YeuThich_delete);
//View cart
router.get('/list', auth, YeuThich_controller.YeuThich_list);
//Submit cart






module.exports = router;