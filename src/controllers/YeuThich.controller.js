const YeuThich = require('../models/YeuThich.model');
const {response, request} = require('express');
const mongoClient = require('mongodb').MongoClient;
const SanPham = require('../models/SanPham.model');
const {check, validationResult} = require('express-validator');

exports.YeuThich_create = async(request, response)=>{
    try {
        var dssp = await YeuThich.find(
            { nguoidung_id: request.user._id}).exec();
        
        if (dssp.length == 0){
            var yeuthich = new YeuThich({
                nguoidung_id: request.user._id,
                sanpham_ids: request.params.id
            })
            var yc = await yeuthich.save()
            response.json({
                success: true,
                message: 'Product added to favorite successfully',
                data: yc
            })
        } else {
            var ds_sanpham = await YeuThich.findById(dssp[0]._id).exec();
            //KIEM TRA SAN PHAM TRUNG
            var sanphamtrung = ds_sanpham.sanpham_ids.filter(function(e, i){
                return ds_sanpham.sanpham_ids[i] == request.params.id
            })
            if (sanphamtrung.length == 0){
                var sanpham_moi = request.params.id
                ds_sanpham.sanpham_ids = ds_sanpham.sanpham_ids.concat(sanpham_moi)
                var ds = await ds_sanpham.save()
                response.json({
                    success: true,
                    data: ds,
                    message: 'Product added to favorite successfully',
                    sp: ds_sanpham.sanpham_ids
                })
            } else{
                response.json({
                    message: 'Product already added'
                })
            }
            
        }
    } catch (error) {
        response.json({
            success: false,
            error: error,
            message: 'Cannot add product to favorite'
        })
    }
}

exports.YeuThich_list  = async(request, response)=>{
    try {
        var ds_sanpham = await YeuThich.find(
            { nguoidung_id: request.user._id}).exec();
        response.json({
            data: ds_sanpham
        })
    } catch (error) {
        response.json({
            success: false,
            error: error
        })
    }
}

exports.YeuThich_delete = async(request, response)=>{
    try {
        var dssp = await YeuThich.find(
            { nguoidung_id: request.user._id}).exec();
        if (dssp.length == 0){
            response.json({
                message: 'List favorite is empty'
            })
        }
        var ds_sanpham = await YeuThich.findById(dssp[0]._id).exec();
        
        //KIEM TRA SAN PHAM K TRUNG
        var sanpham = ds_sanpham.sanpham_ids.filter(function(e, i){
            return ds_sanpham.sanpham_ids[i] != request.params.id
        })
        if (sanpham.length >= 1){
            ds_sanpham.sanpham_ids = sanpham
            await ds_sanpham.save()
            //var dssp_moi = await YeuThich.findById(dssp[0]._id).exec();
            
            response.json({
                success: true,
                message: 'Product deleted successfully'
            })
        } else{
            await YeuThich.deleteOne({_id: dssp[0]._id}).exec()
            response.json({
                success: true,
                message: 'Product deleted successfully'
            })
        }
    } catch (error) {
        response.json({
            success: false,
            error: error
        })
    }
}