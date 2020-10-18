const ChiTietSanPham = require('../models/ChiTietSanPham.model');
const {response, request} = require('express');
const mongoClient = require('mongodb').MongoClient;
const {check, validationResult} = require('express-validator');

exports.chitietsanpham_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }
    try {
        var sp = await ChiTietSanPham.find({ kichco_id: request.body.kichco_id, mausanpham_id: request.body.mausanpham_id}).exec();
        if (sp.length != 0){
            response.json({          
                message: 'Product has exist',
                data: sp
            });
        } else {
            var chitietsanpham = new ChiTietSanPham(request.body);
            var res = await chitietsanpham.save();
            const result = await ChiTietSanPham.findById(res.id)
                    .populate('mausanpham_id').populate('kichco_id')
                        .populate({
                            path: 'mausanpham_id',
                            populate: [{path: 'hinh'}, {path: 'mausac_id'}, {path: 'sanpham_id'}]
                            })
                        .exec();
            response.json({
                success: true,
                message: 'Product created successfully',
                data: result
            });
        }
    } catch (error){
        response.send(error);
    }
};

exports.chitietsanpham_list = async(request, response) =>{
    try {
        
        const result = await ChiTietSanPham.find().populate('mausanpham_id').populate('kichco_id').exec();

        response.json({
            data: result
        });
    
    
    } catch (error){
        response.status(500).send(error);
    }
};

exports.chitietsanpham_get = async(request, response)=>{
    try{
        const result =  await ChiTietSanPham.findById(request.params.id)
                        .populate('mausanpham_id').populate('kichco_id')
                        .populate({
                            path: 'mausanpham_id',
                            populate: [{path: 'hinh'}, {path: 'mausac_id'}, {path: 'sanpham_id'}]
                            })
                        .exec();
        if (result){
            response.json({
                data: result
            });
        } else{
            response.json({
                message: 'Product not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

exports.chitietsanpham_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }
    try{
        
        var result = await ChiTietSanPham.findById(request.params.id).exec();
        
        if (result){
            var sptrung = await ChiTietSanPham.find({ 
                kichco_id: request.body.kichco_id, 
                mausanpham_id: request.body.mausanpham_id})
                .exec();
            // response.json({          
            //     sptrung: sptrung
            // });
            if ((sptrung.length == 0) || (sptrung[0]._id == request.params.id)){
                result.set(request.body);
                var res = await result.save();
                const sp =  await ChiTietSanPham.findById(request.params.id)
                        .populate('mausanpham_id').populate('kichco_id')
                        .populate({
                            path: 'mausanpham_id',
                            populate: [{path: 'hinh'}, {path: 'mausac_id'}, {path: 'sanpham_id'}]
                            })
                        .exec();
                response.json({
                    success: true,
                    message: 'Product updated successfully',
                    data: sp
                });
            }
            if (sptrung[0]._id != request.params.id){
                response.json({          
                    message: 'Product has exist',
                    data: sptrung
                });
            }
            
            
        } else{
            response.json({
                message: 'Product not found'
            });
        }
        
    } catch(error){
        response.send(error);
    }
}

exports.chitietsanpham_delete = async(request, response)=>{
    try{
        var result = await ChiTietSanPham.findById(request.params.id).exec();
        if (result){
            var result = await ChiTietSanPham.deleteOne({ _id: request.params.id}).exec();
            response.json({
                message: 'Product deleted successfully'
            });
        } else{
            response.json({
                message: 'Product not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}