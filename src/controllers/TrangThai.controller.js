const TrangThai = require('../models/TrangThai.model');
const {response, request} = require('express');
const {check, validationResult} = require('express-validator');


exports.trangthai_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }
    try {
        var tt = await TrangThai.find({ ten: request.body.ten}).exec();
        if (tt.length == 0){
            
            var trangthai = new TrangThai(request.body);
            var result = await trangthai.save();
            response.json({
                success: true,
                message: 'Stage created successfully',
                data: result
            });
        } else {
            response.json({          
                message: 'Stage has exist',
                data: tt
            });
        }
    } catch (error){
        response.send(error);
    }
};

exports.trangthai_list = async(request, response) =>{
    try {
        var result = await TrangThai.find().exec();
        response.json({
            data: result
        });
    } catch (error){
        response.status(500).send(error);
    }
};

exports.trangthai_get = async(request, response)=>{
    try{
        var result = await TrangThai.findById(request.params.id).exec();
        if (result){
            response.json({
                data: result
            });
        } else{
            response.json({
                message: 'Stage not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

exports.trangthai_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }
    try{
        var result = await TrangThai.findById(request.params.id).exec();
        if (result){
            //Check name unique
            var tt = await TrangThai.find({ ten: request.body.ten}).exec();
            if ((tt.length == 0) || (tt[0].id == request.params.id)){
                result.set(request.body);
                var res = await result.save();
                response.json({
                    success: true,
                    message: 'Stage updated successfully',
                    data: res
                });
            }
            if (tt[0]._id != request.params.id){
                response.json({          
                    message: 'Stage has exist',
                    data: tt
                });
            }
            
        } else{
            response.json({
                message: 'Stage not found'
            });
        }
        
    } catch(error){
        response.send(error);
    }
}

exports.trangthai_delete = async(request, response)=>{
    try{
        var result = await TrangThai.findById(request.params.id).exec();
        if (result){
            var result = await TrangThai.deleteOne({ _id: request.params.id}).exec();
            response.json({
                message: 'Stage deleted successfully'
            });
        } else{
            response.json({
                message: 'Stage not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}