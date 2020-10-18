const SanPham = require('../models/SanPham.model');
const {response, request} = require('express');
const mongoClient = require('mongodb').MongoClient;
const {check, validationResult} = require('express-validator');
const ChiTietDonHang = require('../models/ChiTietDonHang.model')
const ChiTietPhieuNhap = require('../models/ChiTietPhieuNhap.model')

exports.sanpham_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }else {
        try {
            var sp = await SanPham.find({ ten: request.body.ten}).exec();
            if (sp.length != 0){
                response.json({          
                    message: 'Product has exist',
                    data: sp
                });
            } else {
                var sanpham = new SanPham(request.body);
                var res = await sanpham.save();
                
                const result = await SanPham.findById(res.id).populate('thuonghieu_id').populate('danhmuc_id').exec();
                response.json({
                    data: result
                });
                    
            }
    
        } catch (error){
            response.send(error);
        }
    }

};

exports.sanpham_list = async(request, response) =>{
    try {
        
        const result = await SanPham.find().populate('thuonghieu_id').populate('danhmuc_id').exec();

        response.json({
            data: result
        });
    
    
    } catch (error){
        response.status(500).send(error);
    }
};

exports.sanpham_get = async(request, response)=>{
    try{
        const result = await SanPham.findById(request.params.id).populate('thuonghieu_id').populate('danhmuc_id').exec();
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
        response.send(error);
    }
};

exports.sanpham_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }else {
        try{
            var result = await SanPham.findById(request.params.id).exec();
            if (result){
                //Check name unique
                var sp = await SanPham.find({ ten: request.body.ten}).exec();
                if ((sp.length == 0) || (sp[0].id == request.params.id)){
                    result.set(request.body);
                    var res = await result.save();
                    const sp = await SanPham.findById(res.id).populate('thuonghieu_id').populate('danhmuc_id').exec();
                    response.json({
                        success: true,
                        message: 'Product updated successfully',
                        data: sp
                    });
                }
                if (sp[0]._id != request.params.id){
                    response.json({          
                        message: 'Product has exist',
                        data: sp
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
    
}

exports.sanpham_delete = async(request, response)=>{
    try{
        var result = await SanPham.findById(request.params.id).exec();
        var candelete = true
        if (result){

            var ctpn = await ChiTietPhieuNhap.find({})
                .populate({
                    path: 'chitietsanpham_id',
                    populate:[
                        {
                            path: 'mausanpham_id',
                            populate: {path: 'sanpham_id'}
                        }
                    ]
                }).exec();
                

            for (var j = 0; j <ctpn.length; j++){
                if (ctpn[j].chitietsanpham_id.mausanpham_id.sanpham_id != null){
                    
                    if (ctpn[j].chitietsanpham_id.mausanpham_id.sanpham_id._id == request.params.id){
                        
                        candelete = false
                        response.json({
                            success: false,
                            // ctsp: ctpn[j],
                            message: 'Cannot delete this product'
                        })
                    }
                }
                
            }

            var ctdh  = await ChiTietDonHang.find({})
                .populate({
                    path: 'ctsp_id',
                    populate:[
                        {
                            path: 'mausanpham_id',
                            populate: {path: 'sanpham_id'}
                        }
                    ]
                }).exec();
            for (var i = 0; i <ctdh.length; i++){
                if (ctdh[i].ctsp_id.mausanpham_id.sanpham_id != null){
                    if (ctdh[i].ctsp_id.mausanpham_id.sanpham_id._id == request.params.id){
                        candelete = false
                        response.json({
                            success: false,
                            message: 'Cannot delete this product'
                        })
                    }
                }
                
            }
            if (candelete == true){
                var result = await SanPham.deleteOne({ _id: request.params.id}).exec();
                response.json({
                    message: 'Product deleted successfully'
                });
            }
            
        } else{
            response.json({
                message: 'Product not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}

exports.sanpham_active = async(request, response)=>{
    try {
        var result = await SanPham.findById(request.params.id).exec();
        if (result){
            var nd = await SanPham.update({ _id: request.params.id}, {$set: {trangthai: true}}).exec();
            var res = await SanPham.findById(request.params.id).exec();
            response.json({
                success: true,
                message: 'Product activated successfully',
                data: res
            })
        } else{
            response.json({
                message: 'Product not found'
            });
        }
    } catch (error) {
        
    }
}

exports.sanpham_deactive = async(request, response)=>{
    try {
        var result = await SanPham.findById(request.params.id).exec();
        if (result){
            var nd = await SanPham.update({ _id: request.params.id}, {$set: {trangthai: false}}).exec();
            var res = await SanPham.findById(request.params.id).exec();
            response.json({
                success: true,
                message: 'Product deactivated successfully',
                data: res
            })
        } else{
            response.json({
                message: 'Product not found'
            });
        }
    } catch (error) {
        
    }
}