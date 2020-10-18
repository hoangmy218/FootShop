const KichCo = require('../models/KichCo.model');
const {response, request} = require('express');
const {check, validationResult} = require('express-validator');
const ChiTietSanPhamModel = require('../models/ChiTietSanPham.model');

exports.kichco_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            success: false,  
            errors
        })
    }else {
        try {
            var kc = await KichCo.find({ ten: request.body.ten}).exec();
            if (kc.length != 0){
                response.json({    
                    success: false,      
                    message: 'Size has exist',
                    data: kc
                });
            } else {
                var kichco = new KichCo(request.body);
                var result = await kichco.save();
                response.json({
                    success: true,
                    message: 'Size created successfully',
                    data: result
                });
            }
    
        } catch (error){
            response.send(error);
        }
    }
    
};

exports.kichco_list = async(request, response) =>{
    try {
        var result = await KichCo.find().exec();
        response.json({
            data: result
        });
    } catch (error){
        response.status(500).send(error);
    }
};

exports.kichco_get = async(request, response)=>{
    try{
        var result = await KichCo.findById(request.params.id).exec();
        if (result){
            response.json({
                data: result
            });
        } else{
            response.json({
                success: false,  
                message: 'Size not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

exports.kichco_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            success: false,  
            errors
        })
    }else {
        try{
            var result = await KichCo.findById(request.params.id).exec();
            if (result){
                //Check name unique
                var kc = await KichCo.find({ ten: request.body.ten}).exec();
                if ((kc.length == 0) || (kc[0].id == request.params.id)){
                    result.set(request.body);
                    var res = await result.save();
                    response.json({
                        success: true,
                        message: 'Size updated successfully',
                        data: res
                    });
                }
                if (kc[0]._id != request.params.id){
                    response.json({       
                        success: false,     
                        message: 'Size has exist',
                        data: kc
                    });
                }
                
            } else{
                response.json({
                    success: false,  
                    message: 'Size not found'
                });
            }
            
        } catch(error){
            response.send(error);
        }
    }
    
}

exports.kichco_delete = async(request, response)=>{
    try{
        var result = await KichCo.findById(request.params.id).exec();
        if (result){
            var ctsp = await ChiTietSanPhamModel.find({kichco_id: request.params.id}).exec()
            if (ctsp.length > 0 ){
                response.json({
                    success: false,  
                    message: 'Cannot delete this size'
                });
            }else {
                var result = await KichCo.deleteOne({ _id: request.params.id}).exec();
                response.json({
                    success: true,  
                    message: 'Size deleted successfully'
                });
            }
        } else{
            response.json({
                success: false,  
                message: 'Size not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}