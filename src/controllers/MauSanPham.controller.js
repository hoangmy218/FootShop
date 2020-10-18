const MauSanPham = require('../models/MauSanPham.model');
const {response, request} = require('express');
const mongoClient = require('mongodb').MongoClient;
const {check, validationResult} = require('express-validator');
const ChiTietPhieuNhap = require('../models/ChiTietPhieuNhap.model')
const ChiTietDonHang = require('../models/ChiTietDonHang.model')

exports.mausanpham_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }else {
        try {
            var sptrung = await MauSanPham.find({
                sanpham_id: request.body.sanpham_id,
                mausac_id: request.body.mausac_id
            }).populate('sanpham_id').populate('mausac_id').exec();
            if (sptrung.length != 0){
                response.json({
                    message: 'Product has exist',
                    data: sptrung
                });
            } else{
                var mausanpham = new MauSanPham(request.body);
                var res = await mausanpham.save();
                
                const result = await MauSanPham.findById(res.id).populate('sanpham_id').populate('mausac_id').populate('hinh').exec();
                response.json({
                    success: true,
                    message: 'Product created successfully',
                    data: result
                });
            }
        } catch (error){
            response.send(error);
        }
    }
    
};

exports.mausanpham_list = async(request, response) =>{
    try {
        
        const result = await MauSanPham.find().populate('sanpham_id').populate('mausac_id').populate('hinh').exec();

        response.json({
            data: result
        });
    
    
    } catch (error){
        response.status(500).send(error);
    }
};

exports.mausanpham_get = async(request, response)=>{
    try{
        const result = await MauSanPham.findById(request.params.id).populate('sanpham_id').populate('mausac_id').populate('hinh').exec();
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

exports.mausanpham_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }
    try{
        var result = await MauSanPham.findById(request.params.id).exec();
        
        if (result){
            var sptrung = await MauSanPham.find({
                sanpham_id: request.body.sanpham_id,
                mausac_id: request.body.mausac_id
            }).populate('sanpham_id').populate('mausac_id').exec();
            if ((sptrung.length == 0) || (sptrung[0]._id == request.params.id)){
                result.set(request.body);
                var res = await result.save();
                const sp = await MauSanPham.findById(request.params.id)
                    .populate('sanpham_id')
                    .populate('mausac_id')
                    .populate('hinh')
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

exports.mausanpham_delete = async(request, response)=>{
    try{
        var result = await MauSanPham.findById(request.params.id).exec();
        //response.json(result)
        var candelete = true
        if (result){
            var ctpn = await ChiTietPhieuNhap.find()
            .populate('chitietsanpham_id').exec();
            // response.json({
            //     sp: ctpn,
            //     result: result
            // })
            if (ctpn.length > 0){
                for (var j = 0; j <ctpn.length; j++){
                    if (ctpn[j].chitietsanpham_id != null){
                        
                        if (ctpn[j].chitietsanpham_id.mausanpham_id == request.params.id){
                            
                            candelete = false
                            response.json({
                                success: false,
                                // ctsp: ctpn[j],
                                message: 'Cannot delete this product'
                            })
                        }
                    }
                    
                }
            }

            var ctdh  = await ChiTietDonHang.find()
                .populate('ctsp_id').exec();
 
            if (ctdh.length > 0){
                for (var i = 0; i <ctdh.length; i++){
                    if (ctdh[i].ctsp_id != null){
                        if (ctdh[i].ctsp_id.mausanpham_id == request.params.id){
                            candelete = false
                            response.json({
                                success: false,
                                message: 'Cannot delete this product'
                            })
                        }
                    }
                    
                }
            }
            // response.json({
            //     message: 'none',
            //     ctpn: ctpn,
            //     ctdh: ctdh,
            //     candelete: candelete
            // })
            
            if (candelete == true){
                var result = await MauSanPham.deleteOne({ _id: request.params.id}).exec();
                response.json({
                    success: true,
                    message: 'Product deleted successfully'
                });
            }
            
        } else{
            response.json({
                success: false,
                message: 'Product not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}