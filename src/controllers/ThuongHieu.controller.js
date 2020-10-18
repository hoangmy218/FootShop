const ThuongHieu = require('../models/ThuongHieu.model');
const {response, request} = require('express');
const {check, validationResult} = require('express-validator');
const ChiTietSanPhamModel = require('../models/ChiTietSanPham.model');
const SanPham = require('../models/SanPham.model')

exports.test = function (req, res){
    res.send('Test controller');
};

exports.thuonghieu_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    } else {
        try {
            var th = await ThuongHieu.find({ ten: request.body.ten}).exec();
            if (th.length != 0){
                response.json({       
                    success: false,   
                    message: 'Brand has exist',
                    data: th
                });
            } else {
                var thuonghieu = new ThuongHieu(request.body);
                var result = await thuonghieu.save();
                response.json({
                    success: true,
                    message: 'Brand created successfully',
                    data: result
                });
            }
    
        } catch (error){
            response.send(error);
        }
    }
    
};

exports.thuonghieu_list = async(request, response) =>{
    try {
        var result = await ThuongHieu.find().exec();
        response.json({
            data: result
        });
    } catch (error){
        response.status(500).send(error);
    }
};

exports.thuonghieu_get = async(request, response)=>{
    try{
        var result = await ThuongHieu.findById(request.params.id).exec();
        if (result){
            response.json({
                data: result
            });
        } else{
            response.json({
                success: false,
                message: 'Brand not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

exports.thuonghieu_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    } else {
        try{
        
            var result = await ThuongHieu.findById(request.params.id).exec();
            if (result){
                //Check name unique
                var th = await ThuongHieu.find({ ten: request.body.ten}).exec();
                if ((th.length == 0) || (th[0].id == request.params.id)){
                    result.set(request.body);
                    var res = await result.save();
                    response.json({
                        success: true,
                        message: 'Brand updated successfully',
                        data: res
                    });
                }
                if (th[0]._id != request.params.id){
                    response.json({
                        success: false,
                        message: 'Brand has exist'
                    });
                }
                
            } else{
                response.json({
                    success: false,
                    message: 'Brand not found'
                });
            }
            
        } catch(error){
            response.send(error);
        }
    }
   
}

exports.thuonghieu_delete = async(request, response)=>{
    try{
        var result = await ThuongHieu.findById(request.params.id).exec();
        if (result){
            var sp = await SanPham.find({thuonghieu_id: request.params.id}).exec()
            if (sp.length > 0){
                response.json({
                    success: false,
                    message: 'Cannot delete this brand'
                });
            } else {
                var result = await ThuongHieu.deleteOne({ _id: request.params.id}).exec();
                response.json({
                    success: true,
                    message: 'Brand deleted successfully'
                });
            }
            
        } else{
            response.json({
                success: false,
                message: 'Brand not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}