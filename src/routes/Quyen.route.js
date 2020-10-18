const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const quyen_controller = require('../controllers/Quyen.controller');
const { validate } = require('../validator');
// a simple test url to check that all of our files are communicating correctly.


router.post('/create', quyen_controller.quyen_create);
router.get('/list', quyen_controller.quyen_list);
router.get('/get/:id', quyen_controller.quyen_get);
router.put('/update/:id', quyen_controller.quyen_update);
router.delete('/del/:id', quyen_controller.quyen_delete);

module.exports = router;