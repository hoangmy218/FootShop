const HTVC = require('../models/HTVC.model');
const {response, request} = require('express');
const {check, validationResult} = require('express-validator');
const DonHangModel = require('../models/DonHang.model');

exports.htvc_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            success: false,
            error: errors
        })
    }else {
        if (request.body.phi < 1000){
            response.json({
                success: false,
                error: 'Min cost must be 1000'
            });
        }else {
            try {
                var hinhthuc = await HTVC.find({ ten: request.body.ten}).exec();
                if (hinhthuc.length != 0){
                    response.json({        
                        success: false,  
                        message: 'Delivery has exist',
                        data: hinhthuc
                    });
                } else {
                    var htvc = new HTVC(request.body);
                    var result = await htvc.save();
                    response.json({
                        success: true,
                        message: 'Delivery created successfully',
                        data: result
                    });
                }
        
            } catch (error){
                
                response.send(error);
            }
        }
        
    }
    
};

exports.htvc_list = async(request, response) =>{
    try {
        var result = await HTVC.find().exec();
        response.json({
            data: result
        });
    } catch (error){
        response.status(500).send(error);
    }
};

exports.htvc_get = async(request, response)=>{
    try{
        var result = await HTVC.findById(request.params.id).exec();
        if (result){
            response.json({
                data: result
            });
        } else{
            response.json({
                success: false,
                message: 'Delivery not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

exports.htvc_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    } else {
        if (request.body.phi < 1000){
            response.json({
                success: false,
                error: 'Min cost must be 1000'
            });
        }else {
            try{
                var result = await HTVC.findById(request.params.id).exec();
                if (result){
                    //Check name unique
                    var hinhthuc = await HTVC.find({ ten: request.body.ten}).exec();
                    if ((hinhthuc.length == 0) || (hinhthuc[0].id == request.params.id)){
                        result.set(request.body);
                        var res = await result.save();
                        response.json({
                            success: true,
                            message: 'Delivery updated successfully',
                            data: res
                        });
                    }
                    if (hinhthuc[0]._id != request.params.id){
                        response.json({        
                            success: false,  
                            message: 'Delivery has exist',
                            data: hinhthuc
                        });
                    }
                    
                } else{
                    response.json({
                        success: false,
                        message: 'Delivery not found'
                    });
                }
                
            } catch(error){
                response.send(error);
            }
        }
    }
    
}

exports.htvc_delete = async(request, response)=>{
    try{
        var result = await HTVC.findById(request.params.id).exec();
        if (result){
            var dh = await DonHangModel.find({vanchuyen_id: request.params.id}).exec()
            if (dh.length > 0){
                response.json({
                    success: false,
                    message: 'Cannot delete this delivery'
                });
            }else{
                var result = await HTVC.deleteOne({ _id: request.params.id}).exec();
                response.json({
                    success: true,
                    message: 'Delivery deleted successfully'
                });
            }
            
        } else{
            response.json({
                success: false,
                message: 'Delivery not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}