
const ChiTietSanPham = require('../models/ChiTietSanPham.model');
const {response, request} = require('express');
const mongoClient = require('mongodb').MongoClient;
const DonGia = require('../models/DonGia.model');
const SanPham = require('../models/SanPham.model');
const MauSanPhamModel = require('../models/MauSanPham.model');
const HinhAnhModel = require('../models/HinhAnh.model');
const BinhLuanModel = require('../models/BinhLuan.model');
const {check, validationResult} = require('express-validator');
const DanhMucModel = require('../models/DanhMuc.model');
const ThuongHieuModel = require('../models/ThuongHieu.model');

exports.sanpham_timkiem = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }
    try {
        var key = request.body.ten
        var thuonghieu = request.body.thuonghieu
        var danhmuc = request.body.danhmuc
        var query = {}
        if (key){
            query.ten = { $regex: key, $options: "i"}
        }
        if (danhmuc){
            query.danhmuc_id = danhmuc
        }
        if (thuonghieu){
            query.thuonghieu_id = thuonghieu
        }
        query.trangthai = true
        //var query = {ten: { $regex:  key, $options: "i"}, danhmuc_id: danhmuc, thuonghieu_id: thuonghieu}
        var result = await SanPham.find(query).exec()
        response.json({
            thuonghieu: thuonghieu,
            danhmuc: danhmuc,
            params: request.body,
            data: result
        })
    } catch (error) {
        response.json({
            error: error
        })
    }
}

exports.sanpham_list = async(request, response)=>{
    try {
        var result = []
        var sanpham = []
        sanpham = await SanPham.find({trangthai: true}).exec()
        for(var i = 0; i<sanpham.length; i++){
            result[i] = {}
            result[i].sanpham = sanpham[i]
            
            var msp = await MauSanPhamModel.find({sanpham_id: sanpham[i]._id}).populate('mausac_id').populate('hinh[]').exec()
            result[i].mausanpham = []
            for (var j =0; j<msp.length; j++){
                result[i].mausanpham[j] = {}
                result[i].mausanpham[j].mau = msp[j]
                var hinh = await HinhAnhModel.findById(msp[j].hinh[0]).exec()
                result[i].mausanpham[j].hinh = hinh
            }
            console.log('msp',msp)
            //result[i].mau = msp
            console.log('result', result[i])
        }
        response.json({
            data: sanpham,
            result: result
        })
    } catch (error) {
        response.json({
            error: error
        })
    }
}

exports.sanpham_details = async(request, response)=>{
    try {
        var ma_sanpham = request.params.id 
        var ma_mausac = request.params.color
        sanpham = await SanPham.findById(ma_sanpham).exec()
            
            var list_procolor = await MauSanPhamModel.find({sanpham_id: ma_sanpham}).populate('mausac_id').populate('hinh[]').exec()
            var procolor = await MauSanPhamModel.findOne({sanpham_id: ma_sanpham, mausac_id: ma_mausac}).exec()
            var imgs = procolor.hinh
            var hinh = []
            for (var i=0; i<imgs.length; i++){
                hinh[i] = await HinhAnhModel.findById(imgs[i])

            }
            
            var list_size = await ChiTietSanPham.find({mausanpham_id: procolor._id}).exec()
            
        
        response.json({
            data: sanpham,
            list_procolor: list_procolor,
            procolor: procolor,
            hinh: hinh,
            list_size: list_size
        })
    } catch (error) {
        response.json({
            error: error
        })
    }
}

exports.sanpham_comment = async(request, response)=>{
    try {
        var comment = await BinhLuanModel.find({sanpham_id: request.params.id}).sort({ngaybl: -1}).exec()
        response.json({
            data: comment
        })
    } catch (error) {
        response.json({
            error: error
        })
    }
}

exports.sanpham_color = async(request, response)=>{
    try{
        var ChiTietSanPham = await ChiTietSanPham.find().exec()
        response.json({
            data: ChiTietSanPham
        })
    } catch (error){
        response.json({
            error: error
        })
    }
}

exports.danhmuc_list = async(request, response)=>{
    try {
        var danhmuc = await DanhMucModel.find().exec()
        response.json({
            data: danhmuc
        })
    } catch (error){
        response.json({
            error: error
        })
    }
}

exports.thuonghieu_list = async(request, response)=>{
    try {
        var thuonghieu = await ThuongHieuModel.find().exec()
        response.json({
            data: thuonghieu
        })
    } catch (error){
        response.json({
            error: error
        })
    }
}