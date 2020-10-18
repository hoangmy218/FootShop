const MauSac = require('../models/MauSac.model');
const {response, request} = require('express');
const {check, validationResult} = require('express-validator');
const MauSanPhamModel = require('../models/MauSanPham.model');
const ChiTietSanPhamModel = require('../models/ChiTietSanPham.model');
const MauSacModel = require('../models/MauSac.model');

exports.mausac_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            success: false,
            error: errors
        })
    }else{
        try {
            var ms = await MauSac.find({ ten: request.body.ten}).exec();
            if (ms.length != 0){
                response.json({   
                    success: false,       
                    message: 'Color has exist',
                    data: ms
                });
            } else {
                var mausac = new MauSac(request.body);
                var result = await mausac.save();
                response.json({
                    success: true,
                    message: 'Color added successfully',
                    data: result
                });
            }
    
        } catch (error){
            response.send(error);
        }
    }
    
};

exports.mausac_list = async(request, response) =>{
    try {
        var result = await MauSac.find().exec();
        response.json({
            data: result
        });
    } catch (error){
        response.status(500).send(error);
    }
};

exports.mausac_get = async(request, response)=>{
    try{
        var result = await MauSac.findById(request.params.id).exec();
        if (result){
            response.json({
                data: result
            });
        } else{
            response.json({
                success: false,
                message: 'Color not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

exports.mausac_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }else{
        try{
            var result = await MauSac.findById(request.params.id).exec();
            if (result){
                //Check name unique
                var ms = await MauSac.find({ ten: request.body.ten}).exec();
                if ((ms.length == 0) || (ms[0].id == request.params.id)){
                    result.set(request.body);
                    var res = await result.save();
                    response.json({
                        success: true,
                        message: 'Color updated successfully',
                        data: res
                    });
                }
                if (ms[0]._id != request.params.id){
                    response.json({ 
                        success: false,         
                        message: 'Color has exist',
                        data: ms
                    });
                }
                
            } else{
                response.json({
                    success: false,
                    message: 'Color not found'
                });
            }
            
        } catch(error){
            response.send(error);
        }
    }
}

exports.mausac_delete = async(request, response)=>{
    try{
        var result = await MauSac.findById(request.params.id).exec();
        var candelete = true
        if (result){
            await ChiTietSanPhamModel.find()
            .populate({
                path: 'mausanpham_id',
                populate:'mausac_id',
            })
            .exec(function(err, sp){            
                for (var i = 0; i<sp.length; i++){
                    if (sp[i].mausanpham_id.mausac_id._id == request.params.id){
                        candelete = false
                        response.json({
                            success: false,
                            message: 'Cannot deleted this color',
                            sp: sp[i]
                        });
                    }
                }
            })
                
            var msp = await MauSanPhamModel.find({mausac_id: request.params.id}).populate('mausac_id')
                .exec()
                if (msp.length > 0){
                    
                    for(var j = 0; j< msp.length; j++){
                        // response.send(msp)
                        if (msp[j].mausac_id._id == request.params.id){
                            candelete  = false
                            response.json({
                                success: false,
                                message: 'Cannot deleted this color',
                                msp: msp[j]
                            });
                        }
                    }
                    if (candelete == true){
                        var res = await MauSacModel.deleteOne({_id: request.params.id}).exec()
                        response.json({
                            success: true,
                            message: 'Color deleted successfully'
                        })
                    }
                } else {
                        var res = await MauSacModel.deleteOne({_id: request.params.id}).exec()
                        response.json({
                            success: true,
                            message: 'Color deleted successfully'
                        })
                }
             
                
            
        }else{
            response.json({
                success: false,
                message: 'Color not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}