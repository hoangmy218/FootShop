const DiaChi = require('../models/DiaChi.model');
const {response, request} = require('express');
const {check, validationResult} = require('express-validator')
const DonHang = require('../models/DonHang.model')

exports.diachi_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            success: false,
            message: errors
        })
    }else {
        try {
        
            var diachi = new DiaChi(request.body);
            var result = await diachi.save();
            response.json({
                success: true,
                message: 'Address added successfully',
                data: result
            });
        

        } catch (error){
            response.send(error);
        }
    }
    
};

exports.diachi_list = async(request, response) =>{
    try {
        var result = await DiaChi.find().sort({_id: -1}).exec();
        response.json({
            data: result
        });
    } catch (error){
        response.status(500).send(error);
    }
};

exports.diachi_get = async(request, response)=>{
    try{
        var result = await DiaChi.findById(request.params.id).exec();
        if (result){
            response.json({
                data: result
            });
        } else{
            response.json({
                success: false,
                message: 'Address not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

exports.diachi_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            message: errors
        })
    }else {
        try{
            var result = await DiaChi.findById(request.params.id).exec();
            if (result){
                //Check name unique
                var dc = await DiaChi.find({ ten: request.body.ten}).exec();
                if ((dc.length == 0) || (dc[0].id == request.params.id)){
                    result.set(request.body);
                    var res = await result.save();
                    response.json({
                        success: true,
                        message: 'Address updated successfully',
                        data: res
                    });
                }
                if (dc[0]._id != request.params.id){
                    response.json({   
                        success: false,       
                        message: 'Address has exist',
                        data: dc
                    });
                }
                
            } else{
                response.json({
                    success: false,
                    message: 'Address not found'
                });
            }
            
        } catch(error){
            response.send(error);
        }
    }
    
}

exports.diachi_delete = async(request, response)=>{
    try{
        var result = await DiaChi.findById(request.params.id).exec();
        if (result){
            var dc = await DonHang.find({diachi_id: request.params.id}).exec()
            if (dc.length >0){
                response.json({
                    success: false,
                    message: 'Cannot delete this address'
                });
            }else {
                var result = await DiaChi.deleteOne({ _id: request.params.id}).exec();
                response.json({
                    success: true,
                    message: 'Address deleted successfully'
                });
            }
            
        } else{
            response.json({
                success: false,
                message: 'Address not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}

