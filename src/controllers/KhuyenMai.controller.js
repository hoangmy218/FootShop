const KhuyenMai = require('../models/KhuyenMai.model');
const {response, request} = require('express');
const SanPham = require('../models/SanPham.model');
const mongoClient = require('mongodb').MongoClient;
const {check, validationResult} = require('express-validator');
const SanPhamModel = require('../models/SanPham.model');

exports.khuyenmai_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }else {
        try {
            var ngaybd = new Date(request.body.ngaybd);
            var ngaykt = new Date(request.body.ngaykt);
            if (parseInt((ngaykt-ngaybd)/ (1000 * 60 * 60 * 24)) < 0){
                response.json({ 
                    success: false,         
                    message: 'The ended date must be later than the started date',
                    data: request.body
                });
            }
            var km = await KhuyenMai.find({ chude : request.body.chude}).exec();
            if (km.length != 0){
                response.json({    
                    success: false,      
                    message: 'Discount has exist',
                    data: km
                });
            } else {
                var khuyenmai = new KhuyenMai(request.body);
                var res = await khuyenmai.save();
                
                const result = await KhuyenMai.findById(res.id).populate('sanpham_id').exec();
                response.json({
                    success: true,
                    message: 'Discount added successfully',
                    data: result,
                    diff: parseInt((ngaykt-ngaybd)/ (1000 * 60 * 60 * 24))
                });
                    
            }
    
        } catch (error){
            response.send(error);
        }
    }
    
};

exports.khuyenmai_list = async(request, response) =>{
    try {
        
        const result = await KhuyenMai.find().populate('sanpham_id').exec();

        response.json({
            data: result
        });
    
    
    } catch (error){
        response.status(500).send(error);
    }
};

exports.khuyenmai_get = async(request, response)=>{
    try{
        const result = await KhuyenMai.findById(request.params.id).populate('sanpham_id').exec();
        if (result){
            
            response.json({
                data: result
            });
        } else{
            response.json({
                success: false,
                message: 'Discount not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

exports.khuyenmai_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }else {
        try{
            var result = await KhuyenMai.findById(request.params.id).exec();
            if (result){
                var ngaybd = new Date(request.body.ngaybd);
                var ngaykt = new Date(request.body.ngaykt);
                if (parseInt((ngaykt-ngaybd)/ (1000 * 60 * 60 * 24)) < 0){
                    response.json({         
                        success: false, 
                        message: 'The ended date must be later than the started date',
                        data: request.body
                    });
                } else{
                    //Check name unique
                    var km = await KhuyenMai.find({ chude: request.body.chude}).exec();
                    if ((km.length == 0) || (km[0].id == request.params.id)){
                        result.set(request.body);
                        var res = await result.save();
                        const km = await KhuyenMai.findById(res.id).populate('sanpham_id').exec();
                        response.json({
                            success: true,
                            message: 'Discount updated successfully',
                            data: km
                        });
                    }
                    if (km[0]._id != request.params.id){
                        response.json({    
                            success: false,      
                            message: 'Discount has exist',
                            data: km
                        });
                    }
                }
                
                
                
            } else{
                response.json({
                    success: false,
                    message: 'Discount not found'
                });
            }
            
        } catch(error){
            response.send(error);
        }
    }
    
}

exports.khuyenmai_delete = async(request, response)=>{
    try{
        var result = await KhuyenMai.findById(request.params.id).exec();
        if (result){
            var sp = await SanPhamModel.find({khuyenmai_id: request.params.id}).exec()
            if (sp.length> 0){
                for (var i= 0 ; i<sp.length; i++){
                    await SanPham.update({_id: sp[i]._id}, {$set: {khuyenmai_id: null}}).exec()
                }
            }
            var result = await KhuyenMai.deleteOne({ _id: request.params.id}).exec();
            response.json({
                success: true,
                message: 'Discount deleted successfully'
            });
        } else{
            response.json({
                success: false,
                message: 'Discount not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}

exports.khuyenmai_active = async(request, response)=>{
    try {
        var result = await KhuyenMai.findById(request.params.id).exec();
        if (result){
            var nd = await KhuyenMai.update({ _id: request.params.id}, {$set: {trangthai: true}}).exec();
            var res = await KhuyenMai.findById(request.params.id).exec();
            response.json({
                success: true,
                message: 'Discount activated successfully',
                data: res
            })
        } else{
            response.json({
                success: false,
                message: 'Discount not found'
            });
        }
    } catch (error) {
        response.send(error);
    }
}

exports.khuyenmai_deactive = async(request, response)=>{
    try {
        var result = await KhuyenMai.findById(request.params.id).exec();
        if (result){
            var nd = await KhuyenMai.update({ _id: request.params.id}, {$set: {trangthai: false}}).exec();
            var res = await KhuyenMai.findById(request.params.id).exec();
            response.json({
                success: true,
                message: 'Discount deactivated successfully',
                data: res
            })
        } else{
            response.json({
                success: false,
                message: 'Discount not found'
            });
        }
    } catch (error) {
        response.send(error);
    }
}

exports.khuyenmai_sanpham = async(request, response)=>{
    try {
        var result = await KhuyenMai.findById(request.params.id).exec();
        if (result){
            var sanpham = await SanPham.update(
                {_id: request.body.sanpham_id}, 
                {$set: {khuyenmai_id: request.params.id}}).exec();
            var sp_new = await SanPham.findById(request.body.sanpham_id).exec();
            response.json({
                success: true,
                message: "Add discount to product successfully",
                data: sp_new
            });
        } else{
            response.json({
                success: false,
                message: 'Discount not found'
            });
        }
    } catch (error) {
        response.send(error);
    }
}