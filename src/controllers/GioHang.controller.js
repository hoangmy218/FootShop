const GioHang = require('../models/GioHang.model');
const ChiTietSanPham = require('../models/ChiTietSanPham.model');
const {response, request} = require('express');
const mongoClient = require('mongodb').MongoClient;
const DonGia = require('../models/DonGia.model');
const SanPham = require('../models/SanPham.model');
const {check, validationResult} = require('express-validator');

exports.giohang_create = async(request, response)=>{
    console.log(request.body)
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            success: false,
            error: errors
        })
    }else {
        if (request.body.soluongdat == 0){
            response.json({
                success: false,
                error: "Min quantity must be 1"
            })
        }else{
            try {
                var giohang = await GioHang.find(
                    {nguoidung_id: request.user._id, ctsp_id: request.body.ctsp_id}
                    ).exec();
                var ctsp = await ChiTietSanPham.findById(request.body.ctsp_id).exec();
                if (ctsp.soluong == 0){
                    response.json({
                        success: false,
                        error: 'Sorry! This item has gone'
                    })
                }
                if ( giohang.length == 0){
                    
                    //SLDAT HOP LE
                    if (request.body.soluongdat < ctsp.soluong){
                        var giohang_moi = new GioHang({
                            nguoidung_id: request.user._id,
                            ctsp_id: request.body.ctsp_id,
                            soluongdat: request.body.soluongdat
                        })
                        
                        
                        var gh = await giohang_moi.save();
                        response.json({
                            success: true,
                            message: "Product added to cart successfully",
                            data: gh
                        })
                    } else {
                        //DAT VOI SLTON MAX
                        var giohang_moi = new GioHang({
                            nguoidung_id: request.user._id,
                            ctsp_id: request.body.ctsp_id,
                            soluongdat: ctsp.soluong
                        })
                        
                        var gh = await giohang_moi.save();
                        response.json({
                            success: true,
                            message: "Product added to cart successfully",
                            data: gh
                        })
                    }
        
                }else{
                    if (giohang[0].soluongdat == ctsp.soluong ){
                        response.json({
                            success: false,
                            message: 'You have already added this item'
                        })
                    }
                    
                    var soluongdat_moi = giohang[0].soluongdat + request.body.soluongdat 
                    if (soluongdat_moi > ctsp.soluong){
                        soluongdat_moi = ctsp.soluong
                    }
                    await GioHang.update({_id: giohang[0]._id}, {$set: {soluongdat: soluongdat_moi}}).exec();
                    var giohang_cn = await GioHang.findById(giohang[0]._id).exec();
                    response.json({
                        success: true,
                        message: "Product added to cart successfully",
                        giohang: giohang_cn
                    })
                }
                
            } catch (error) {
                response.json({
                    success: false,
                    message: error
                })
            }
        }
        
    }
    
}

exports.giohang_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }
    if (request.body.soluongdat == 0){
        response.json({
            success: false,
            error: "Min quantity must be 1"
        })
    }
    try {
        var ma_spgiohang = request.params.id
        var spgiohang = await GioHang.findById(ma_spgiohang).exec();
        var ma_ctsp_cu =  spgiohang.ctsp_id
        var ma_ctsp_moi = request.body.ctsp_id
        var ctsp = await ChiTietSanPham.findById(request.body.ctsp_id).exec();
        
        if (ctsp.soluong == 0){
            response.json({
                success: false,
                error: 'Sorry! This item has gone'
            })
        }
        var soluongton = ctsp.soluong
        //CO SP TRUNG TRONG GIO HANG
        var sanpham = await GioHang.find({ nguoidung_id: request.user._id, ctsp_id: ma_ctsp_moi}).exec();
        if (sanpham.length >=1 ){
            if (sanpham.length ==1 && ma_spgiohang == sanpham[0]._id){
                //KHONG CO SP TRUNG TRONG GIO HANG
                var soluongdat = request.body.soluongdat
                if (soluongdat > soluongton){
                    soluongdat = soluongton
                }
                spgiohang.set({
                    nguoidung_id: request.user._id,
                    ctsp_id: ma_ctsp_moi,
                    soluongdat: soluongdat
                });
                var res = await spgiohang.save();
                response.json({
                    success: true,
                    message: "Product updated successfully",
                    data: res
                    // sanpham: sanpham
                })
            } else {
                var tongsanpham = 0
                for (var i=0; i<sanpham.length; i++){
                    tongsanpham += sanpham[i].soluongdat;
                    await GioHang.deleteOne({ _id: sanpham[i]._id}).exec()
                }
                await GioHang.deleteOne({_id: ma_spgiohang}).exec();
                tongsanpham += request.body.soluongdat
                if (tongsanpham > soluongton){
                    tongsanpham = soluongton
                }
                var giohang_moi = new GioHang({
                    nguoidung_id: request.user._id,
                    ctsp_id: request.body.ctsp_id,
                    soluongdat: tongsanpham
                })
                
                var gh = await giohang_moi.save();
                response.json({
                    success: true,
                    message: "Product updated successfully",
                    data: gh
                    // sanpham: sanpham
                })
            }

            

        }else{
            //KHONG CO SP TRUNG TRONG GIO HANG
            var soluongdat = request.body.soluongdat
            if (soluongdat > soluongton){
                soluongdat = soluongton
            }
            spgiohang.set({
                nguoidung_id: request.user._id,
                ctsp_id: ma_ctsp_moi,
                soluongdat: soluongdat
            });
            var res = await spgiohang.save();
            response.json({
                success: true,
                message: "Product updated successfully",
                data: res,
                sanpham: sanpham
            })
        }
        
  
    } catch (error) {
        response.json({
            success: false,
            error: error
        })
    }
}

exports.giohang_list = async(request, response)=>{
    try {
        var sanpham = await GioHang.find(
            {nguoidung_id: request.user._id}
            ).exec();
            // response.json({
            //     data: sanpham
            // })
        for (var i=0; i<sanpham.length; i++){
            var ctsp = await ChiTietSanPham.findById(sanpham[i].ctsp_id).exec();
            
            if (sanpham[i].soluongdat > ctsp.soluong && ctsp.soluong > 0){
                await GioHang.update({ _id: sanpham[i]._id}, {$set: {soluongdat: ctsp.soluong}}).exec()
            }else if (ctsp.soluong == 0 || sanpham[i].soluongdat == 0){
                await GioHang.deleteOne({ _id: sanpham[i]._id}).exec()
            }
        }
        var result = {}
        var giohang = await GioHang.find(
            {nguoidung_id: request.user._id}
            ).populate({
                path: 'ctsp_id',
                populate: [
                    {path: 'kichco_id'},
                    {
                    path: 'mausanpham_id',
                    populate: [{path: 'mausac_id'}, {path: 'sanpham_id'}]
                }]
            
            })
            .exec();
       
        result.giohang = giohang;
        var gia = [];
        var pricelist = [];
        var k =0;
        for(var j = 0; j<giohang.length; j++){
            var dongia = await DonGia.find({sanpham_id: giohang[j].ctsp_id.mausanpham_id.sanpham_id._id})
            .sort({ngay: -1}).limit(1).exec();
           
            gia[j] = dongia[0];
            
        }
        var newArr = [];
        gia.forEach((item, i)=> {
            console.log(item)
            if (newArr.findIndex(index => index._id === item._id) === -1) 
            {
                console.log(item)
                newArr.push(item)
            }

        });
        // this.formulalist = this.newArr
        result.dongia = gia;
        
        response.json({
            data: giohang,
            result: result
        })
    } catch (error) {
        response.json({
            success: false,
            error: error
        })
    }
}

exports.giohang_shortlist = async(request, response)=>{
    try {
        var giohang  = await GioHang.find({nguoidung_id: request.user._id}).exec();
        response.json({
            data: giohang
        })
    } catch (error) {
        response.json({
            success: false,
            error: error
        })
    }
}

exports.giohang_delete = async(request, response)=>{
    try {
        var ma_spgiohang = request.params.id
        var spgiohang = await GioHang.findById(ma_spgiohang).exec()
        if (spgiohang){
            await GioHang.deleteOne({ _id: ma_spgiohang}).exec()
            response.json({
                success: true,
                message: 'Product deleted successfully'
            });
        }else{
            response.json({
                success: false,
                message: "Product not found"
            })
        }
    } catch (error) {
        response.json({
            success: false,
            error: error
        })
    }
}
exports.giohang_clear = async(request, response)=>{
    try {
        
        await GioHang.deleteMany({nguoidung_id: request.user._id}).exec();
        response.json({
            success: true,
            message: 'Cart cleared successfully'
        });
        
    } catch (error) {
        response.json({
            success: false,
            error: error
        })
    }
}