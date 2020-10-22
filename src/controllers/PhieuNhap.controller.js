const PhieuNhap = require('../models/PhieuNhap.model');
const ChiTietSanPham = require('../models/ChiTietSanPham.model');
const ChiTietPhieuNhap = require('../models/ChiTietPhieuNhap.model');
const {response, request} = require('express');
const mongoClient = require('mongodb').MongoClient;
const {check, validationResult} = require('express-validator');
const MauSanPham = require('../models/MauSanPham.model');

exports.phieunhap_create = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }else {
        try {   
            var sanpham = request.body.chitietphieunhap_id;
            var tongnhap = 0;
            var tongtien = 0;
            // response.json({
            //     sp: sanpham
            // })
            if (sanpham == null){
                var phieunhap = new PhieuNhap({
                    tongnhap: tongnhap,
                    tongtien: tongtien,
                    trangthai: false,
                    nhacungcap_id: request.body.nhacungcap_id,
                    sanpham: request.body.chitietphieunhap_id
                });
                var res = await phieunhap.save();       
                const result = await PhieuNhap.findById(res.id)
                        .populate('nhacungcap_id')
                        .populate({
                            path: 'sanpham',
                            populate: {path: 'chitietsanpham_id'}
                            })
                        .exec();
                response.json({
                    success: true,
                    message: 'Stock receipt created successfully',
                    data: result
                });
        
            }else {
                for(var i = 0; i<sanpham.length; i++){
                    tongnhap += sanpham[i].soluongnhap;
                    tongtien += (sanpham[i].soluongnhap * sanpham[i].dongianhap);
                    var ctsp = await ChiTietSanPham.findById(sanpham[i].chitietsanpham_id).exec();
                    var update_ctsp = await ChiTietSanPham.update(
                            { _id: sanpham[i].chitietsanpham_id}, 
                            {$set: {soluong: ctsp.soluong + sanpham[i].soluongnhap}}
                        ).exec();
                }
                var phieunhap = new PhieuNhap({
                    tongnhap: tongnhap,
                    tongtien: tongtien,
                    trangthai: true,
                    nhacungcap_id: request.body.nhacungcap_id,
                    sanpham: request.body.chitietphieunhap_id
                });
                var res = await phieunhap.save();       
                const result = await PhieuNhap.findById(res.id)
                        .populate('nhacungcap_id')
                        .populate({
                            path: 'sanpham',
                            populate: {path: 'chitietsanpham_id'}
                            })
                        .exec();
                response.json({
                    success: true,
                    message: 'Stock receipt created successfully',
                    data: result
                });
            }
            
    
        } catch (error){
            response.send(error);
        }
    }
    
};

//done
exports.phieunhap_list = async(request, response) =>{
    try {
        
        const result = await PhieuNhap.find()
            .populate('nhacungcap_id').sort({ngay: -1})
            .exec();

        response.json({
            data: result
        });
    
    
    } catch (error){
        response.status(500).send(error);
    }
};

exports.phieunhap_get = async(request, response)=>{
    try{
        const result = await PhieuNhap.findById(request.params.id)
            .populate('nhacungcap_id')
            .populate({
                path: 'sanpham',
                populate: {
                    path: 'chitietsanpham_id',
                    populate:[
                        {
                            path: 'mausanpham_id',
                            populate: [{path: 'hinh'}, {path: 'mausac_id'}, {path: 'sanpham_id'}]
                        }, 
                        {
                            path: 'kichco_id'
                        }
                    ]
                }
            })
            .exec();
        const chitiet = await ChiTietPhieuNhap.find({phieunhap_id: request.params.id})
            .populate({
                path: 'chitietsanpham_id',
                populate:[
                    {
                        path: 'mausanpham_id',
                        populate: [{path: 'hinh'}, {path: 'mausac_id'}, {path: 'sanpham_id'}]
                    }, 
                    {
                        path: 'kichco_id'
                    }
                ]
            }).exec();

        if (result){
            response.json({
                data: result,
                details: chitiet
            });
        } else{
            response.json({
                success: false,
                message: 'Stock receipt not found'
            });
        }
        
    } catch (error){
        response.status(500).error(error);
    }
};

//done update ncc
exports.phieunhap_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    } else {
        try{
            var result = await PhieuNhap.findById(request.params.id).exec();
            if (result){  
                result.set(request.body);
                var res = await result.save();
                const pn = await PhieuNhap.findById(request.params.id)
                    .populate('nhacungcap_id')
                    .exec();
                response.json({
                    success: true,
                    message: 'Stock receipt updated successfully',
                    data: pn
                });
            } else{
                response.json({
                    success: false,
                    message: 'Stock receipt not found'
                });
            }
        } catch(error){
            response.send(error);
        }
    }
    
}

exports.phieunhap_delete = async(request, response)=>{
    try{
        var ma_phieunhap = request.params.id;
        var phieunhap = await PhieuNhap.findById(ma_phieunhap).exec();
        
        if (phieunhap){
            var sanpham = await ChiTietPhieuNhap.find({phieunhap_id: ma_phieunhap}).exec();
            //PN SAVED
            if (phieunhap.trangthai == true){

                for(var i = 0; i<sanpham.length; i++){

                    //CAP NHAT SL TON
                    var ctsp = await ChiTietSanPham.findById(sanpham[i].chitietsanpham_id).exec();
                    var update_ctsp = await ChiTietSanPham.update(
                            { _id: sanpham[i].chitietsanpham_id}, 
                            {$set: {soluong: ctsp.soluong - sanpham[i].soluongnhap}}
                        ).exec();

                    //XOA CTPN
                    var xoa_ctpn = await ChiTietPhieuNhap.deleteOne({ _id: sanpham[i]._id}).exec();
    
                }
            //PN DRAFT
            } else {

                //Xoa CTPN
                for(var i = 0; i<sanpham.length; i++){
                    var xoa_ctpn = await ChiTietPhieuNhap.deleteOne({ _id: sanpham[i]._id}).exec();
                }
            }
            //XOA PN
            var result = await PhieuNhap.deleteOne({ _id: ma_phieunhap}).exec();
            response.json({
                success: true,
                message: 'Stock receipt deleted successfully'
            });
        } else{
            response.json({
                success: false,
                message: 'Stock receipt not found'
            });
        }
    } catch (error){
        response.send(error);
    }
}

exports.phieunhap_save = async(request, response)=>{
    
        try {
            var result = await PhieuNhap.findById(request.params.id).exec();
            if (result && result.trangthai == false){
                var ma_phieunhap = request.params.id;
                //CAP NHAT PHIEU NHAP
                var nd = await PhieuNhap.update({ _id: ma_phieunhap}, {$set: {trangthai: true}}).exec();
                
                //CAP NHAT SL TON
                var sanpham = await ChiTietPhieuNhap.find({ phieunhap_id: ma_phieunhap}).exec();
                //Cap nhat CTSP
                var tongnhap = 0;
                var tongtien = 0;
                for(var i = 0; i<sanpham.length; i++){
                    tongnhap += sanpham[i].soluongnhap;
                    tongtien += (sanpham[i].soluongnhap * sanpham[i].dongianhap);
                    var ctsp = await ChiTietSanPham.findById(sanpham[i].chitietsanpham_id).exec();
                    var update_ctsp = await ChiTietSanPham.update(
                            { _id: sanpham[i].chitietsanpham_id}, 
                            {$set: {soluong: ctsp.soluong + sanpham[i].soluongnhap}}
                        ).exec(); 
                }
                //Cap nhat Phieu Nhap ************************************** 
                var nd = await PhieuNhap.update(
                    { _id: ma_phieunhap}, 
                    {$set: 
                        {tongnhap: tongnhap, tongtien: tongtien}
                    }).exec();
    
                //DONE
                var res = await PhieuNhap.findById(request.params.id).exec();
                console.log('saved', res)
                response.json({
                    success: true,
                    message: 'Stock receipt saved successfully',
                    data: res,
                    tongnhap: tongnhap,
                    tongtien: tongtien
                })
            } else{
                console.log('not found')
                response.json({
                    success: false,
                    message: 'Stock receipt not found'
                });
            }
        } catch (error) {
            console.log('error', error)
             response.json({
                error: error
             })

        }
    
    
}


//ADD Product to Stock Receipt
exports.chitietphieunhap_create = async(request, response)=>{
    try{ 
        var ma_phieunhap = request.params.id;
        var ma_sanpham = request.body.chitietsanpham_id;
        var soluongnhap_moi = request.body.soluongnhap;
        var dongianhap_moi = request.body.dongianhap;
        var result = await ChiTietPhieuNhap.find({
            chitietsanpham_id: ma_sanpham, phieunhap_id: ma_phieunhap
        }).exec();
        var phieunhap = await PhieuNhap.findById(ma_phieunhap).exec();
        var ctsp_cu = await ChiTietSanPham.findById(ma_sanpham).exec();
        
        //CAP NHAT SL NHAP
        if (result.length > 0){  
            
            //CN SO LUONG TON
            if (phieunhap.trangthai == true){
                var sl_ton = ctsp_cu.soluong;
                var cn_ctsp = await ChiTietSanPham.update(
                    { _id: ma_sanpham}, 
                    { $set: {soluong: sl_ton + soluongnhap_moi} }
                ).exec();
            } 
            //CN CTPN
            var sl_moi = result[0].soluongnhap + soluongnhap_moi;
            var dg_moi = dongianhap_moi;
            var cn_ctpn = await ChiTietPhieuNhap.update(
                {_id: result[0]._id},
                {$set: {
                    soluongnhap: sl_moi, 
                    dongianhap: dg_moi
                }});
        
            //CAP NHAT PHIEU NHAP
            var sanpham = await ChiTietPhieuNhap.find({ phieunhap_id: ma_phieunhap}).exec();
            var tongnhap = 0;
            var tongtien = 0;
            for(var i = 0; i<sanpham.length; i++){
                tongnhap += sanpham[i].soluongnhap;
                tongtien += (sanpham[i].soluongnhap * sanpham[i].dongianhap);
            }
            var nd = await PhieuNhap.update(
                { _id: ma_phieunhap}, 
                {$set: 
                    {tongnhap: tongnhap, tongtien: tongtien}
                }).exec();

            //END
            var ctpn = await ChiTietPhieuNhap.find({ _id: result[0]._id}).exec();
            response.json({
                    success: true,
                    message: 'Product added successfully',
                    data: ctpn
            });    

        //THEM MOI CTPN
        }else{
            
            //CN SO LUONG TON
            if (phieunhap.trangthai == true){
                var sl_ton = ctsp_cu.soluong;
                var cn_ctsp = await ChiTietSanPham.update(
                    { _id: ma_sanpham}, 
                    { $set: {soluong: sl_ton + soluongnhap_moi} }
                ).exec();
            } 
            var ctpn_moi = new ChiTietPhieuNhap({
                chitietsanpham_id: ma_sanpham,
                phieunhap_id: ma_phieunhap,
                soluongnhap: soluongnhap_moi,
                dongianhap: dongianhap_moi
            });
            //CAP NHAT PHIEU NHAP
            var phieunhap = await PhieuNhap.findById(ma_phieunhap).exec();
            var tongnhap_moi = phieunhap.tongnhap + soluongnhap_moi;
            var tongtien_moi = phieunhap.tongtien + (soluongnhap_moi * dongianhap_moi);
            var nd = await PhieuNhap.update(
                { _id: ma_phieunhap}, 
                {$set: 
                    {tongnhap: tongnhap_moi, tongtien: tongtien_moi}
                }).exec();

            
            //THEM CTPN
            var res = await ctpn_moi.save();
            var ctpn = await ChiTietPhieuNhap.findById(res.id).exec();
            response.json({
                    success: true,
                    message: 'Product added successfully',
                    data: ctpn
            }); 
        }
    } catch(error){
        response.send(error);
    }
}

//ADD Product to STOCK with Pro Color Size
exports.chitietphieunhap_create_pcs = async(request, response)=>{
    try{ 
        console.log('body',request.body)
        var ma_phieunhap = request.params.id;
        var sanpham_id = request.body.sanpham_id;
        var mausac_id = request.body.mausac_id;
        var kichco_id = request.body.kichco_id;
        var mausanpham_id = '';
        
        

        //CHECK MAU-SP 
        var mausanpham = await MauSanPham.find({
            sanpham_id: sanpham_id,
            mausac_id: mausac_id
        }).exec();
        if (mausanpham.length>0){
            //GET mausanpham_id
            mausanpham_id = mausanpham[0]._id;
            console.log('msp exist', mausanpham[0])
        }else{
            //CREATE new mausanpham
            var mausp = new MauSanPham({
                sanpham_id: sanpham_id,
                mausac_id: mausac_id,
                hinh: null
            });
            var mausp_new = await mausp.save();
            mausanpham_id = mausp_new._id;
            console.log('msp new', mausp_new)
        }

        //CHECK CTSP
        var chitietsanpham_id = '';
        var chitietsp = await ChiTietSanPham.find({
            mausanpham_id: mausanpham_id,
            kichco_id: kichco_id
        }).exec();
        if(chitietsp.length > 0){
            chitietsanpham_id = chitietsp[0]._id;
            console.log('ctsp exist', chitietsp[0])
        }else{
            var ctsp_v = new ChiTietSanPham({
                kichco_id: kichco_id,
                mausanpham_id: mausanpham_id,
                soluong: 0
            });
            var ctsp_new = await ctsp_v.save();
            chitietsanpham_id = ctsp_new._id;
            console.log('ctsp new', ctsp_new)
        }

        var ma_sanpham = chitietsanpham_id;
        var soluongnhap_moi = request.body.soluongnhap;
        var dongianhap_moi = request.body.dongianhap;
        var result = await ChiTietPhieuNhap.find({
            chitietsanpham_id: chitietsanpham_id, phieunhap_id: ma_phieunhap
        }).exec();
        var phieunhap = await PhieuNhap.findById(ma_phieunhap).exec();
        var ctsp_cu = await ChiTietSanPham.findById(ma_sanpham).exec();
        
        //CAP NHAT SL NHAP
        if (result.length > 0){  
            
            //CN SO LUONG TON
            if (phieunhap.trangthai == true){
                var sl_ton = ctsp_cu.soluong;
                var cn_ctsp = await ChiTietSanPham.update(
                    { _id: ma_sanpham}, 
                    { $set: {soluong: sl_ton + soluongnhap_moi} }
                ).exec();
            } 
            //CN CTPN
            var sl_moi = result[0].soluongnhap + soluongnhap_moi;
            var dg_moi = dongianhap_moi;
            var cn_ctpn = await ChiTietPhieuNhap.update(
                {_id: result[0]._id},
                {$set: {
                    soluongnhap: sl_moi, 
                    dongianhap: dg_moi
                }});
        
            //CAP NHAT PHIEU NHAP
            var sanpham = await ChiTietPhieuNhap.find({ phieunhap_id: ma_phieunhap}).exec();
            var tongnhap = 0;
            var tongtien = 0;
            for(var i = 0; i<sanpham.length; i++){
                tongnhap += sanpham[i].soluongnhap;
                tongtien += (sanpham[i].soluongnhap * sanpham[i].dongianhap);
            }
            var nd = await PhieuNhap.update(
                { _id: ma_phieunhap}, 
                {$set: 
                    {tongnhap: tongnhap, tongtien: tongtien}
                }).exec();

            //END
            var ctpn = await ChiTietPhieuNhap.find({ _id: result[0]._id}).exec();
            response.json({
                    success: true,
                    message: 'Product added successfully',
                    data: ctpn
            });    

        //THEM MOI CTPN
        }else{
            
            //CN SO LUONG TON
            if (phieunhap.trangthai == true){
                var sl_ton = ctsp_cu.soluong;
                var cn_ctsp = await ChiTietSanPham.update(
                    { _id: ma_sanpham}, 
                    { $set: {soluong: sl_ton + soluongnhap_moi} }
                ).exec();
            } 
            var ctpn_moi = new ChiTietPhieuNhap({
                chitietsanpham_id: ma_sanpham,
                phieunhap_id: ma_phieunhap,
                soluongnhap: soluongnhap_moi,
                dongianhap: dongianhap_moi
            });
            //CAP NHAT PHIEU NHAP
            var phieunhap = await PhieuNhap.findById(ma_phieunhap).exec();
            console.log('phieunhap', phieunhap)
            var tongnhap_moi = phieunhap.tongnhap + soluongnhap_moi;
            var tongtien_moi = phieunhap.tongtien + (soluongnhap_moi * dongianhap_moi);
            var nd = await PhieuNhap.update(
                { _id: ma_phieunhap}, 
                {$set: 
                    {tongnhap: tongnhap_moi, tongtien: tongtien_moi}
                }).exec();
            console.log('tongnhap_moi', tongnhap_moi)
            console.log('tongtien_moi', tongtien_moi)

            
            //THEM CTPN
            var res = await ctpn_moi.save();
            var ctpn = await ChiTietPhieuNhap.findById(res.id).exec();
            response.json({
                    success: true,
                    message: 'Product added successfully',
                    data: ctpn
            }); 
        }
    } catch(error){
        console.log(error)
        response.json({
            message: error
        });
    }
}

exports.chitietphieunhap_create_arr = async(request, response)=>{
    console.log('body',request.body)
    var productList = request.body.sanpham;
    var ma_phieunhap = request.params.id;
    if(productList.length > 0){
        for (var v = 0; v<productList.length; v++){
            try{ 
                console.log('product v',productList[v])
                
                var sanpham_id = productList[v].sanpham_id;
                var mausac_id = productList[v].mausac_id;
                var kichco_id = productList[v].kichco_id;
                var mausanpham_id = '';
                
                
        
                //CHECK MAU-SP 
                var mausanpham = await MauSanPham.find({
                    sanpham_id: sanpham_id,
                    mausac_id: mausac_id
                }).exec();
                if (mausanpham.length>0){
                    //GET mausanpham_id
                    mausanpham_id = mausanpham[0]._id;
                    console.log('msp exist', mausanpham[0])
                }else{
                    //CREATE new mausanpham
                    var mausp = new MauSanPham({
                        sanpham_id: sanpham_id,
                        mausac_id: mausac_id,
                        hinh: null
                    });
                    var mausp_new = await mausp.save();
                    mausanpham_id = mausp_new._id;
                    console.log('msp new', mausp_new)
                }
        
                //CHECK CTSP
                var chitietsanpham_id = '';
                var chitietsp = await ChiTietSanPham.find({
                    mausanpham_id: mausanpham_id,
                    kichco_id: kichco_id
                }).exec();
                if(chitietsp.length > 0){
                    chitietsanpham_id = chitietsp[0]._id;
                    console.log('ctsp exist', chitietsp[0])
                }else{
                    var ctsp_v = new ChiTietSanPham({
                        kichco_id: kichco_id,
                        mausanpham_id: mausanpham_id,
                        soluong: 0
                    });
                    var ctsp_new = await ctsp_v.save();
                    chitietsanpham_id = ctsp_new._id;
                    console.log('ctsp new', ctsp_new)
                }
        
                var ma_sanpham = chitietsanpham_id;
                var soluongnhap_moi = productList[v].soluongnhap;
                var dongianhap_moi = productList[v].dongianhap;
                var result = await ChiTietPhieuNhap.find({
                    chitietsanpham_id: chitietsanpham_id, phieunhap_id: ma_phieunhap
                }).exec();
                var phieunhap = await PhieuNhap.findById(ma_phieunhap).exec();
                var ctsp_cu = await ChiTietSanPham.findById(ma_sanpham).exec();
                
                //CAP NHAT SL NHAP
                if (result.length > 0){  
                    
                    //CN SO LUONG TON
                    if (phieunhap.trangthai == true){
                        var sl_ton = ctsp_cu.soluong;
                        var cn_ctsp = await ChiTietSanPham.update(
                            { _id: ma_sanpham}, 
                            { $set: {soluong: sl_ton + soluongnhap_moi} }
                        ).exec();
                    } 
                    //CN CTPN
                    var sl_moi = result[0].soluongnhap + soluongnhap_moi;
                    var dg_moi = dongianhap_moi;
                    var cn_ctpn = await ChiTietPhieuNhap.update(
                        {_id: result[0]._id},
                        {$set: {
                            soluongnhap: sl_moi, 
                            dongianhap: dg_moi
                        }});
                
                    //CAP NHAT PHIEU NHAP
                    var sanpham = await ChiTietPhieuNhap.find({ phieunhap_id: ma_phieunhap}).exec();
                    var tongnhap = 0;
                    var tongtien = 0;
                    for(var i = 0; i<sanpham.length; i++){
                        tongnhap += sanpham[i].soluongnhap;
                        tongtien += (sanpham[i].soluongnhap * sanpham[i].dongianhap);
                    }
                    var nd = await PhieuNhap.update(
                        { _id: ma_phieunhap}, 
                        {$set: 
                            {tongnhap: tongnhap, tongtien: tongtien}
                        }).exec();
        
                    //END
                    var ctpn = await ChiTietPhieuNhap.find({ _id: result[0]._id}).exec();
                    console.log('add success', ctpn)
                    // response.json({
                    //         success: true,
                    //         message: 'Product added successfully',
                    //         data: ctpn
                    // });    
        
                //THEM MOI CTPN
                }else{
                    
                    //CN SO LUONG TON
                    if (phieunhap.trangthai == true){
                        var sl_ton = ctsp_cu.soluong;
                        var cn_ctsp = await ChiTietSanPham.update(
                            { _id: ma_sanpham}, 
                            { $set: {soluong: sl_ton + soluongnhap_moi} }
                        ).exec();
                    } 
                    var ctpn_moi = new ChiTietPhieuNhap({
                        chitietsanpham_id: ma_sanpham,
                        phieunhap_id: ma_phieunhap,
                        soluongnhap: soluongnhap_moi,
                        dongianhap: dongianhap_moi
                    });
                    //CAP NHAT PHIEU NHAP
                    var phieunhap = await PhieuNhap.findById(ma_phieunhap).exec();
                    console.log('phieunhap', phieunhap)
                    var tongnhap_moi = phieunhap.tongnhap + soluongnhap_moi;
                    var tongtien_moi = phieunhap.tongtien + (soluongnhap_moi * dongianhap_moi);
                    console.log('tongnhap_moi', tongnhap_moi)
                    console.log('tongtien_moi', tongtien_moi)
                    var nd = await PhieuNhap.update(
                        { _id: ma_phieunhap}, 
                        {$set: 
                            {tongnhap: tongnhap_moi, tongtien: tongtien_moi}
                        }).exec();
                    console.log('tongnhap_moi', tongnhap_moi)
                    console.log('tongtien_moi', tongtien_moi)
        
                    
                    //THEM CTPN
                    var res = await ctpn_moi.save();
                    var ctpn = await ChiTietPhieuNhap.findById(res.id).exec();
                    console.log('add success', ctpn)
                    // response.json({
                    //         success: true,
                    //         message: 'Product added successfully',
                    //         data: ctpn
                    // }); 
                }
            } catch(error){
                console.log(error)
                response.json({
                    message: error
                });
            }
        }
        try{
            const result = await PhieuNhap.findById(request.params.id)
                .populate('nhacungcap_id')
                .populate({
                    path: 'sanpham',
                    populate: {
                        path: 'chitietsanpham_id',
                        populate:[
                            {
                                path: 'mausanpham_id',
                                populate: [{path: 'hinh'}, {path: 'mausac_id'}, {path: 'sanpham_id'}]
                            }, 
                            {
                                path: 'kichco_id'
                            }
                        ]
                    }
                })
                .exec();
            const chitiet = await ChiTietPhieuNhap.find({phieunhap_id: request.params.id})
                .populate({
                    path: 'chitietsanpham_id',
                    populate:[
                        {
                            path: 'mausanpham_id',
                            populate: [{path: 'hinh'}, {path: 'mausac_id'}, {path: 'sanpham_id'}]
                        }, 
                        {
                            path: 'kichco_id'
                        }
                    ]
                }).exec();
    
            if (result){
                response.json({
                    success: true,
                    message: 'Thêm phiếu nhập thành công',
                    data: result,
                    details: chitiet
                });
            } else{
                response.json({
                    success: false,
                    message: 'Thêm phiếu nhập không thành công'
                });
            }
            
        } catch (error){
            response.status(500).error(error);
        }
    }else{
        response.json({
            message: 'Danh sách trống'
        })
    }
    
    
}
//LIST CTPN
exports.chitietphieunhap_list = async(request, response)=>{
    try {
        var ma_phieunhap = request.params.id;
        const result = await ChiTietPhieuNhap.find({phieunhap_id: ma_phieunhap }).exec();

        response.json({
            data: result
        });
    
    
    } catch (error){
        response.status(500).send(error);
    }
}

//DELETE CTPN
exports.chitietphieunhap_delete = async(request, response)=>{
    try{
        var result = await ChiTietPhieuNhap.findById(request.params.id).exec();
        var phieunhap = await PhieuNhap.findById(result.phieunhap_id).exec();
        var ma_phieunhap = result.phieunhap_id;
        if (result){
            //PHIEU NHAP DRAFT
            if (phieunhap.trangthai == false){
                var res = await ChiTietPhieuNhap.deleteOne({ _id: request.params.id}).exec();
                //CAP NHAT PHIEU NHAP
                var tongnhap = phieunhap.tongnhap - result.soluongnhap;
                var tongtien = phieunhap.tongtien - (result.soluongnhap * result.dongianhap);
                var nd = await PhieuNhap.update(
                    { _id: ma_phieunhap}, 
                    {$set: 
                        {tongnhap: tongnhap, tongtien: tongtien}
                    }).exec();
                //END

                response.json({
                    message: 'Product deleted successfully',
                    trangthai: phieunhap.trangthai
                });
            //PHIEU NHAP SAVED
            } else {
                var ma_chitietsp = result.chitietsanpham_id;
                var sl_nhap = result.soluongnhap;
                var ctsp = await ChiTietSanPham.findById(ma_chitietsp).exec();
                var update_ctsp = await ChiTietSanPham.update(
                        { _id: ma_chitietsp}, 
                        {$set: {soluong: ctsp.soluong - sl_nhap}}
                    ).exec();

                var res = await ChiTietPhieuNhap.deleteOne({ _id: request.params.id}).exec();
                //CAP NHAT PHIEU NHAP
                var tongnhap = phieunhap.tongnhap - result.soluongnhap;
                var tongtien = phieunhap.tongtien - (result.soluongnhap * result.dongianhap);
                var nd = await PhieuNhap.update(
                    { _id: ma_phieunhap}, 
                    {$set: 
                        {tongnhap: tongnhap, tongtien: tongtien}
                    }).exec();
                //END
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

//UPDATE Product in Stock Receipt
exports.chitietphieunhap_update = async(request, response)=>{
    var errors = validationResult(request)
    if (!errors.isEmpty()){
        response.json({
            error: errors
        })
    }
    try{ 
        var ma_ctpn = request.params.id;
        var soluongnhap_moi = request.body.soluongnhap;
        var dongianhap_moi = request.body.dongianhap;
        var result = await ChiTietPhieuNhap.findById(ma_ctpn).exec();
        var soluongnhap_cu = result.soluongnhap;
        var ma_phieunhap = result.phieunhap_id;
        var ma_sanpham = result.chitietsanpham_id;
        var phieunhap = await PhieuNhap.findById(ma_phieunhap).exec();
        var ctsp_cu = await ChiTietSanPham.findById(ma_sanpham).exec();
        if (result){  
            
            //CN SO LUONG TON
            if (phieunhap.trangthai == true){
                var slton = ctsp_cu.soluong;
                var slton_moi = slton + (soluongnhap_moi - soluongnhap_cu);
                var cn_ctsp = await ChiTietSanPham.update(
                    { _id: ma_sanpham}, 
                    { $set: {soluong: slton_moi} }
                ).exec();
            } 
            //CN CTPN
            var cn_ctpn = await ChiTietPhieuNhap.update(
                {_id: ma_ctpn},
                {$set: {
                    soluongnhap: soluongnhap_moi, 
                    dongianhap: dongianhap_moi
                }});
            var ctpn = await ChiTietPhieuNhap.findById(ma_ctpn).exec();
            response.json({
                    success: true,
                    message: 'Product updated successfully',
                    result: result,
                    data: ctpn
            });    
        }else{
            response.json({
                success: false,
                message: 'Product not found'
            });
        }
    } catch(error){
        response.send(error);
    }
}

