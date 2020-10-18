const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const kichco_controller = require('../controllers/KichCo.controller');
const { validate } = require('../validator');
const auth = require('../middleware/auth')
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', auth, validate.validateKichCo(), kichco_controller.kichco_create);
router.get('/list', auth, kichco_controller.kichco_list);
router.get('/get/:id', auth, kichco_controller.kichco_get);
router.put('/update/:id', auth, validate.validateKichCo(), kichco_controller.kichco_update);
router.delete('/del/:id', auth, kichco_controller.kichco_delete);

module.exports = router;