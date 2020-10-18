const BinhLuan = require('../models/BinhLuan.model')
const {request, response} = require('express')
const mongoClient = require('mongodb').MongoClient;
const {check, validationResult} = require('express-validator');

exports.binhluan_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }else {
        try {
            var bl =  new BinhLuan({
                noidung: request.body.noidung,
                danhgia: request.body.danhgia,
                ngaybl : request.body.ngaybl,
                sanpham_id: request.params.id,
                nguoidung_id: request.user._id
            })
            var result = await bl.save();
            response.json({
                success: true,
                message: 'Comment uploaded successfully',
                data: result
            });
        } catch (error) {
            response.json({ message: error})
        } 
    }
    
}

exports.binhluan_listbypro = async(request, response)=>{
    try {
        var result = await BinhLuan.find({sanpham_id: request.params.id}).exec();
        response.json({
            data: result
        })
    } catch (error) {
        response.json({ message: error})
    }
}

//FOR ADMIN
exports.binhluan_list = async(request, response)=>{
    try {
        var result = await BinhLuan.find().exec();
        response.json({
            data: result
        })
    } catch (error) {
        response.json({ message: error})
    }
}