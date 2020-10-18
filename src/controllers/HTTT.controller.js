const HTTT = require('../models/HTTT.model');
const {response, request} = require('express');
const {check, validationResult} = require('express-validator');
const DonHang = require('../models/DonHang.model')

exports.httt_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            success: false, 
            errors: errors
        })
    } else{
        try {
            var hinhthuc = await HTTT.find({ ten: request.body.ten}).exec();
            if (hinhthuc.length != 0){
                response.json({   
                    success: false,       
                    message: 'Payment has exist',
                    data: hinhthuc
                });
            } else {
                var httt = new HTTT(request.body);
                var result = await httt.save();
                response.json({
                    success: true,
                    message: 'Payment created successfully',
                    data: result
                });
            }
    
        } catch (error){
            response.send(error);
        }
    }
    
};

exports.httt_list = async(request, response) =>{
    try {
        var result = await HTTT.find().exec();
        response.json({
            data: result
        });
    } catch (error){
        response.status(500).send(error);
    }
};

exports.httt_get = async(request, response)=>{
    try{
        var result = await HTTT.findById(request.params.id).exec();
        if (result){
            response.json({
                data: result
            });
        } else{
            response.json({
                success: false, 
                message: 'Payment not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

exports.httt_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            success: false, 
            errors
        })
    }else {
        try{
            var result = await HTTT.findById(request.params.id).exec();
            if (result){
                //Check name unique
                var hinhthuc = await HTTT.find({ ten: request.body.ten}).exec();
                if ((hinhthuc.length == 0) || (hinhthuc[0].id == request.params.id)){
                    result.set(request.body);
                    var res = await result.save();
                    response.json({
                        success: true,
                        message: 'Payment updated successfully',
                        data: res
                    });
                }
                if (hinhthuc[0]._id != request.params.id){
                    response.json({   
                        success: false,        
                        message: 'Payment has exist',
                        data: hinhthuc
                    });
                }
                
            } else{
                response.json({
                    success: false, 
                    message: 'Payment not found'
                });
            }
            
        } catch(error){
            response.send(error);
        }
    }
    
}

exports.httt_delete = async(request, response)=>{
    try{
        var result = await HTTT.findById(request.params.id).exec();
        if (result){
            var dh = await DonHang.find({thanhtoan_id: request.params.id}).exec()
            if (dh.length > 0 ){
                response.json({
                    success: false, 
                    message: 'Cannot delete this payment'
                });
            }else{
                var result = await HTTT.deleteOne({ _id: request.params.id}).exec();
                response.json({
                    success: true, 
                    message: 'Payment deleted successfully'
                });
            }
            
        } else{
            response.json({
                success: false, 
                message: 'Payment not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}