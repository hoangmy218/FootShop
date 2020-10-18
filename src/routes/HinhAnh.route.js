const multer = require('multer');
const path = require('path');
const express = require('express');
const router = express.Router();
// Require the controllers WHICH WE DID NOT CREATE YET!!
const hinhanh_controller = require('../controllers/HinhAnh.controller');
const { validate } = require('../validator');
// a simple test url to check that all of our files are communicating correctly.


// router.post('/create', hinhanh_controller.hinhanh_create);
router.get('/list', hinhanh_controller.hinhanh_list);
router.get('/get/:id', hinhanh_controller.hinhanh_get);
// router.put('/update/:id', hinhanh_controller.hinhanh_update);
router.delete('/del/:id', hinhanh_controller.hinhanh_delete);

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images');
    },
    filename: (req, file, cb) => {
      console.log(file);
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      return cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});
router.post('/upload',upload.single('file'), hinhanh_controller.hinh_upload);

module.exports = router;