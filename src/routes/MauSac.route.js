const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const mausac_controller = require('../controllers/MauSac.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validateMauSac(), mausac_controller.mausac_create);
router.get('/list', auth, mausac_controller.mausac_list);
router.get('/get/:id', auth,  mausac_controller.mausac_get);
router.put('/update/:id', auth, validate.validateMauSac(), mausac_controller.mausac_update);
router.delete('/del/:id', auth,  mausac_controller.mausac_delete);
router.get('/:id/list', auth, mausac_controller.mausac_productlist);
module.exports = router;