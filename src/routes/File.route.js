const { response } = require('express');
const express = require('express');
const router = express.Router();

var multer  = require('multer');
const { hinh_upload } = require('../controllers/HinhAnh.controller');
const HinhAnh = require('../models/HinhAnh.model');
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
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({storage: storage});


router.post('/upload',upload.single('file'),function(req, res, next) {
    console.log(req.file);
    if(!req.file) {
      res.status(500);
      return next(err);
    }
    // var url =  `http://localhost:300/uploads/${req.file.filename}`;
    // var hinhanh = new HinhAnh();
    // hinhanh.hinh = url;
    // hinhanh.stt = req.body.stt;
    // var result = hinhanh.save();
    // res.json({
    //     success: true,
    //     message: 'Upload image successfully',
    //     hinhanh: result
    // })
    res.json({ fileUrl: 'http://localhost:3000/uploads/' + req.file.filename });
})

module.exports = router;